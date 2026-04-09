# Bullwhip Effect Simulator

A steering delay simulator designed to physically demonstrate the **Bullwhip Effect** in supply chains. 

The user drives a car along a winding road, with a delay slider controlling the information lag between steering input and the wheels' response. 
- **Low delay:** The car smoothly tracks the road (perfect supply chain visibility).
- **High delay:** Momentum and inertia cause overcorrection, oscillation, and loss of control—physically simulating what happens in a supply chain without real-time data sharing.

## Features
- **Momentum Physics:** Delay queue combined with viscosity and damping to accurately model the bullwhip oscillation.
- **Seeded Procedural Generation:** The road curves are generated using a seeded PRNG (`mulberry32`), ensuring every run uses the identical track for fair comparisons across different delay settings.
- **Path Oscillation Chart:** A post-game analytical chart comparing the "Demand Signal" (road centreline) against "Your Action" (car lateral path), visually exposing the exact amplification ratio.
- **Bilingual & Responsive:** Full English and Turkish support (auto-detected), dark/light themes, fully playable on mobile touch screens or desktop (keyboard/mouse).

## Project Background
Developed in collaboration with **Prof. Dr. Erkut AKKARTAL** (Yeditepe University). 
Built using vanilla HTML5 Canvas and the Web Audio API, entirely contained within a single file with zero external dependencies.

## Architecture
- **Single `G` State Object:** All game state is strictly isolated. The `draw()` function reads only and never writes to `G`.
- **Performance Optimized:** No unnecessary DOM operations during the game loop. Chart math evaluates relative path deviation without stalling the main thread.
- **Audio Isolated:** Audio context runs independently, generating synthetic hum and screech sounds using oscillators.

## Play
Simply open `bullwhip-sim.html` in any modern web browser to start driving.
