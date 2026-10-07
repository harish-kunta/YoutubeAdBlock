# Chrome Web Store publishing checklist

Status: **preparation in progress — do not submit until all release gates are checked.** A successful local load does not mean Chrome Web Store approval.

## Product and policy

- [ ] Confirm that the extension complies with the current Chrome Web Store Developer Program Policies and Developer Agreement.
- [ ] Review YouTube's current Terms of Service and decide whether to distribute a tool that hides or modifies YouTube ads. YouTube's terms restrict altering or modifying parts of its service except where permitted. This is a material policy/legal risk; get qualified advice if needed.
- [ ] Do not promise that ads will “never” play or that all movies/videos will work. Describe the actual limited, changeable behavior.
- [ ] Keep the unofficial/non-affiliation disclosure in the listing and extension UI; avoid YouTube logos and branding that implies endorsement.
- [ ] Confirm the privacy policy accurately matches the shipped code and is hosted at a stable, public HTTPS URL.
- [ ] Select and publish a support contact/repository URL; replace placeholders in the policy and README.

## Code and package

- [x] Use Manifest V3 and scope host access to YouTube.
- [x] Add 16, 48, and 128 pixel PNG icons.
- [x] Declare a minimum Chrome version compatible with the `world: MAIN` content script setting.
- [x] Add an opt-in popup feedback link and structured public GitHub issue forms; no reports are sent automatically.
- [ ] Reassess the main-world `fetch`/XHR response rewriting: it changes page APIs and player data and is the highest playback/regression risk. Test against current YouTube behavior and remove or redesign it if reliable playback cannot be demonstrated.
- [ ] Add automated checks for manifest validity, rule installation/removal, settings persistence, SPA navigation, Shorts toggles, and player response handling.
- [ ] Run manual QA on clean Chrome profiles with no other blockers, then with popular blockers one at a time; include regular videos, ads, movies, Shorts, seek/pause/resume, reload, and playback errors. Capture visual evidence for every pass.
- [ ] Resolve or explicitly document known playback failures, including Free-with-ads movie rendering. Current manual results include white movie frames, so the extension is **not yet release-verified**.
- [ ] Verify service-worker startup, install/update/uninstall behavior, storage failures, DNR failures, and paused/enabled state after reload.
- [ ] Review every permission and explain it in the Dashboard. Keep permissions and network access no broader than necessary.
- [ ] Inspect the final ZIP: only required runtime assets, no source maps/secrets/test captures/development leftovers; verify package opens and matches the reviewed source.
- [ ] Increment `version` for every uploaded package. Version `1.0.2` is currently prepared locally.

## Store listing and account

- [ ] Register/complete the Chrome Web Store developer account and satisfy current account security/verification requirements.
- [ ] Prepare final title, short and detailed descriptions, category, language, support URL, and privacy policy URL; see [`STORE_LISTING.md`](STORE_LISTING.md).
- [ ] Capture genuine screenshots of the final build and prepare any promotional images using current image specifications.
- [ ] Complete the Privacy practices tab: single purpose, data collection/use/sharing disclosures, Limited Use certification, and a justification for each permission. Ensure it agrees with `PRIVACY.md` and actual behavior.
- [ ] Set distribution visibility, regions, and pricing; identify the publisher/developer name shown to users.
- [ ] Provide reviewer instructions and a test account only if needed; do not include personal credentials unnecessarily.
- [ ] Upload the ZIP to the Developer Dashboard, inspect the package and listing preview, then submit for review. Consider deferred publishing until review is complete and the release has been rechecked.
- [ ] Monitor review status and developer email; address rejection feedback and increment the version when uploading a corrected package.

## After release

- [ ] Monitor user reports and Chrome Web Store reviews; provide a public issue/support path.
- [ ] Track YouTube page changes and Chrome API changes; keep filters narrow and remove broken rules quickly.
- [ ] Maintain a changelog, security contact, and a process for responding to vulnerability reports.
- [ ] Re-run the release checklist and update privacy disclosures before any change to permissions or data handling.

## Current release assessment

The repository is better prepared for review, but it is **not production-ready for public release yet**: playback QA is incomplete and includes a reproducible white-frame movie issue; store screenshots, public policy/contact URLs, and full regression checks are outstanding. Chrome Web Store acceptance is decided by Google and cannot be guaranteed.
