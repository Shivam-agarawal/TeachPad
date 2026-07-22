# TeachPad — Product Requirements Document
### A Professional Handwriting Whiteboard for Recording Educational Videos
**Version 1.0 — Personal Edition**

---

## PART A — PRODUCT

### 1. Executive Summary

TeachPad is a single-user, offline-first, browser-based whiteboard built for one purpose: recording educational YouTube videos with a graphics tablet while OBS Studio captures the screen. It is not a note app, not a SaaS product, not a collaboration tool. It is a writing surface — the digital equivalent of a physical whiteboard — engineered so that pen-to-screen latency, stroke fidelity, and visual calm disappear into the background, leaving only the act of teaching.

Every requirement in this document is subordinate to one goal: **the pen must feel real**. Features that cannot be built without compromising that feel are deferred or cut.

### 2. Product Vision

A teacher opens a laptop, launches TeachPad, opens OBS, picks up a pen, and starts explaining a concept — with zero friction between thought and ink. The app should be forgotten the instant the first stroke lands on the canvas.

### 3. Mission

Build the smoothest handwriting surface achievable in a browser, using canvas-first rendering and a UI so minimal it never competes for attention with the content being taught.

### 4. Product Philosophy

- **Ink first, chrome last.** Every pixel of UI must justify its presence during a recording.
- **Native-grade, not native.** It runs in a browser, but must not feel like one — no scrollbars, no browser chrome bleeding into the experience, no janky repaints.
- **One user, one workflow.** No accounts, no sync, no permissions model, no multi-user conflict resolution. This simplicity is a performance and quality budget re-invested into handwriting smoothness.
- **Local-first, forever.** No dependency on network availability. A recording session must never stall waiting on a server.
- **Boring reliability.** Autosave, crash recovery, and project files that never corrupt matter more than any single new feature.

### 5. Goals

| Goal | Description |
|---|---|
| G1 | Sub-10ms perceived input latency for pen strokes |
| G2 | 60 FPS minimum, 120 FPS on capable displays |
| G3 | Infinite, fluid canvas — pan/zoom indistinguishable from native apps |
| G4 | Zero data loss across crashes, refreshes, or power loss |
| G5 | A UI invisible enough to disappear in screen recordings |
| G6 | Full offline capability from first load onward |
| G7 | Export pipeline good enough to publish notes as-is (PDF/PNG/JPG) |

### 6. Success Metrics (personal-use bar, not vanity metrics)

- Stroke latency measured on the target device consistently under 10ms (input event to pixel).
- No dropped frames during continuous writing on a 1080p/4K canvas over a 60-minute recording session.
- Zero project-loss incidents across a month of daily recording use.
- Cold start (click icon to first stroke drawable) under 1.5 seconds.
- Toolbar fully hideable, leaving only ink and canvas visible on stream.

---

## PART B — UX

### 7. User Workflow

```
Launch TeachPad (installed as PWA or opened in browser)
        ↓
Landing Screen → Open Recent Project OR New Project
        ↓
Whiteboard Workspace loads (last camera position restored)
        ↓
Open OBS Studio, add Window/Display capture of TeachPad
        ↓
Select Pen tool (keyboard shortcut "P")
        ↓
Toolbar auto-hides after inactivity → clean canvas for recording
        ↓
Teach: write, erase, switch pages/layers, zoom, pan
        ↓
Autosave runs continuously in the background (silent, non-blocking)
        ↓
Optional: Export current board/session to PDF/PNG for video description
        ↓
Close application → project state fully persisted for next session
```

### 8. User Stories

- As a teacher, I want the pen to respond exactly like ink on paper so my handwriting looks natural on camera.
- As a teacher, I want to zoom into equations without losing stroke quality, so viewers can read fine detail.
- As a teacher, I want the toolbar to vanish while I write so it never appears in the recording.
- As a teacher, I want my board automatically saved so a crash never costs me a lesson.
- As a teacher, I want to quickly switch between a highlighter, pencil, and eraser using single-key shortcuts, without touching the mouse.
- As a teacher, I want to import a PDF (e.g., a textbook page or slide) and annotate directly over it.
- As a teacher, I want a laser pointer tool so I can gesture at content without leaving a permanent mark.
- As a teacher, I want to export my finished board as a clean PDF to attach as a resource for the video.
- As a teacher, I want light and dark whiteboard themes so I can match the visual style of a given video series.
- As a teacher, I want undo/redo to be instant, even after hundreds of strokes.

### 9. Functional Requirements

- Infinite pannable/zoomable canvas with persistent camera state per project.
- Pressure-sensitive freehand ink via graphics tablet or supported pointer devices.
- Tools: Pen, Pencil, Highlighter, Eraser (stroke + object), Laser Pointer, Shapes (line, arrow, rectangle, ellipse), Text, Image insert, Selection/Transform, Clipboard (copy/paste/duplicate).
- Multi-level Undo/Redo with full action history per project.
- Layer system (background reference layer + freeform ink layers).
- Local project management: create, rename, duplicate, delete, reopen recent.
- Autosave with recovery on crash/reload.
- Import: images (PNG/JPG/SVG), PDF (as background pages to annotate over).
- Export: PNG, JPG, PDF, print.
- Presentation Mode: full-bleed canvas, chrome fully hidden, cursor optionally hidden.
- Dark and Light themes, instantly toggleable.
- Full keyboard shortcut coverage for every tool and action.

### 10. Non-Functional Requirements

- **Performance:** <10ms perceived latency, 60–120 FPS depending on display.
- **Reliability:** No data loss; autosave interval tuned to avoid perceptible hitches.
- **Portability:** Runs in any modern Chromium-based browser (primary target, since File System Access API is Chromium-only); installable as a PWA.
- **Offline:** 100% of functionality available with no network connection after first load.
- **Maintainability:** Strict TypeScript, modular architecture, no cross-cutting hacks between canvas engine and UI framework.
- **Accessibility (secondary, given single-user scope):** Keyboard operability for all core actions; respects OS-level reduced-motion settings for UI chrome (never for ink rendering).

### 11. UX Principles

- The canvas is the app. UI is a temporary overlay, not a permanent frame.
- Every control has a keyboard shortcut; the mouse/pen is optional for tool switching.
- Motion is used only to orient (tool selection feedback, panel slide-in), never to decorate.
- No modal dialogs during active writing — interruptions break the recording flow.
- The eye should never be pulled away from the ink by transient UI (tooltips, toasts) unless explicitly requested (e.g., "Saved" indicator, shown subtly and briefly).

### 12. UI Design System

A restrained, Apple/Figma-inflected system: soft neutral surfaces, a single accent color, generous negative space, and typography-led hierarchy rather than heavy borders or shadows. Components favor floating, rounded, semi-transparent surfaces that sit above the canvas without visually competing with it.

### 13. Color Palette

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg-canvas` | `#FFFFFF` | `#0E0F11` | Whiteboard surface |
| `--bg-surface` | `#F7F7F8` | `#17181B` | Toolbar / panels |
| `--bg-surface-translucent` | `rgba(255,255,255,0.72)` | `rgba(23,24,27,0.72)` | Floating toolbar (blurred) |
| `--text-primary` | `#111214` | `#F2F2F3` | Primary text |
| `--text-secondary` | `#6B6D73` | `#9A9CA3` | Secondary labels |
| `--accent` | `#3D7FFF` | `#5B93FF` | Selection, active tool |
| `--ink-black` | `#1A1B1E` | `#EDEDEE` | Default pen ink |
| `--danger` | `#E5484D` | `#F16468` | Eraser affordance, destructive actions |
| `--border-subtle` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Panel dividers |

### 14. Typography

- UI font: Inter (system-ui fallback) — variable weight, used at 400/500/600 only.
- Sizes: 11px (micro labels) / 13px (body/UI) / 15px (section headers) / 20–24px (landing screen titles).
- Ink text tool: a small curated set of handwriting-adjacent and clean sans fonts (e.g., a monospace option for code, a clean sans for typed annotations) — kept minimal since the product is about handwriting, not typesetting.

### 15. Iconography

A single consistent icon set (Lucide, matching the React ecosystem in use) at 18–20px, 1.5px stroke weight, no fill, consistent optical sizing across the toolbar. No mixed icon styles.

### 16. Design Tokens

Tokens are defined as CSS variables at `:root` and re-mapped under a `.dark` class, consumed via Tailwind's `theme()` extension so both canvas-drawn UI (SVG icons) and DOM UI share one source of truth. Spacing scale: 4/8/12/16/24/32px. Radius scale: 6/10/16px (toolbar uses 16px "pill" radius). Shadow: a single soft elevation token for floating panels, no heavier shadow tiers.

### 17. Component Library

Built on Shadcn UI primitives, restyled to the token set above: Button, IconButton, Tooltip, Popover (color picker, brush settings), Slider (brush size/opacity), Toggle Group (tool selector), Dialog (project rename, export options — used sparingly and never mid-stroke), Toast (subtle autosave/export confirmations), Command Palette (optional power-user launcher for actions/shortcuts).

---

## PART C — APPLICATION

### 18. Landing Screen

Minimal launcher: TeachPad wordmark, a prominent "New Project" action, and a grid/list of Recent Projects with thumbnail previews (rendered from a cached canvas snapshot). No sidebar, no marketing content, no onboarding wizard.

### 19. Recent Projects

Each entry shows: thumbnail, project name, last-modified timestamp, page/board count. Actions on hover: Open, Rename, Duplicate, Delete (with confirmation), Reveal file (if opened via File System Access API from disk). Recent list is sourced from an IndexedDB index, capped and sorted by last-opened.

### 20. Whiteboard Workspace

The core screen: full-viewport canvas, floating toolbar (top or side, user-configurable), a minimal top-left project name label (auto-hides), and a bottom-right zoom/page indicator (auto-hides). Nothing else is on screen by default.

### 21. Toolbar

A single floating, pill-shaped, translucent-blurred bar containing: tool selector (Pen/Pencil/Highlighter/Eraser/Laser/Shapes/Text/Image/Select), color swatch + picker, brush size/opacity slider, undo/redo, layers, and an overflow menu (export, theme toggle, presentation mode). Auto-hides after a configurable idle period during active drawing and reappears on proximity/hover or a shortcut (e.g., `Tab`).

### 22. Infinite Canvas

Logical canvas space is unbounded; only the viewport-visible region is rendered (virtualized rendering — see §66). Camera state (pan offset + zoom level) is stored per project and restored on reopen.

### 23. Grid System

Optional dot-grid or line-grid background rendered as a separate, cheap procedural layer (not baked into strokes), togglable, with adjustable density that scales with zoom level to avoid visual noise when zoomed out.

### 24. Zoom

Continuous (not stepped) zoom via `Ctrl+Wheel`/pinch, centered on the pointer position, with a defined range (e.g., 10%–2000%) and a "fit to content" and "reset to 100%" shortcut. Zoom is GPU-transform-based during the gesture and re-rasterized to full fidelity once the gesture settles, to keep both responsiveness and stroke crispness.

### 25. Pan

`Space+Drag`, middle-mouse-drag, and two-finger trackpad/touch pan, all mapped to the same camera-translation logic as zoom. Panning never triggers a full re-render of ink — only a transform of the current frame plus incremental redraw of newly revealed regions.

### 26. Fullscreen

`F11` (or in-app equivalent) requests the Fullscreen API, removing all browser chrome. Combined with toolbar auto-hide, this is the primary "invisible UI" recording configuration.

### 27. Presentation Mode

A dedicated mode (separate from default recording view) that removes every UI affordance except the canvas itself and, optionally, the pen cursor — for polished screen-recording segments where even the auto-hide toolbar's hover-reveal is undesirable. Exiting requires an explicit shortcut (`Esc`) to avoid accidental exposure of UI mid-recording.

---

## PART D — DRAWING ENGINE

### 28. Canvas Architecture

TeachPad uses a **layered multi-canvas** architecture rather than a single canvas:

1. **Static/background canvas** — grid, imported PDF/image pages. Redrawn only on camera change or content change, not on every pointer event.
2. **Committed-ink canvas** — all finished strokes, rasterized. Redrawn incrementally via dirty-rectangle updates, not full clears, except on zoom-settle re-rasterization.
3. **Active-stroke canvas (top layer)** — the single stroke currently being drawn, isolated so that committing it doesn't require repainting the whole board. This is the layer pointer events touch on every frame.
4. **UI overlay canvas/DOM** — selection handles, laser pointer trail, cursor — entirely decoupled from React's render cycle.

This separation means the highest-frequency work (the in-progress stroke) never touches React, never touches the DOM diffing pipeline, and never forces a repaint of already-committed ink.

### 29. Handwriting Engine

Pointer input is captured via the Pointer Events API, including `getCoalescedEvents()` to recover sub-frame input samples the browser buffered, and `getPredictedEvents()` where supported to draw slightly ahead of the physical pen and mask remaining latency. Each move event is fed into a stroke-points buffer keyed by pointerId, with pressure, tilt, and timestamp preserved for realistic ink rendering.

### 30. Stroke Rendering Engine

Built on **perfect-freehand** to convert the raw point/pressure stream into a smooth, variable-width vector outline in real time, rendered every animation frame via `requestAnimationFrame` onto the active-stroke canvas. On `pointerup`, the finished outline is committed (rasterized) onto the committed-ink canvas and the active-stroke canvas is cleared — a cheap operation since it only ever holds one stroke's worth of pixels.

### 31. Pen Engine

Default tool: solid, pressure-responsive line, opaque, rounded caps/joins, fully configurable color/size, tuned `perfect-freehand` parameters (thinning, smoothing, streamline) to feel closest to a fine felt-tip.

### 32. Pencil

A texture/opacity-modulated variant of the pen engine — lower opacity per pass, slightly grainier edge (via a subtle noise-modulated alpha), giving a graphite-like feel distinct from the pen's ink-like solidity.

### 33. Highlighter

Flat, translucent, wide, blunt-capped stroke, rendered with a multiply-style blend mode so overlapping highlighter strokes and highlighter-over-ink darken naturally rather than muddying color.

### 34. Eraser

Two modes: **stroke eraser** (removes whole strokes it touches — fast, ideal for quick corrections) and **precision/pixel eraser** (subtractively clips stroke geometry, for partial erasing). Object-level eraser is default for speed and predictability during live teaching.

### 35. Laser Pointer

A non-persistent, glowing marker tool: renders on the UI overlay layer only (never committed to ink), with a fading trail (opacity decay over ~600ms) purely for on-stream gesturing.

### 36. Shape Engine

Lightweight snap-to-shape primitives (line, arrow, rectangle, ellipse) drawn via drag with optional Shift-constrain (perfect square/circle/45° line lock). Shapes are stored as vector primitives (not rasterized freehand points) so they remain crisply resizable via the Selection tool.

### 37. Text Tool

Click-to-place text box with in-place editing, minimal font/size controls surfaced in the floating toolbar's contextual state, committed as a positioned text object (not rasterized) so it stays editable and exportable as real text where the export format supports it (PDF).

### 38. Image Tool

Drag-and-drop or file-picker insertion of PNG/JPG/SVG, placed as a resizable/movable object on the canvas, respected as a first-class layer object alongside ink.

### 39. Selection Tool

Marquee and click selection of strokes/shapes/text/images; supports move, scale, rotate, delete, and duplicate. Selection bounding boxes are drawn on the UI overlay layer to avoid re-rasterizing ink during transform preview; the transform is committed to the underlying object model on release.

### 40. Clipboard

Copy/Cut/Paste/Duplicate operate on the selected object set (vector/geometry level, not pixels), enabling lossless re-editing after paste, including across projects within the same session.

### 41–43. Undo / Redo / History

A command-pattern history stack records discrete, coarse-grained actions (stroke added, stroke erased, object transformed, page added) rather than every intermediate point — keeping the history light and undo/redo instantaneous even after long sessions. History is capped (configurable, e.g., 200 steps) with oldest entries pruned, and is per-project, persisted so it can optionally survive a reload (best-effort, not guaranteed across app restarts).

### 44. Layers

A simple two-tier model: a single **background reference layer** per page (grid, imported PDF/image) and one or more **ink layers** the user can add for organization (e.g., separating a diagram from its labels). Deliberately not a full professional layer stack — this is a whiteboard, not an illustration tool — to keep the mental model instant.

### 45. Color System

A curated default palette (matching common whiteboard-marker colors: black, red, blue, green, orange, plus the theme's ink defaults) with a full custom color picker (HSB + hex input) for anything beyond the defaults. Recently used colors are remembered per project.

### 46. Brush Settings

Size (px, mapped to a natural-feeling range per tool), opacity, and per-tool `perfect-freehand` tuning (thinning/smoothing/streamline) exposed as a compact popover — advanced parameters are pre-tuned defaults, not required day-to-day tweaking.

---

## PART E — FILE SYSTEM

### 47. Local Projects

Each project is a self-contained record: pages/boards, ink/object data, camera state, theme preference, and thumbnail — stored locally, never uploaded anywhere.

### 48. Autosave

A debounced, incremental autosave writes only changed deltas (not the full project) to IndexedDB shortly after each discrete action (stroke commit, object transform, page add), throttled to avoid interrupting the render loop. A lightweight "Saved" indicator appears briefly in a non-intrusive corner.

### 49. Project Recovery

On a crash or unexpected close, the next launch detects an unsaved/incomplete session (via a session heartbeat flag) and offers to restore the most recent autosaved state, defaulting to the newest valid snapshot.

### 50. Import Images

PNG/JPG/SVG import via drag-and-drop or file picker, placed as a movable/resizable canvas object.

### 51. Import PDF

PDF pages are rendered via **PDF.js** into background-layer bitmaps (per page becomes one board/page in the project), preserving vector sharpness at the zoom levels used for annotation.

### 52. PDF Annotation

Ink and objects drawn over an imported PDF page are stored as a separate ink layer above that page's background image, so the original PDF content and the annotations remain independently editable/removable.

### 53–55. Export (PNG / JPG / PDF)

Export renders the current board (or selected page range) at a chosen resolution multiplier by compositing the background and ink layers onto an offscreen canvas, then serializing to the target format; PDF export additionally preserves text objects as real selectable text rather than rasterizing them.

### 56. Print

Uses the browser's native print pipeline against a print-optimized render (white background forced regardless of active theme, margins respected) generated the same way as PDF export.

---

## PART F — PERFORMANCE

### 57. Zero Latency Requirements

Target: **<10ms perceived latency**, defined as time from physical pointer movement to visible pixel update. Achieved through the layered-canvas architecture (§28) that isolates the hot path (active stroke rendering) from everything else in the app, combined with the techniques below.

### 58. Rendering Pipeline

Ink rendering never goes through React's reconciliation. The canvas elements are mounted once; all subsequent drawing happens via imperative Canvas 2D (or WebGL, if profiling shows 2D insufficient at extreme zoom/stroke-density) calls driven by a dedicated render loop, fully outside React's component tree updates.

### 59. Pointer Events

All input flows through the Pointer Events API (`pointerdown/move/up/cancel`), unified across mouse, touch, and pen — with `pointerType === 'pen'` used to read `pressure`, `tiltX/tiltY`, and `twist` for realistic ink shaping.

### 60. requestAnimationFrame

The active stroke is redrawn on a single `rAF` loop that samples the latest buffered points once per frame, rather than redrawing synchronously on every `pointermove` — decoupling input frequency from paint frequency while still feeling immediate due to coalesced/predicted event sampling.

### 61. Stroke Prediction

Where `getPredictedEvents()` is available, a short-horizon predicted point is blended into the active stroke's tip to visually mask residual system latency, discarded/corrected once the real event arrives.

### 62. Pressure Curves

Raw pressure values are passed through a configurable response curve (linear by default, with light/firm-touch presets) before being handed to `perfect-freehand`, so different tablets/pens with different raw pressure ranges feel consistent.

### 63. Brush Smoothing

`perfect-freehand`'s `streamline` and `smoothing` parameters are tuned per tool; a lightweight input-side moving-average is applied only at very high input frequency (>240Hz tablets) to avoid jitter without adding perceptible lag.

### 64. Memory Optimization

Point buffers for in-progress strokes are pooled and reused rather than reallocated per stroke; committed strokes are stored as compact typed arrays (not object-per-point structures) to keep long sessions memory-stable.

### 65. GPU Optimization

Canvas layers use `will-change`/compositing hints judiciously (only where beneficial — overuse creates its own overhead); zoom/pan gestures use CSS-transform-based GPU compositing during the gesture, with a full re-rasterization to native resolution once the gesture ends, to keep both interaction smoothness and static-frame sharpness.

### 66. Canvas Optimization

**Dirty-rectangle rendering**: only the bounding region touched by a change is cleared/redrawn on the committed-ink canvas, not the full canvas, keeping large boards cheap to update. **Virtualization**: only strokes/objects intersecting the current viewport (plus a small margin) are considered for rendering or hit-testing at all — off-screen content is skipped entirely.

### 67. High Refresh Rate Displays

The render loop is refresh-rate-agnostic (driven by `rAF`, which adapts to 60/120/144Hz+ displays automatically) rather than hardcoded to a fixed frame interval.

### 68. Graphics Tablet Support

Because input goes through the standard Pointer Events API rather than any vendor SDK, TeachPad works with Wacom, XP-Pen, Huion, Veikk, Xencelabs, and generic HID-class tablets identically, as long as the OS-level driver exposes pressure/tilt via the browser's pointer event model (true for all listed vendors' current drivers on Windows/macOS).

### 69. Offline Support

After first load, all app assets are served from a Service Worker cache (PWA), and all data operations are local (IndexedDB + File System Access API) — no network request is required for any core function.

---

## PART G — TECHNICAL ARCHITECTURE

### 70. Frontend Architecture

React 19 + TypeScript + Vite for the application shell, routing, and DOM-based UI (toolbar, panels, landing screen). The canvas/drawing engine is architected as a **framework-agnostic core module** that React merely mounts and talks to via a thin adapter layer — ensuring canvas performance is never coupled to or gated by React's render cycle.

### 71. Folder Structure

```
teachpad/
├── src/
│   ├── app/                  # App shell, routing, layout
│   ├── pages/                # Landing, Workspace
│   ├── components/           # Toolbar, panels, dialogs (Shadcn-based)
│   ├── canvas-engine/         # Framework-agnostic core
│   │   ├── rendering/        # Layered canvas managers, rAF loop
│   │   ├── strokes/          # perfect-freehand integration, brush types
│   │   ├── input/            # Pointer event handling, coalesced/predicted events
│   │   ├── camera/           # Pan/zoom transform logic
│   │   └── objects/          # Shapes, text, images, selection model
│   ├── history/              # Undo/redo command stack
│   ├── storage/               # Dexie schemas, IndexedDB access, File System Access API
│   ├── tools/                 # Tool definitions (pen, eraser, laser, shape, text...)
│   ├── hooks/                  # React hooks bridging to canvas-engine
│   ├── state/                  # Zustand stores (UI state, tool state, project meta)
│   ├── utils/                  # Shared utilities
│   ├── types/                  # Shared TypeScript types
│   ├── constants/               # Design tokens, shortcut maps, defaults
│   └── assets/                  # Icons, fonts
├── public/
└── tests/
```

### 72. State Management

**Zustand** for UI/application state (active tool, theme, panel visibility, current project metadata) — deliberately kept separate from canvas engine state, which lives inside the engine's own internal model (not in Zustand/React state) to avoid any risk of React re-renders being triggered by high-frequency drawing data. TanStack Query is not needed in v1 (no network layer) and is only reserved for a possible future sync feature.

### 73. IndexedDB Storage

**Dexie.js** wraps IndexedDB for structured project storage: project metadata table, per-page/board ink-object tables, and a lightweight key-value table for app settings/autosave heartbeats. Chosen for its ergonomic query API and reliable transaction handling over long-running sessions.

### 74. File System Access API

Used to let the user explicitly save/open a `.teachpad` project file (a structured JSON/binary bundle) to their own file system when they want a portable, external copy — independent of the IndexedDB-resident "working" copy that autosave targets. IndexedDB remains the source of truth for the active session; File System Access is the export/import bridge to disk.

### 75. Settings Architecture

A single settings store (persisted via Dexie's key-value table) covering: theme, default brush settings per tool, toolbar position/auto-hide timing, grid preferences, and keyboard shortcut overrides — loaded once at startup and mutated through a single settings hook.

### 76. Error Handling

Canvas engine errors are isolated via boundary checks around rendering/storage operations so a single failed autosave or a malformed imported file cannot crash the active drawing session; the UI shell wraps top-level routes in a React error boundary that preserves the canvas state where possible and offers a reload/recover path.

### 77. Logging

A minimal local-only logger (console-based in development, silent/opt-in diagnostic buffer in production) — no remote telemetry, consistent with the local-first, single-user philosophy.

### 78. Testing Strategy

- Unit tests for stroke-geometry math, history command stack, and storage layer (Dexie schema operations).
- Integration tests for tool interactions (draw → undo → redo → export round-trip).
- Manual performance profiling sessions (Chrome DevTools Performance panel, frame-timing overlays) against real tablet input as the primary quality gate for the drawing engine, since automated tests cannot fully substitute for felt latency.

### 79. Build Strategy

Vite for dev server and production bundling; strict TypeScript (`strict: true`, no implicit any); PWA plugin for service-worker/offline asset caching; code-split so the canvas engine and heavier tool panels (shape/text/image) load eagerly (they're core to the writing experience) while less time-critical surfaces (landing screen, settings dialogs) can be split if bundle size warrants it.

### 80. Deployment

Static build output deployable to any static host (or run purely locally/offline as an installed PWA) — no backend, no server-side deployment surface in v1.

---

## TECHNOLOGY STACK (confirmed)

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, Zustand, TanStack Query (reserved, not used in v1), HTML5 Canvas API, perfect-freehand, Framer Motion (UI chrome animation only, never ink), PDF.js, Dexie.js.

**Backend:** None in v1. Fully offline, IndexedDB + File System Access API for persistence.

---

## KEYBOARD SHORTCUTS

| Shortcut | Action |
|---|---|
| `P` | Pen |
| `B` | Pencil |
| `H` | Highlighter |
| `E` | Eraser |
| `L` | Laser Pointer |
| `R` | Rectangle |
| `O` | Ellipse |
| `A` | Arrow / Line |
| `T` | Text |
| `I` | Image insert |
| `V` | Selection tool |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+C` | Copy |
| `Ctrl+V` | Paste |
| `Ctrl+X` | Cut |
| `Ctrl+D` | Duplicate |
| `Space + Drag` | Pan |
| `Mouse Wheel` | Vertical scroll / pan |
| `Ctrl + Wheel` | Zoom (pointer-centered) |
| `Ctrl+0` | Reset zoom to 100% |
| `Ctrl+Shift+F` | Fit to content |
| `F11` | Fullscreen |
| `Tab` | Toggle toolbar visibility |
| `Ctrl+P` | Presentation Mode |
| `Ctrl+E` | Export menu |
| `Ctrl+S` | Save project to disk (File System Access) |
| `Esc` | Exit Presentation Mode / close active panel |

---

## DEVELOPMENT STRATEGY

Per the requested process, this PRD is **Phase 1 only**. Nothing here should be treated as a build instruction yet.

**Next steps, each gated on your approval:**
1. **System Architecture** — detailed technical architecture doc expanding §70–80 into concrete module contracts and data flow diagrams.
2. **Folder Structure** — finalized, file-level scaffold.
3. **Phased Implementation** — each phase delivered with: architecture explanation, files created, implementation details, reasoning behind decisions, and testing instructions — with no phase starting until the previous one is confirmed.

---

*End of PRD — awaiting confirmation to proceed to Phase 2 (System Architecture).*
