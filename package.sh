#!/bin/sh
set -eu

cd "$(dirname "$0")"

node --check background.js
node --check content.js
node --check player-filter.js
node --check popup.js
node --test tests/*.test.js

node -e '
const fs = require("node:fs");
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
if (manifest.manifest_version !== 3) throw new Error("Manifest V3 is required");
if (!manifest.version || !manifest.name || !manifest.description) throw new Error("Missing required manifest metadata");
if (!manifest.permissions.includes("storage") || !manifest.permissions.includes("declarativeNetRequest")) throw new Error("Expected permissions are missing");
if (manifest.host_permissions.some((permission) => permission !== "https://www.youtube.com/*")) throw new Error("Unexpected host permission");
for (const path of ["background.js", "content.js", "player-filter.js", "styles.css", "popup.html", "popup.js", "popup.css", ...Object.values(manifest.icons), ...Object.values(manifest.action.default_icon)]) {
  if (!fs.existsSync(path)) throw new Error(`Missing package file: ${path}`);
}
console.log(`Manifest ${manifest.version} and package files validated.`);
'

mkdir -p dist
zip -q -r "dist/youtube-ad-shorts-controls-$(node -p 'require("./manifest.json").version').zip" \
  manifest.json background.js content.js player-filter.js styles.css popup.html popup.js popup.css \
  icons/icon16.png icons/icon48.png icons/icon128.png
echo "Created the Chrome Web Store package in dist/."
