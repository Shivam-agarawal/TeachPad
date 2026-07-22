// Application-wide limits and thresholds

/** Undo/redo history cap per project */
export const MAX_HISTORY_STEPS = 200;

/** Zoom range (percentage as decimal) */
export const ZOOM_MIN = 0.1; // 10%
export const ZOOM_MAX = 20; // 2000%
export const ZOOM_DEFAULT = 1; // 100%

/** Autosave debounce interval (ms) */
export const AUTOSAVE_DEBOUNCE_MS = 300;

/** Session heartbeat interval (ms) */
export const HEARTBEAT_INTERVAL_MS = 5000;

/** Toolbar auto-hide delay (ms) */
export const TOOLBAR_AUTO_HIDE_MS = 3000;

/** Laser pointer trail fade duration (ms) */
export const LASER_FADE_MS = 600;

/** Maximum recent projects shown on landing page */
export const MAX_RECENT_PROJECTS = 50;

/** Camera settle debounce for re-rasterization after zoom (ms) */
export const CAMERA_SETTLE_MS = 150;
