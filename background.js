const AD_RULE_IDS = [1, 2, 3, 4];

const AD_RULES = [
  {
    id: 2,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "||doubleclick.net^",
      requestDomains: ["doubleclick.net"],
      initiatorDomains: ["youtube.com"],
      resourceTypes: ["xmlhttprequest", "sub_frame", "script", "image"]
    }
  },
  {
    id: 3,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "||googlesyndication.com/pagead/",
      requestDomains: ["googlesyndication.com"],
      initiatorDomains: ["youtube.com"],
      resourceTypes: ["xmlhttprequest", "sub_frame", "script", "image"]
    }
  },
  {
    id: 4,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "||googleadservices.com/pagead/",
      requestDomains: ["googleadservices.com"],
      initiatorDomains: ["youtube.com"],
      resourceTypes: ["xmlhttprequest", "sub_frame", "script", "image"]
    }
  }
];

async function applyAdBlocking(enabled) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const existingIds = existing.map(({ id }) => id).filter((id) => AD_RULE_IDS.includes(id));
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingIds,
    addRules: enabled ? AD_RULES : []
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabled: true }, ({ enabled }) => applyAdBlocking(enabled));
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get({ enabled: true }, ({ enabled }) => applyAdBlocking(enabled));
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.enabled) applyAdBlocking(changes.enabled.newValue);
});
