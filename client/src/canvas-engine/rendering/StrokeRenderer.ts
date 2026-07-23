// Stroke Renderer — converts a StrokeData into canvas paths using perfect-freehand
// Handles pen, pencil, and highlighter rendering differences per PRD §30-33

import getStroke from 'perfect-freehand';
import type { StrokeData } from '@/types/stroke';
import type { Camera } from '../camera/Camera';

/** Options passed to perfect-freehand getStroke() per tool type */
function getFreehandOptions(stroke: StrokeData) {
  const base = {
    size: stroke.brush.size,
    thinning: stroke.brush.thinning,
    smoothing: stroke.brush.smoothing,
    streamline: stroke.brush.streamline,
    simulatePressure: false, // we have real pressure data
    last: true,              // smooth end cap on finalized strokes
  };

  switch (stroke.toolId) {
    case 'pen':
      return {
        ...base,
        start: { cap: true, taper: 0, easing: (t: number) => t },
        end: { cap: true, taper: 0, easing: (t: number) => t },
      };
    case 'pencil':
      return {
        ...base,
        start: { cap: true, taper: 5, easing: (t: number) => t },
        end: { cap: true, taper: 5, easing: (t: number) => t },
      };
    case 'highlighter':
      return {
        ...base,
        thinning: 0,       // flat width, no pressure variation
        start: { cap: false, taper: 0 },
        end: { cap: false, taper: 0 },
      };
    default:
      return base;
  }
}

/**
 * Convert perfect-freehand outline points into a Canvas2D Path2D using
 * quadratic bezier curves for smooth rendering.
 *
 * Uses the averaging technique from perfect-freehand's docs:
 * each segment is drawn as a quadratic curve where the control point
 * is the current point and the end point is the average of the current
 * and next points.
 */
function buildPath(outlinePoints: number[][]): Path2D | null {
  if (outlinePoints.length < 2) return null;

  const path = new Path2D();
  const [firstX, firstY] = outlinePoints[0]!;
  path.moveTo(firstX!, firstY!);

  for (let i = 1; i < outlinePoints.length - 1; i++) {
    const [cx, cy] = outlinePoints[i]!;
    const [nx, ny] = outlinePoints[i + 1]!;
    // Average of current and next point for smooth curvature
    const ex = (cx! + nx!) / 2;
    const ey = (cy! + ny!) / 2;
    path.quadraticCurveTo(cx!, cy!, ex, ey);
  }

  // Final segment to close the shape
  const last = outlinePoints[outlinePoints.length - 1]!;
  path.lineTo(last[0]!, last[1]!);
  path.closePath();

  return path;
}

/**
 * Render a single StrokeData onto a Canvas 2D context.
 *
 * @param ctx    - Target rendering context (committed or active layer)
 * @param stroke - The StrokeData to render
 * @param camera - Camera for applying world→screen transform
 */
export function renderStroke(
  ctx: CanvasRenderingContext2D,
  stroke: StrokeData,
  camera: Camera,
): void {
  if (stroke.points.length < 1) return;

  // Convert StrokePoint[] to the format perfect-freehand expects: { x, y, pressure }
  const inputPoints = stroke.points.map((p) => ({
    x: p.x,
    y: p.y,
    pressure: p.pressure,
  }));

  // Generate the smooth variable-width outline
  const options = getFreehandOptions(stroke);
  const outlinePoints = getStroke(inputPoints, options);

  const path = buildPath(outlinePoints);
  if (!path) return;

  // Save context state
  ctx.save();

  // Apply camera transform (world → screen)
  camera.applyToContext(ctx);

  // Configure rendering style per tool type
  switch (stroke.toolId) {
    case 'highlighter':
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = stroke.brush.opacity;
      break;
    case 'pencil':
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = stroke.brush.opacity;
      break;
    case 'pen':
    default:
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = stroke.brush.opacity;
      break;
  }

  ctx.fillStyle = stroke.color;
  ctx.fill(path);

  // Restore context state
  ctx.restore();
}

/**
 * Render a single in-progress stroke (active drawing).
 * Uses `last: false` so perfect-freehand doesn't add a finished end cap.
 */
export function renderActiveStroke(
  ctx: CanvasRenderingContext2D,
  stroke: StrokeData,
  camera: Camera,
): void {
  if (stroke.points.length < 1) return;

  const inputPoints = stroke.points.map((p) => ({
    x: p.x,
    y: p.y,
    pressure: p.pressure,
  }));

  const options = {
    ...getFreehandOptions(stroke),
    last: false, // Don't add finished end cap — stroke is still in progress
  };
  const outlinePoints = getStroke(inputPoints, options);

  const path = buildPath(outlinePoints);
  if (!path) return;

  ctx.save();
  camera.applyToContext(ctx);

  switch (stroke.toolId) {
    case 'highlighter':
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = stroke.brush.opacity;
      break;
    case 'pencil':
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = stroke.brush.opacity;
      break;
    case 'pen':
    default:
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = stroke.brush.opacity;
      break;
  }

  ctx.fillStyle = stroke.color;
  ctx.fill(path);

  ctx.restore();
}

/**
 * Render multiple committed strokes onto a context.
 * Used for full repaints of the committed-ink layer.
 */
export function renderCommittedStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: readonly StrokeData[],
  camera: Camera,
): void {
  for (const stroke of strokes) {
    renderStroke(ctx, stroke, camera);
  }
}
