const disableHistoryEl = document.getElementById("disableHistory");
const clearOnExitEl = document.getElementById("clearOnExit");

// Load saved settings into the toggles
chrome.storage.local.get(
  { disableHistory: false, clearOnExit: false },
  (settings) => {
    disableHistoryEl.checked = settings.disableHistory;
    clearOnExitEl.checked = settings.clearOnExit;
  }
);

// Persist on every toggle change
disableHistoryEl.addEventListener("change", () => {
  chrome.storage.local.set({ disableHistory: disableHistoryEl.checked });
});

clearOnExitEl.addEventListener("change", () => {
  chrome.storage.local.set({ clearOnExit: clearOnExitEl.checked });
});