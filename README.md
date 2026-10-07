# YouTube Ad & Shorts Controls

An unofficial, open-source Chrome extension that hides common YouTube ad placements, attempts to skip some in-player ads, and can hide Shorts entry points. YouTube changes its site and delivery systems, so ad coverage is not guaranteed. Blocking may also affect playback.

This project is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.

## Install for development

1. Open `chrome://extensions` in Chrome 111 or newer.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select this folder.
4. Open or refresh a YouTube tab.

## What it does

- Applies a small set of network request rules for known ad endpoints initiated by YouTube.
- Removes known ad metadata from YouTube player responses in the page's main JavaScript world.
- Clicks visible skip controls and seeks to the end only while YouTube marks the player as showing an ad.
- Hides common ad placements and collapses matching ad cards.
- Optionally hides Shorts navigation, shelves, cards, and player routes.

YouTube can change any of these behaviors. In particular, filtering player responses modifies page behavior and can break playback. If playback fails, pause the extension, reload YouTube, and compare with all other extensions disabled.

## Privacy

The extension does not include analytics, advertising, accounts, or a developer-operated server. It stores only the two user preferences (`enabled` and `hideShorts`) using Chrome's `storage.sync`; Chrome may synchronize those settings according to the user's Chrome account settings. It does not collect or transmit browsing history or video content to the developer. See [`PRIVACY.md`](PRIVACY.md).

## Open source and contributions

The project is released under the MIT License. See [`LICENSE`](LICENSE). Contributions should include reproducible steps and test results; do not submit private account data, cookies, or captured video content.

## Release files

- `manifest.json` — Chrome Manifest V3 package metadata and permissions.
- `MANUAL_QA.md` — current manual test results and remaining cases.
- `PUBLISHING_CHECKLIST.md` — Chrome Web Store preparation and release gates.
- `STORE_LISTING.md` — draft listing text and assets still needed.
- `CHANGELOG.md` — release history.

## Support

Use **Report a problem or share feedback** in the popup to open a guided GitHub form. Nothing is sent unless the user chooses to submit the form. Reports are public; never include passwords, cookies, account details, or private video links. See [`PRIVACY.md`](PRIVACY.md).
