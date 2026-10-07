(() => {
  const DEFAULTS = { enabled: true, hideShorts: true };
  const SKIP_SELECTORS = [
    ".ytp-ad-skip-button",
    ".ytp-ad-skip-button-modern",
    ".ytp-skip-ad-button",
    "button.ytp-ad-overlay-close-button"
  ];
  const SHORTS_CARD_SELECTOR = [
    "ytd-reel-shelf-renderer",
    "ytd-rich-shelf-renderer",
    "ytd-shorts",
    "ytd-shorts-player",
    "ytd-reel-video-renderer",
    "ytd-rich-item-renderer",
    "ytd-video-renderer",
    "ytd-grid-video-renderer",
    "ytd-compact-video-renderer",
    "ytm-video-with-context-renderer"
  ].join(",");
  const SHORTS_NAV_SELECTOR = [
    "ytd-guide-entry-renderer",
    "ytd-mini-guide-entry-renderer",
    "ytd-guide-collapsible-entry-renderer"
  ].join(",");

  let enabled = DEFAULTS.enabled;
  let hideShorts = DEFAULTS.hideShorts;
  let shortsScanQueued = false;

  function applyPageSettings() {
    const root = document.documentElement;
    if (!root) return;
    root.classList.toggle("yta-helper-enabled", enabled);
    root.classList.toggle("yta-shorts-hidden", hideShorts);
    scheduleShortsScan();
  }

  function skipAds() {
    if (!enabled) return;

    for (const selector of SKIP_SELECTORS) {
      document.querySelectorAll(selector).forEach((button) => {
        if (button instanceof HTMLButtonElement && button.getClientRects().length) {
          button.click();
        }
      });
    }

    const video = document.querySelector("video.html5-main-video");
    const player = document.querySelector(".html5-video-player.ad-showing");
    if (video && player && Number.isFinite(video.duration) && video.duration > 0) {
      // Some ads expose no skip button. Seek to the end only while YouTube marks
      // the player as showing an ad; never change regular video playback.
      if (video.currentTime < video.duration - 0.25) {
        video.currentTime = video.duration;
      }
    }
  }

  function scanShorts() {
    shortsScanQueued = false;
    if (!document.documentElement) return;

    if (!hideShorts) {
      document.querySelectorAll("[data-yta-hidden-shorts]").forEach((element) => {
        element.removeAttribute("data-yta-hidden-shorts");
      });
      return;
    }

    document.querySelectorAll(
      "ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts], ytd-shorts, ytd-shorts-player, ytd-reel-video-renderer"
    ).forEach((element) => element.setAttribute("data-yta-hidden-shorts", ""));

    document.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const label = (anchor.getAttribute("aria-label") || anchor.textContent || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
      const isShortsUrl = href.includes("/shorts");
      const isShortsEntry = label === "shorts";
      if (!isShortsUrl && !isShortsEntry) return;

      const target = isShortsEntry
        ? anchor.closest(SHORTS_NAV_SELECTOR) || anchor
        : anchor.closest(SHORTS_CARD_SELECTOR) || anchor;
      target.setAttribute("data-yta-hidden-shorts", "");
    });
  }

  function scheduleShortsScan() {
    if (shortsScanQueued) return;
    shortsScanQueued = true;
    // YouTube creates many DOM mutations while rendering. Debounce whole-page
    // Shorts discovery so the extension does not rescan every frame.
    window.setTimeout(scanShorts, 250);
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    applyPageSettings();
    window.postMessage({ tag: "youtube-ad-blocker", enabled }, "*");
    if (enabled) skipAds();
  }

  chrome.storage.sync.get(DEFAULTS, ({ enabled: storedEnabled, hideShorts: storedHideShorts }) => {
    setEnabled(storedEnabled);
    hideShorts = Boolean(storedHideShorts);
    applyPageSettings();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.enabled) setEnabled(changes.enabled.newValue);
    if (area === "sync" && changes.hideShorts) {
      hideShorts = Boolean(changes.hideShorts.newValue);
      applyPageSettings();
    }
  });

  function startWatching() {
    applyPageSettings();
    const observer = new MutationObserver(scheduleShortsScan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.setInterval(skipAds, 500);
  }

  if (document.documentElement) startWatching();
  else new MutationObserver((_, mutationObserver) => {
    if (!document.documentElement) return;
    mutationObserver.disconnect();
    startWatching();
  }).observe(document, { childList: true, subtree: true });
})();
