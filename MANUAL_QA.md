# YouTube Ad Blocker: Manual QA

Date: 2026-10-07
Environment: Google Chrome on macOS, signed-in YouTube profile, extension loaded unpacked.
Method: Browser UI checks; player time/control state inspected through accessibility plus visual screenshots. No automated test suite was run.

## Result summary

| Area | Result |
|---|---|
| Regular user-upload video playback | **Pass** — visible video and normal playback observed. |
| Ad visibility when extension is paused | **Fail for ad blocking (expected control case)** — a pre-roll ad and sponsored card were visible. |
| Ad blocking on regular videos when enabled | **Partial / needs repeat** — playback progressed with the blocker enabled, but a fresh visual capture of the same pre-roll case while enabled was not completed in this session. |
| Free-with-ads movie rendering | **Fail / unresolved** — multiple movie players showed a white frame despite advancing controls/audio state; at least Moonfall remained white with the extension both enabled and paused. |
| Movie stream start/recovery | **Intermittent** — one start showed “Unable to play media”; later reloads of the same title reached a normal duration and Pause control. |
| Shorts hiding, mid-roll ads, network recovery, end-of-video | **Not run** in this session. |

An advancing seek slider, Pause control, captions, or audio alone does not prove that video frames are rendering. A screenshot of the player surface is required for that assertion. The white movie frames also occurred with the extension paused, so this session does not establish that the extension caused them.

## Executed test cases

| ID | Scenario and steps | Expected | Observed | Status |
|---|---|---|---|---|
| MQA-01 | Open creator upload `T6hjCUgV_8E` with blocker paused; reload and wait about 10 seconds. | Content video renders; an ad may play while paused. | Visible pre-roll ad (Schneider electrician), Skip control/audio/captions, then video content. | **Pass** for video rendering; ad is expected while paused. |
| MQA-02 | Open the same creator upload with blocker active; wait and inspect player controls/captions. | Content starts and frames render; no ad state remains. | Playback reached 14:57 with Pause control and changing captions. No saved visual frame was captured for this enabled run. | **Partial** — activity confirmed, frame rendering/ad absence not visually confirmed in this run. |
| MQA-03 | Open The Mummy (`5d_wkxeTplo`) with blocker active and wait. | Movie frames render and timeline advances. | Timeline advanced to about 4:59 with Pause/audio/captions, but the player screenshot showed white. | **Fail** — blank frame. |
| MQA-04 | Pause blocker, keep The Mummy open, wait and inspect screenshot. | If extension causes blank frames, video should render after disabling it. | Timeline advanced to about 5:02; screenshot still showed a white player. Sponsored card was present outside the player. | **Fail** — blank persisted with blocker paused. |
| MQA-05 | Open Moonfall (`Iys-R6loI1A`) with blocker active; wait through the opening countdown. | Movie frames render after startup/countdown. | Countdown disappeared; movie duration/Pause control were present, but screenshot showed a white player. | **Fail** — blank frame. |
| MQA-06 | Pause blocker, reload Moonfall, wait about 10 seconds. | Movie frames render with extension inactive. | Player remained white; the related sponsored card became visible. | **Fail** — blank persisted with blocker paused. |
| MQA-07 | Open The Mummy Returns with blocker active. | Movie starts with duration and visible frames. | One attempt showed “Unable to play media,” 0:00 duration and Replay. | **Fail** — startup error reproduced once. |
| MQA-08 | Reload The Mummy Returns with blocker paused, then active; wait about 25 seconds. | Reload should recover to visible playback. | Subsequent attempts showed normal 2h09m duration and Pause; one timeline remained at 0:02. Visual frame rendering was not captured. | **Partial** — control state recovered; image output unverified. |
| MQA-09 | Open Good Will Hunting with blocker active; wait about 12 seconds. | Movie frames render and playback advances. | Normal movie duration/Pause/audio state appeared, but accessibility time remained at 0:02; no confirming screenshot. | **Inconclusive** — timeline/frame progress uncertain. |
| MQA-10 | Open The Longest Yard (`uGJv_zSRiR0`) with blocker active after removing the broad `initplayback` request block. | Stream should load without player error and render frames. | Timeline reached 16:59 of 1:53:27 with Pause/audio, no accessibility error. No screenshot confirmed frames. | **Partial** — playback state recovered; visual output unverified. |
| MQA-22 | Toggle blocker off then on; hard-reload the currently open regular upload, wait 15 seconds, inspect screenshot. | Fresh player load renders a visible scene with extension active. | Creator upload showed a visible scene and captions at 0:02 after reload. | **Pass** — regular upload rendered after the toggle/reload cycle. |
| MQA-23 | With blocker active, hard-reload The Mummy, wait 15 seconds, inspect screenshot and player state. | Fresh movie stream renders visible frames after reload. | Timeline was about 6:15 of 2:04:47, Pause control and changing captions appeared, but screenshot still showed a white player surface. | **Fail** — hard reload did not clear the movie blank frame. |
| MQA-24 | Temporarily remove the MAIN-world player-response filter from the manifest, reload the extension, hard-reload The Mummy, wait 15 seconds. | If response rewriting caused the blank frame, the movie should render without that script. | Timeline advanced to about 8:22 with audio/player controls, but screenshot remained white. | **Fail** — response rewriting alone does not explain the movie blank frame; the experiment was reverted. |

## Follow-up cases to execute

Run these after resolving the white movie frame issue. Record actual title, extension state, wait duration, seek value, visible frame result, and screenshot for each run.

| ID | Scenario | Steps | Pass condition |
|---|---|---|---|
| MQA-11 | Cold navigation | New tab → direct video URL with blocker active; wait 30 seconds. Repeat after browser restart. | Video frame appears, timeline advances, no ad overlay/pre-roll. |
| MQA-12 | SPA navigation | Navigate between two videos using YouTube links without reloading the tab. | Each new video starts; ad handling reinitializes; no stale blank overlay. |
| MQA-13 | Mid-roll transition | Play a long creator upload past a known mid-roll point. | Ad does not interrupt content; content frame resumes and audio/video stay synchronized. |
| MQA-14 | Seek during startup and playback | Seek to 10 seconds, then later to a point near a chapter/ad break. | Correct frame and audio resume; no frozen/white surface. |
| MQA-15 | Pause/resume and tab focus | Pause, resume, switch tabs for 30 seconds, return. | Playback state is correct and frames resume without blanking. |
| MQA-16 | Theater/fullscreen | Toggle theater and fullscreen during playback, then exit. | Video remains visible at each size; controls remain usable. |
| MQA-17 | Shorts hiding | Enable Shorts hiding; inspect Home, Search, subscriptions, and Shorts URL; then disable it. | Shorts are removed/blocked only while enabled; normal video cards remain usable. |
| MQA-18 | Extension setting persistence | Toggle ad blocking and Shorts separately; reload YouTube and restart Chrome. | Each setting persists independently and its displayed state matches behavior. |
| MQA-19 | Network interruption | Start a video, disconnect/reconnect network or use DevTools throttling; retry. | Player reports recoverable error and resumes visible video after retry. |
| MQA-20 | End-of-video/autoplay | Let a short upload finish with autoplay on and off. | End screen and next-video behavior are normal; no stuck ad state/blank player. |
| MQA-21 | Unsupported or removed video | Open private, age-restricted, unavailable, and region-restricted examples where available. | YouTube's normal error/access message is shown; extension does not leave a blank active player. |

## Current defect to investigate

Free-with-ads movie playback can report an active player while outputting a white frame. The issue was observed on The Mummy and Moonfall with the extension active and paused. The Mummy Returns also produced a transient “Unable to play media” state, then later recovered to normal duration/control state. Investigate movie/ad startup and stream compatibility separately from ad overlay removal. Do not treat a running timeline or audio as a visual playback pass.
