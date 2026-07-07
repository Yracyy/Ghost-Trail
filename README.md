# Ghost Trail

A minimal Chromium extension that gives you two history controls: disable history tracking entirely, or auto-clear it when you close the browser. No bloat, no network access, no analytics.

## How it works

**Disable History** — Chromium fires `history.onVisited` every time a page is recorded. Ghost Trail listens for that event and immediately calls `history.deleteUrl` for the visited URL. The entry exists for a fraction of a millisecond. It never appears in the history panel, autocomplete suggestions, or anywhere else.

**Clear on Exit** — The service worker tracks how many browser windows are open. When the last one closes, it calls `history.deleteAll()`. Since Manifest V3 service workers can be killed mid-operation during browser shutdown, a second clear runs on next startup as a safety net. Either way, history never persists between sessions.

Both features are independent and can be used together or separately.

## Requirements

- Any Chromium-based browser (Chrome, Edge, Brave, Helium, etc.)
- Manifest V3 support

**Manual install:**

1. Clone repo or download as ZIP file
2. Extract it to a permanent location (don't delete the folder after installing)
3. Go to `chrome://extensions` (or `edge://extensions`, `brave://extensions`, etc.)
4. Enable **Developer mode** (toggle in the top-right corner)
5. Click **Load unpacked** and select the extracted `ghost-trail` folder

## Usage

Click the Ghost Trail icon in your toolbar to open the popup. Two toggles:

| Toggle | What it does |
|---|---|
| Disable History | Visited pages are deleted the instant they're recorded. Regular tabs behave like incognito for history purposes. |
| Clear on Exit | All history is wiped when you close the browser. Takes effect on next startup if the shutdown clear didn't finish. |

Changes take effect immediately — no restart needed.

## Permissions

| Permission | Why |
|---|---|
| `history` | Read and delete history entries |
| `storage` | Remember your toggle settings between sessions |

That's it. No `tabs`, no `webRequest`, no `<all_urls>`. Ghost Trail never sees your page content and nothing leaves your browser.

## Troubleshooting

**Disable History is on but I still see a brief flash in history**

This is expected. The entry is created by Chromium first, then deleted by Ghost Trail a moment later. In practice you'll never see it unless you have the history page open and refreshing at the exact same time.

**Clear on Exit didn't work**

The startup safety net should have caught it. If it didn't, check that the extension wasn't disabled or corrupted. Go to `chrome://extensions` and confirm Ghost Trail is enabled with no errors listed.

**Toggles reset after browser restart**

This shouldn't happen — settings are stored in `chrome.storage.local` which persists across sessions. If it does, the storage may be corrupted. Try removing and re-loading the extension.

## "Why not publish in Chrome Web Store?"

To publish an extension you need to pay 5$ USD to register CWS Dev and i dont to do that (im broke :P)

## License

MIT
