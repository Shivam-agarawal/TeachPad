import { describe, it, expect, beforeEach } from 'vitest';
import { StrokeBuilder, type StrokeConfig } from '../strokes/StrokeBuilder';
import type { PointerData } from '../input/pointer-types';

function makeConfig(): StrokeConfig {
  return {
    toolId: 'pen',
    color: '#1A1B1E',
    brush: { size: 4, opacity: 1, thinning: 0.5, smoothing: 0.5, streamline: 0.5 },
    layerId: 'default',
  };
}

function makePointerData(overrides: Partial<PointerData> = {}): PointerData {
  return {
    pointerId: 1,
    phase: 'move',
    device: 'pen',
    screenX: 100,
    screenY: 200,
    worldX: 100,
    worldY: 200,
    pressure: 0.5,
    rawPressure: 0.5,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    timestamp: Date.now(),
    isPenEraser: false,
    isDown: true,
    coalescedPoints: [],
    ...overrides,
  };
}

describe('StrokeBuilder', () => {
  let builder: StrokeBuilder;

  beforeEach(() => {
    builder = new StrokeBuilder(makeConfig());
  });

  it('should generate a unique stroke ID', () => {
    const builder2 = new StrokeBuilder(makeConfig());
    expect(builder.getId()).not.toBe(builder2.getId());
    expect(builder.getId()).toMatch(/^stroke-/);
  });

  it('should start with zero points', () => {
    expect(builder.getPointCount()).toBe(0);
    expect(builder.isValid()).toBe(false);
  });

  it('should accumulate points from PointerData', () => {
    builder.addPoint(makePointerData({ worldX: 10, worldY: 20 }));
    builder.addPoint(makePointerData({ worldX: 30, worldY: 40 }));
    builder.addPoint(makePointerData({ worldX: 50, worldY: 60 }));

    expect(builder.getPointCount()).toBe(3);
    expect(builder.isValid()).toBe(true);
  });

  it('should track bounding box including brush radius', () => {
    builder.addPoint(makePointerData({ worldX: 100, worldY: 200 }));
    builder.addPoint(makePointerData({ worldX: 300, worldY: 400 }));

    const bounds = builder.getBounds();
    // brush size 4 → radius 2
    expect(bounds.minX).toBe(98);
    expect(bounds.minY).toBe(198);
    expect(bounds.maxX).toBe(302);
    expect(bounds.maxY).toBe(402);
  });

  it('should absorb coalesced sub-points', () => {
    const data = makePointerData({
      coalescedPoints: [
        { screenX: 10, screenY: 20, worldX: 10, worldY: 20, pressure: 0.3, tiltX: 0, tiltY: 0, timestamp: 1 },
        { screenX: 15, screenY: 25, worldX: 15, worldY: 25, pressure: 0.4, tiltX: 0, tiltY: 0, timestamp: 2 },
        { screenX: 20, screenY: 30, worldX: 20, worldY: 30, pressure: 0.5, tiltX: 0, tiltY: 0, timestamp: 3 },
      ],
    });
    builder.addPoint(data);
    expect(builder.getPointCount()).toBe(3);
  });

  it('should finalize and seal the builder', () => {
    builder.addPoint(makePointerData({ worldX: 10, worldY: 20 }));
    builder.addPoint(makePointerData({ worldX: 30, worldY: 40 }));

    expect(builder.isFinalized()).toBe(false);
    builder.finalize();
    expect(builder.isFinalized()).toBe(true);

    // No more points after finalization
    builder.addPoint(makePointerData({ worldX: 50, worldY: 60 }));
    expect(builder.getPointCount()).toBe(2);
  });

  it('should return correct StrokeData', () => {
    builder.addPoint(makePointerData({ worldX: 10, worldY: 20, pressure: 0.6 }));
    const data = builder.getStrokeData();

    expect(data.id).toBe(builder.getId());
    expect(data.toolId).toBe('pen');
    expect(data.color).toBe('#1A1B1E');
    expect(data.points).toHaveLength(1);
    expect(data.points[0]?.x).toBe(10);
    expect(data.points[0]?.y).toBe(20);
    expect(data.points[0]?.pressure).toBe(0.6);
    expect(data.brush.size).toBe(4);
    expect(data.layerId).toBe('default');
  });

  it('should report single-point stroke as invalid', () => {
    builder.addPoint(makePointerData());
    expect(builder.isValid()).toBe(false);
  });
});
