# Bullwhip Effect Simulator — Project Master File

> Hakan + Claude collaboration | Last updated: April 2026
> **Give this file to every Cline session as context.**
> **Update it as the project evolves. Single source of truth.**

---

## Product Summary

A steering delay simulator. The user drives a car; the delay slider controls information lag. High delay = wheels don't follow input (momentum + inertia) = the bullwhip effect is physically felt.

**Two identities, same engine:**
- 🎓 **Education mode:** "Bullwhip Effect Simulator" | subtitle: "Delay & Control" → Yeditepe University, logistics courses. **This is the MVP. This is where we are now.**
- 🍺 **Consumer mode:** "Drunk Driver Simulator" | subtitle: "How Impaired Are You?" → POST-MVP. Do not implement yet.

**Second product (separate project):** Ball rolling on a tilting tray, with delay effect. Separate conversation, separate files. Do not mix with this project.

---

## What Is Built (v0.4 → v0.5)

### Physics & Game Engine
- Momentum-based physics: `viscousSteer + steerVelocity`
- Seeded road: `ROAD_SEED=42` — same road every run, fair comparison across delay settings
- Step-based ◀ ▶ buttons (hold position, no spring-back)
- All config sliders lock when game starts
- Car fixed at bottom of canvas (`CAR_Y_FRAC=0.88`), road scrolls upward

### Visuals
- Road surface: asphalt grey. Off-road: green pasture. (Old versions had both dark — fixed in v0.4)
- Ghost forecast line removed. Replaced with **car path trace**: green = on road, red = off road
- Skid marks: red, max 200 entries
- Car flashes red when off-road
- Tappable ▶ play button drawn on canvas (not a DOM element — drawn in `drawStatic()`, hit-tested via `PLAY_BTN` object)
- Fog overlay = unknown future demand. Headlight slider sets the visible forecast horizon.

### UI & Internationalisation
- Dark mode default. ☀/☾ toggle top-left.
- EN/TR language toggle: in main header AND inside welcome popup
- **Device language auto-detect:** `navigator.language` → Turkish OS = opens in Turkish
- Footer: [Prof. Dr. Erkut AKKARTAL](https://scholar.google.com/citations?user=O5LOOKYAAAAJ&hl=tr) | [Yeditepe Üniversitesi](https://yeditepe.edu.tr/tr) | 2026
- Session history table: delay, speed, duration, headlight, on-road %, violations
- Haptic feedback on violation (mobile)
- Sound: beep on violation, sawtooth oscillator warning while off-road

### Architecture (rebuilt from scratch in v0.4)
- **Single `G` object** = all game state. `draw()` reads only, never writes to `G`.
- `resizeCanvas()` → one responsibility: set CH and canvas.height
- `updateFogOverlay()` → one responsibility: set CSS height of fog div
- `audio` object → fully isolated
- All JS inside one IIFE (no global scope pollution)
- Off-road detection: computed once per frame in `loop()`, stored in `G.isOff`. Never recomputed in `draw()`.

---

## Open Bugs & Feature Backlog

**Remaining (v0.9 backlog):**
- Scenario system (Medium)

---

## Completed (v0.8) + Next Tasks (Priority Order)

### v0.8.2 Shipped ✅
**Bug Fixes & Refactoring:**
- ✅ **Spacebar Modal Bypass:** Fixed a bug where pressing spacebar would start a game in the background without closing the active modal (Results/Chart/Welcome).
- ✅ **Render Optimization:** `drawStatic()` no longer pointlessly regenerates the 16,000-segment road array upon every window resize, eliminating UI lag.
- ✅ **DOM Cleanup:** Fixed a duplicate, unclosed `div.expl` wrapper. Removed all deprecated JS references to the old `btnGo` element.

**Version:** Bumped to v0.8.2 across all display text.

### Short Term (v0.9)
1. Gyroscope steering (DeviceOrientation API)


### Medium Term - POST MVP (v1.0+)
4. **Scenario System:** Allow users to pick scenarios (Logistics, Drunk Driver, Sleep Deprivation). Each changes the delay slider's label, unit, and the `(i)` info tooltips to show scenario-specific facts.
5. Global leaderboard (Firebase/Supabase)
6. Endless mode, classroom dashboard, chiptune soundtrack

### Engineering Safeguards & Learnings (DO NOT IGNORE)
- **HTML DOM References (Fatal Crashes):** Attempting to reference deleted DOM elements (like `btnGo` which was replaced by the canvas play button) will throw a `TypeError` on load and abort the entire script. This silently skips `showWelcome` and `resizeCanvas`, resulting in a collapsed window and skipped popup. Always add null checks (`if (element)`) if there's a chance a DOM element has been phased out of the HTML.
- **Path Oscillation Chart Learnings:** The initial attempt to draw the post-game chart in v0.8 broke the flow and was temporarily commented out. When we attempt this again, remember:
  1. **Chart Rendering:** The analytical chart is massive. We abandoned drawing it onto the main canvas (`drawPathOscillationChart`) in favour of a dedicated full-screen DOM modal (`chartMo`). `endGame()` opens the initial result modal, and the user clicks to view the full chart modal.
  2. **Data Truncation:** `G.pathTrace` was capped at 400 frames (~6.6s) to save memory, truncating the chart. The limit was removed to store the whole session, but to maintain 60FPS, the `draw()` loop for trails/skidmarks was optimized to iterate backwards and `break` early.
  3. **Math (Absolute vs Relative):** Plotting `G.carX` alone fails to show the bullwhip effect. We must plot the road centreline (`seg.ox`) as the baseline curve and the car's path over it.
- **i18n Dictionary Overrides HTML:** The welcome popup text is populated dynamically by `applyWelcomeText()`. If you bump the version in the HTML but forget to bump `wVer` in `S.en` and `S.tr`, the old version will be injected and override the HTML. Always update the dictionaries.
- **Canvas Sizing vs `display:none`:** The `resizeCanvas()` function previously failed when the canvas was hidden behind the welcome popup because `offsetWidth` was returning `0`. It now uses a fallback `Math.min(1200, vw - 20)`. Never assume a canvas has a valid width if it might be obscured.
- **Tool Execution Verification:** Do not issue `attempt_completion` unless you have explicitly executed and verified the file modifications via `replace_in_file`. Prevent hallucination loops.
- **Z-Index Layering & Modals:** Be careful when drawing features on the canvas (like the Path Oscillation Chart) if a DOM modal (like the Result modal) triggers at the same time and covers it up. 


---

## Major Features — Post-MVP Backlog

### Scenario System
Each scenario changes the delay slider's label, unit, and emoji degradation animation. The (i) info buttons show scenario-specific clinical/academic facts.

| Scenario | Slider unit | Delay represents |
|----------|-------------|-----------------|
| 📦 Logistics / Bullwhip | Weeks | Information lag in supply chain |
| 🍺 Drunk Driver | Number of drinks | Blood alcohol level |
| 😴 Sleep Deprivation | Hours awake | Cognitive slowdown |
| 💊 Medication | Doses | Drug effect on reaction time |
| 🎂 Aging Driver | Age (50→90) | Neurological slowing |
| 📡 Drone / Remote Control | km distance | Signal propagation delay |
| 🚀 Mars Rover | Millions of km | Speed-of-light delay |

### Path Oscillation Chart (post-game)
After the run ends, display a chart showing the car's lateral deviation from the road centreline over time. When the road curves like a sine wave, the car's path should show a delayed, higher-amplitude, overshooting sine wave. This makes the bullwhip effect visually explicit for students.

### Gyroscope Steering
Tilt the phone left/right to steer (DeviceOrientation API, gamma axis). iOS requires explicit permission prompt. Strongest pedagogical impact — the delay is felt physically in the hands.

### Global Leaderboard
```
FinalScore = onRoad% × (1 + delay/15) × speedMultiplier
```
Minimum conditions: delay ≥ 5, duration ≥ 30s. Firebase or Supabase free tier is sufficient.
Viral share mechanic: auto-generated image/text → WhatsApp / Instagram.

### Other Backlog
- Two-player mode: one steers, one controls delay in real time
- Endless mode: road never ends, difficulty increases over time
- Classroom mode: teacher dashboard showing all students' scores live
- Chiptune soundtrack that degrades as delay increases

---

## Distribution Plan

| Phase | Status | Notes |
|-------|--------|-------|
| **1 — Stable HTML** | 🔄 In progress | Bug-free file → GitHub Pages → Yeditepe student testing |
| **2 — PWA** | Waiting | manifest.json + service worker + app icon design |
| **3 — App Store** | Waiting | Capacitor wrapper. iOS: $99/yr. Android: $25 one-time. |
| **4 — Monetisation** | Waiting | See below |

---

## Monetisation

- **B2B:** Universities, road safety organisations → $500–2000/year institutional licence
- **B2C:** $3.99 one-time purchase or freemium (delay 0–5 free, full range paid)
- **"Buy Me a Coffee":** No. Not serious enough.

---

## Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Game render | Canvas 2D API | ✅ Active |
| Sound | Web Audio API | ✅ Active |
| Physics | Vanilla JS (IIFE) | ✅ Active |
| Gyroscope | DeviceOrientation API | ⏳ Not yet added |
| Leaderboard | Firebase / Supabase | ⏳ Not yet added |
| PWA | manifest + service worker | ⏳ Not yet added |
| Native shell | Capacitor | ⏳ Future |

---

## Working Preferences (for Cline/Opus)

- Direct, concise communication. No padding.
- Propose changes with a short summary first, wait for approval, then implement.
- **MINIMAL CHANGE RULE:** Only change the minimum code necessary to implement the fix/feature. Do not touch unrelated logic. One concern per edit.
- No patches. Strong foundation. Do not accumulate tech debt.
- `G` object is the single state source. `draw()` never writes to `G`.
- Cline edits files directly — never instruct the user to paste code manually.
- **MANDATORY VERSION CONTROL PROTOCOL:** Whenever changes are implemented in the code, bump the version number by 1 (v0.8.x → v0.8.x+1), update this MD file immediately with the changelog, and record the change in the Version History table. Do this proactively without waiting for the user to remind you.
- **LAYOUT STACKING RULE (CSS):** For any multi-item grid/flex row, use CSS Grid with breakpoints: 4-col wide → 2x2 medium → 1-col narrow. NEVER allow free `flex-wrap` which creates ugly 3+1 or other unbalanced rows. The chart legend, config slider row, and any future multi-item rows must all follow this rule.

---

## Version History

| Version | What changed |
|---------|-------------|
| v0.1 | Core mechanic, delay queue |
| v0.2 | Momentum physics, ghost forecast line, skid marks, welcome popup |
| v0.3 | IIFE wrapper, dark mode, canvas sizing |
| v0.4 | **Architecture rebuild:** single `G` state object, off-road detection fix (computed once in loop), asphalt/green road surfaces, car path trace replaces ghost line, footer links corrected |
| v0.5 | Canvas ▶ play button (drawn on canvas, `PLAY_BTN` hit-test); EN/TR toggle added inside welcome popup; device language auto-detect via `navigator.language`; explanation grid goes 1-column on narrow screens; footer simplified to single Scholar link on professor's name; font sizes increased. **Bugs introduced:** `CX is not defined` (missing `var` in `drawStatic`); welcome popup unreliable on first load; play button unresponsive on iOS Safari; canvas height insufficient after popup dismiss. |
| v0.6 | **Bugs fixed:** Trail rendering (inverted logic), `CX is not defined`, iOS Safari touch event, canvas resize timing, font sizes. **Physics tweaks:** Delay slider max increased to 30 (3 secs). Viscosity and damping drastically reduced at high delays to exaggerate momentum and the bullwhip effect. Road width significantly increased. **UI:** Dark mode selector added to popup, footer added to popup. |
| v0.7 | **Features:** Tap canvas to pause/resume during gameplay. `localStorage` added to persist language, theme, and popup dismissal. `canvasHint` text drawn under play button. `(i)` tooltips added to sliders with bilingual explanations. Code file formally renamed to `bullwhip-sim.html`. |
| v0.8 | **Analytics:** Post-game Path Oscillation Chart added showing lateral deviation over time (visual proof of bullwhip effect). **Sound:** Dynamic engine hum added (scales with speed), tyre screech added on hard violations. |
| **v0.8.1** | **Bugs fixed:** Path Oscillation Chart visibility race condition (now drawn via `drawStatic` on game over). Chart math fixed to plot relative deviation (car path vs road centreline). Removed 400-frame array limit to keep full session data. Draw loops optimized. Fixed skid mark fading during pause. |
| **v0.8.2** | **Bugs fixed:** Fixed spacebar modal bypass (starting game while modals are open). Optimized `drawStatic` to prevent generating the road pointlessly on resize. Removed redundant/unclosed HTML tags. Deprecated DOM elements completely removed from JS references.<br>**Features:** Result modal forces users to "View Chart" to prevent skipping the learning moment. Game defaults set to max difficulty (Delay 30, Speed 8, Dur 60s) for a fail-first pedagogical approach. Improved analytical chart with 4-part real-life legend and fixed geometric calculation to create a realistic buffer between overstock/understock. Added "Company Fate" column to the session history table. Chart modal now includes full header/footer UI. Tapping anywhere on canvas starts game. Mobile slider thumbs scaled up for ergonomics. |
| **v0.8.3** | **Bugs fixed:** Fixed a fatal crash where orphaned code pointing to the removed "Play Again" button aborted the boot sequence and prevented the Welcome Popup from showing.<br>**Features:** Moved chart inline labels to the far-left start of the graph. Changed Overstock/Understock legend swatches to squares instead of lines. Modified chart close button to return to settings without auto-starting a new game. |
| **v0.8.4** | **Features:** Chart legend and config slider row now use responsive CSS Grid (4-col → 2x2 → 1-col). NEVER flex-wrap (causes ugly 3+1 rows). Engine hum replaced with tick-based sound (`audio._doTick`) — faster speed = higher tick rate, building to F1-like sound at max speed. Sound/Reset row uses `cfg-extras` class to always span full width in the grid. |
| **v0.8.5** | **Features:** Added "Export Game Learnings" button to the chart modal. This generates a PDF summary of the game results, key learnings, and an explanation of the Bullwhip Effect, personalized with the user's name. |

---

*"24 hours without sleep = equivalent reaction impairment to 1.0 promille alcohol" — this fact alone is viral.*
