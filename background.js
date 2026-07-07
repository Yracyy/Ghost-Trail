/*
 * Ghost Trail — Service Worker
 *
 * Two features:
 *  1. Disable History — deletes each visited URL the moment it's recorded
 *  2. Clear on Exit  — wipes all history when the last window closes
 *     (plus a startup clear as a safety net for browser shutdown races)
 */

// ── Window tracking for clear-on-exit ──
let openWindowCount = 0;

chrome.windows.getAll({ windowTypes: ["normal"] }, (windows) => {
  openWindowCount = windows.length;
});

// ── Feature 1: Disable History ──
// Registered at top level so it survives service worker restarts in MV3.
// Every time Chrome records a visit, we immediately remove it.
chrome.history.onVisited.addListener((result) => {
  chrome.storage.local.get("disableHistory", ({ disableHistory }) => {
    if (disableHistory) {
      chrome.history.deleteUrl({ url: result.url });
    }
  });
});

// ── Feature 2: Clear on Exit ──

// Safety net: if the browser killed the service worker before the
// close-time clear finished, we catch it on next startup.
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get("clearOnExit", ({ clearOnExit }) => {
    if (clearOnExit) {
      chrome.history.deleteAll();
    }
  });
});

chrome.windows.onCreated.addListener((window) => {
  if (window.type === "normal") openWindowCount++;
});

chrome.windows.onRemoved.addListener(() => {
  openWindowCount--;
  if (openWindowCount <= 0) {
    chrome.storage.local.get("clearOnExit", ({ clearOnExit }) => {
      if (clearOnExit) {
        chrome.history.deleteAll();
      }
    });
    openWindowCount = 0;
  }
});