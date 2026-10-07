// Include the retired rule ID so upgrades clean up rules from earlier builds.
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

let updateQueue = Promise.resolve();

function applyAdBlocking(enabled) {
  // Serialize updates so a quick on/off toggle cannot leave stale rules installed.
  updateQueue = updateQueue.then(async () => {
    const existing = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existing.map(({ id }) => id).filter((id) => AD_RULE_IDS.includes(id));
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: enabled ? AD_RULES : []
    });
  });
  return updateQueue.catch((error) => {
    console.error("Unable to update YouTube ad filtering rules:", error);
  });
}

function restoreAdBlocking() {
  chrome.storage.sync.get({ enabled: true }, ({ enabled }) => {
    void applyAdBlocking(Boolean(enabled));
  });
}

chrome.runtime.onInstalled.addListener(() => {
  restoreAdBlocking();
});

chrome.runtime.onStartup.addListener(() => {
  restoreAdBlocking();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.enabled) {
    void applyAdBlocking(Boolean(changes.enabled.newValue));
  }
});
