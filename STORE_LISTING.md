# Chrome Web Store listing draft

## Name

YouTube Ad & Shorts Controls

## Short description

Unofficial controls for common YouTube ad placements and Shorts. Playback compatibility can vary.

## Detailed description

An unofficial, open-source extension with controls for common YouTube ad placements and Shorts distractions.

- Hide common in-page ad placements and matching empty feed cards.
- Attempt to skip some in-player ads.
- Hide Shorts shelves, links, cards, and player surfaces with a separate setting.
- Pause ad handling independently from Shorts hiding.
- Open a guided feedback form when the user chooses to report a problem.

Ad delivery and YouTube's page structure change over time. Coverage is not guaranteed, and filtering can affect playback. The extension runs only on YouTube and stores the two preferences using Chrome Sync. It does not collect analytics or send browsing activity to the developer.

Known limitation: some free-with-ads movies may play audio while showing a blank video. If this happens, pause the extension and reload the video. Regular creator videos rendered in our manual checks; results can vary by title, account, browser, and other extensions.

Nothing is sent automatically. User-submitted feedback goes to GitHub and may be public. This extension is not affiliated with, endorsed by, or sponsored by YouTube or Google. YouTube is a trademark of Google LLC.

## Single purpose

Provide user controls to hide common YouTube ad placements and Shorts entry points on YouTube.

## Permission justifications

- `storage`: persist the user's ad handling and Shorts visibility preferences.
- `declarativeNetRequest`: apply the small set of declared YouTube ad request rules.
- `https://www.youtube.com/*`: run the page filter and styles only on YouTube.

## Support and privacy URLs

- Support: https://github.com/harish-kunta/YoutubeAdBlock/issues
- Privacy policy: https://github.com/harish-kunta/YoutubeAdBlock/blob/main/PRIVACY.md

## Required listing assets (not included in source package)

- At least one accurate screenshot of the extension in use, captured from the final release build.
- Confirm current Chrome Web Store image dimensions and create any desired promotional tiles.
- Use only original artwork or assets with documented permission; do not use YouTube's logo as the extension's icon.
