<<<<<<< HEAD
# TeachPad
=======
# TeachPad

> A Professional Handwriting Whiteboard for Recording Educational Videos

TeachPad is a single-user, offline-first, browser-based whiteboard built for recording educational YouTube videos with a graphics tablet while OBS Studio captures the screen.

## Project Structure

- **[`client/`](./client)**: React 19 + TypeScript + Vite frontend application containing the core canvas engine, UI toolbar, and local IndexedDB persistence layer.
- **[`docs/`](./docs)**: Project documentation including PRD (`docs/PRD.md`) and technical architecture (`docs/architecture.md`).
- **[`server/`](./server)**: Reserved stub directory for future cloud sync / back-end capabilities (TeachPad v1 runs 100% offline in client).

## Getting Started

To run the TeachPad client locally:

```bash
cd client
npm install
npm run dev
```

To build for production:

```bash
cd client
npm run build
```
>>>>>>> 0bc74f8 (Initial project scaffold)
