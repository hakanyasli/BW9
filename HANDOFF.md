# BW9 — Session Handoff (v1.0, July 2026)

> Drop this file in the repo root. Any AI tool (Claude Code, Cline) that reads
> it — together with `bullwhip-sim-project.md` — has the full project state.
> Zero context is lost by switching tools.

## Current state
- `index.html` is at **v1.0**. All edits verified: `node --check` passes,
  all new symbols present, zero stale `v0.91` strings.
- `bullwhip-sim-project.md` version history updated through v1.0.
- `README.md` corrected (live URL, `index.html`, PWA note).

## What v1.0 added (all inside index.html)
1. **Ghost-run overlay** — `prevRun` variable near the chart declarations;
   dashed grey line of the previous run drawn in `showChart()` just before
   the orange action line. Guarded by `runId !== G.results.length`.
2. **Amplification cascade** — `#chCascade` div; built at the end of
   `showChart()`; compounds the RMS ratio (capped 3.5) over 4 tiers,
   log-scaled bars.
3. **Quiz** — `#chQuiz` div; `buildQuiz()` + one delegated document click
   listener; questions live in `S.en.quizQ` / `S.tr.quizQ` (q/a/c/x fields).
4. **Bug fixes** — `exportLearnings()`: volatility thresholds now km/h
   (<60/<120/<180), delay→days now `(dly-1)*3` matching `showChart()`.
5. **i18n** — WHEELS label via `data-lbl` attr + `wheelsLbl` key, set in
   `applyText()`.
6. **PWA** — `<link rel="manifest">` in head; SW registered at end of the
   IIFE. Requires the three companion files below in the same folder.

## Files that MUST sit next to index.html
- `manifest.json` — PWA manifest (SVG icon reference)
- `sw.js` — network-first service worker, cache name `bw-v1.0`
- `icon.svg` — app icon
On each future release: bump `CACHE` in sw.js alongside the version number.

## Known remaining debt (deliberately NOT touched)
- Orphaned i18n keys from the old welcome popup: `ws1–ws5`, `wcL1–4`/`wcV1–4`,
  `wHint`, `wDevM/D`, `btnGo`, `lDlo/lDhi` — unused, some contain stale scale
  text ("delay 30", "0=instant, 15=chaos"). Safe to delete in one sweep.
- Dead CSS: `.delay-wrap`, `.delay-inner`, `.delay-ends`, `.dlbl` (no HTML).
- Duplicated financial math between `showChart()` and `exportLearnings()` —
  should be extracted into one shared function.
- `cacheOriginalFontSizes()` caches DOM refs once; elements replaced via
  innerHTML afterwards escape font scaling.
- Chart-modal header crams 6 controls in one row; tight under 360px.

## House rules (from bullwhip-sim-project.md — follow them)
- Single `G` state object; `draw()` never writes to `G`.
- MINIMAL CHANGE RULE; one concern per edit.
- Bump version + update the MD changelog on EVERY change.
- Grid breakpoints 4→2x2→1; never free flex-wrap.
