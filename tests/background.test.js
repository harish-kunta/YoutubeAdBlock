const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function loadBackground(initialRules = []) {
  const listeners = { install: null, startup: null, changed: null };
  const updates = [];
  let rules = initialRules;
  const chrome = {
    runtime: {
      onInstalled: { addListener: (fn) => { listeners.install = fn; } },
      onStartup: { addListener: (fn) => { listeners.startup = fn; } }
    },
    storage: {
      sync: { get: (_defaults, callback) => callback({ enabled: true }) },
      onChanged: { addListener: (fn) => { listeners.changed = fn; } }
    },
    declarativeNetRequest: {
      getDynamicRules: async () => rules,
      updateDynamicRules: async (update) => {
        updates.push(update);
        rules = rules.filter(({ id }) => !update.removeRuleIds.includes(id))
          .concat(update.addRules.map(({ id }) => ({ id })));
      }
    }
  };
  vm.runInNewContext(fs.readFileSync("background.js", "utf8"), { chrome, console });
  return { listeners, updates, getRules: () => rules };
}

test("startup installs only the current rules and removes retired IDs", async () => {
  const bg = loadBackground([{ id: 1 }, { id: 99 }]);
  bg.listeners.install();
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(Array.from(bg.updates[0].removeRuleIds), [1]);
  assert.deepEqual(Array.from(bg.updates[0].addRules, ({ id }) => id), [2, 3, 4]);
  assert.deepEqual(bg.getRules().map(({ id }) => id).sort(), [2, 3, 4, 99]);
});

test("rapid enabled then paused changes are applied in order", async () => {
  const bg = loadBackground();
  bg.listeners.changed({ enabled: { newValue: true } }, "sync");
  bg.listeners.changed({ enabled: { newValue: false } }, "sync");
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(bg.getRules().some(({ id }) => [2, 3, 4].includes(id)), false);
});
