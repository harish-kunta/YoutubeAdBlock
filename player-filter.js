(() => {
  const EVENT_TAG = "youtube-ad-blocker";
  // Fail open until the isolated-world script loads the user's saved setting.
  let enabled = false;

  function stripAdData(value, seen = new WeakMap()) {
    if (!enabled || value === null || typeof value !== "object") return value;
    if (seen.has(value)) return seen.get(value);

    const result = Array.isArray(value) ? [] : {};
    seen.set(value, result);
    for (const [key, item] of Object.entries(value)) {
      if (["adPlacements", "playerAds", "adSlots", "adBreakHeartbeatParams"].includes(key)) continue;
      result[key] = stripAdData(item, seen);
    }
    return result;
  }

  function isPlayerResponse(url) {
    return /\/youtubei\/v1\/(player|next)(?:\?|$)/.test(url || "");
  }

  function cleanJsonText(text) {
    try {
      return JSON.stringify(stripAdData(JSON.parse(text)));
    } catch {
      return text;
    }
  }

  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const requestUrl = typeof args[0] === "string" ? args[0] : args[0]?.url;
    return originalFetch.apply(this, args).then((response) => {
      if (!enabled || !isPlayerResponse(requestUrl)) return response;

      const originalJson = response.json.bind(response);
      const originalText = response.text.bind(response);
      response.json = async () => stripAdData(await originalJson());
      response.text = async () => cleanJsonText(await originalText());
      return response;
    });
  };

  const xhrOpen = XMLHttpRequest.prototype.open;
  const xhrUrls = new WeakMap();
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    xhrUrls.set(this, String(url));
    return xhrOpen.call(this, method, url, ...rest);
  };

  for (const property of ["response", "responseText"]) {
    const descriptor = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, property);
    if (!descriptor?.get || !descriptor.configurable) continue;
    Object.defineProperty(XMLHttpRequest.prototype, property, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get() {
        const value = descriptor.get.call(this);
        if (!enabled || !isPlayerResponse(xhrUrls.get(this))) return value;
        if (property === "responseText" && typeof value === "string") return cleanJsonText(value);
        if (property === "response" && value && typeof value === "object") return stripAdData(value);
        if (property === "response" && typeof value === "string") return cleanJsonText(value);
        return value;
      }
    });
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.data?.tag !== EVENT_TAG) return;
    enabled = Boolean(event.data.enabled);
  });

  window.postMessage({ tag: EVENT_TAG, ready: true }, "*");
})();
