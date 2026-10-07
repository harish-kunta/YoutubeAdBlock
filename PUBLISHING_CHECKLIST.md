# Chrome Web Store submission audit and checklist

Last known dashboard state: version **1.0.8** was submitted for first review on **October 7, 2026**, with automatic publishing selected. A local replacement build **1.0.9** now includes stronger privacy disclosures. Check the dashboard and publisher email before making release decisions; pending review means the listing is not yet public.

## Findings from the current submission

### Fixed in the local 1.0.9 source

- [x] The privacy policy now explains that selected YouTube page elements, request URLs, and player-response fields are processed locally to provide the advertised controls.
- [x] The popup now gives users a visible local-processing disclosure and a direct privacy-policy link.
- [x] The listing and README now describe local page processing, Chrome Sync preferences, and optional user-submitted GitHub reports consistently.
- [x] The privacy policy states the extension's Limited Use commitments and distinguishes optional GitHub reports from automatic data transmission.
- [x] The privacy policy is hosted as a publicly readable GitHub Markdown page. GitHub renders it as a normal HTTPS webpage, which is suitable for the store's privacy-policy link field.

### Still needs attention in the Developer Dashboard

- [ ] Review the Privacy practices data-use selections against the new disclosure. This extension locally processes YouTube page content and browsing activity as required for the disclosed features; it does not transmit that page data to the developer. Ensure the selected data categories and Limited Use certifications describe local processing truthfully and match `PRIVACY.md` and the shipped build. Do not describe this as “no data handling.”
- [ ] Replace the uploaded designed mockup `dist/store-screenshot-1.png` with at least one screenshot of the actual extension running in Chrome. Store screenshots should show the real user experience and match the submitted build.
- [ ] Confirm that the listing has the required 440x280 small promotional tile, then upload `store-assets/small-promo-440x280.png` if it is missing. The prior submission record only confirms a store icon and a designed screenshot.
- [ ] Confirm the store's privacy-policy URL points to `https://github.com/harish-kunta/YoutubeAdBlock/blob/main/PRIVACY.md` and that the homepage and support URLs still work.
- [ ] Confirm the listing description includes the local page-processing disclosure from `STORE_LISTING.md`, the unofficial/non-affiliation wording, and the known movie playback limitation. Do not promise that ads will never play or that every video will work.
- [ ] Submit replacement package 1.0.9 after updating the dashboard's privacy fields and real screenshot. This may restart review; inspect the dashboard's current state before replacing the pending 1.0.8 submission.

## Package and code review

- [x] Manifest V3; host access is limited to `https://www.youtube.com/*`.
- [x] Declared `storage` and `declarativeNetRequest` permissions are used by the implementation and have justifications in `STORE_LISTING.md`.
- [x] The package has 16, 48, and 128 pixel icons; package script places `manifest.json` at the ZIP root and includes only runtime files.
- [x] Prepared `dist/youtube-ad-shorts-controls-1.0.9.zip` and inspected its file list; `manifest.json` is at the ZIP root. `package.sh` was not run in this audit, so its automated tests have not been rerun here.
- [ ] Confirm the dashboard's remote-code declaration says no remote code, and verify the uploaded ZIP contains no externally hosted executable code, obfuscation, secrets, or development artifacts.
- [ ] Re-run the browser QA matrix in `MANUAL_QA.md` against the exact package. In particular, visually verify regular-video playback, pre-roll and mid-roll behavior, reload/toggle recovery, Shorts settings, and the known free-movie blank-frame case. The current manual notes show unresolved movie playback failures.
- [ ] Confirm the Dashboard single-purpose statement, permission justifications, privacy disclosures, and listing text all match the exact uploaded version.

## Risks to understand before continuing

- Chrome Web Store approval is not guaranteed. Chrome's current policies emphasize accurate disclosures, narrow permissions, useful working features, non-misleading listings, and non-obfuscated, reviewable code.
- YouTube's Terms of Service restrict modifying or interfering with the service. This extension modifies selected YouTube player-response data and request handling, so there is a platform-terms risk separate from Chrome Web Store approval. This checklist is not legal advice.
- Free-with-ads movies have shown blank video frames in manual checks, sometimes even while the extension was paused. This limitation is disclosed in the UI and listing, but it remains a significant quality risk.

## Frequent submission mistakes to avoid

- Privacy dashboard, privacy policy, store listing, and actual code describe different data practices.
- Treating local page processing as “no data handling” or failing to disclose what page data the extension processes.
- Requesting broad host or sensitive permissions without a direct feature-based justification.
- Shipping remote executable code in Manifest V3, obfuscated code, or code that is unnecessarily difficult to review.
- Uploading inaccurate screenshots, missing required image assets, or promotional claims the extension cannot substantiate.
- Overpromising functionality, omitting known breakage, or submitting with core flows that fail.
- Keyword stuffing, misleading affiliation/branding, deceptive install flows, duplicate extensions, or manipulated reviews/ratings.
- Missing review emails or leaving an item pending/rejected without checking the dashboard's status details.

## Official references

- [Chrome Web Store privacy policies](https://developer.chrome.com/docs/webstore/program-policies/privacy)
- [Chrome Web Store 2026 policy update](https://developer.chrome.com/blog/cws-policy-updates-2026)
- [Fill out the privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Chrome Web Store policy troubleshooting](https://developer.chrome.com/docs/webstore/troubleshooting)
- [Screenshot and image requirements](https://developer.chrome.com/docs/webstore/images)
- [YouTube Terms of Service](https://www.youtube.com/t/terms)
