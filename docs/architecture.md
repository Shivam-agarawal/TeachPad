# TeachPad — System Architecture & Engine Design

**Phase 2 Architecture Document**

## 1. System Architecture Overview
TeachPad is a zero-backend, browser-native application organized around a two-hemisphere design:
- **React Hemisphere (DOM)**: App shell, router, floating toolbar, panels, indicators
- **Engine Hemisphere (Imperative Canvas)**: Framework-agnostic drawing engine, 4 stacked `<canvas>` elements, rAF render loop, stroke processing via `perfect-freehand`

## 2. Directory Layout

```
TeachPad/
├── client/                     # Whiteboard frontend application
│   ├── src/
│   │   ├── app/                # App shell, routing, layout
│   │   ├── pages/              # LandingPage, WorkspacePage, CanvasHost
│   │   ├── components/         # Toolbar, panels, indicators
│   │   ├── canvas-engine/      # Framework-agnostic canvas engine
│   │   ├── tools/              # Tool definitions
│   │   ├── history/            # Undo/redo command stack
│   │   ├── storage/            # Dexie.js IndexedDB persistence
│   │   ├── state/              # Zustand UI stores
│   │   ├── constants/          # Tokens, shortcuts, limits
│   │   ├── types/              # Geometry, stroke, project types
│   │   └── utils/              # Math, color, debounce/throttle
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                       # Product and Architecture Documentation
│   ├── PRD.md
│   └── architecture.md
│
└── server/                     # Reserved stub for future cloud sync / back-end
    └── README.md
```

## 3. Core Engine Architecture
- **Layer 1 (Background)**: Grid, PDF/image pages
- **Layer 2 (Committed Ink)**: All finished strokes + shapes (dirty-rect redraws)
- **Layer 3 (Active Stroke)**: Single in-progress stroke (rAF loop hot path)
- **Layer 4 (UI Overlay)**: Selection handles, laser trail, cursor
