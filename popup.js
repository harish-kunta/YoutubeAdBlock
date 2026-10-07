const checkbox = document.querySelector("#enabled");
const status = document.querySelector("#status");
const shortsCheckbox = document.querySelector("#hide-shorts");
const shortsStatus = document.querySelector("#shorts-status");

function render(enabled) {
  checkbox.checked = Boolean(enabled);
  status.textContent = enabled ? "Active" : "Paused";
  status.classList.toggle("on", Boolean(enabled));
}

function renderShorts(hideShorts) {
  shortsCheckbox.checked = Boolean(hideShorts);
  shortsStatus.textContent = hideShorts ? "Hidden" : "Shown";
  shortsStatus.classList.toggle("on", Boolean(hideShorts));
}

chrome.storage.sync.get({ enabled: true, hideShorts: true }, ({ enabled, hideShorts }) => {
  render(enabled);
  renderShorts(hideShorts);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  if (changes.enabled) render(changes.enabled.newValue);
  if (changes.hideShorts) renderShorts(changes.hideShorts.newValue);
});

checkbox.addEventListener("change", () => {
  const enabled = checkbox.checked;
  render(enabled);
  chrome.storage.sync.set({ enabled });
});

shortsCheckbox.addEventListener("change", () => {
  const hideShorts = shortsCheckbox.checked;
  renderShorts(hideShorts);
  chrome.storage.sync.set({ hideShorts });
});
