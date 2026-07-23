import { describe, it, expect, beforeEach } from 'vitest';
import { PressureNormalizer } from '../input/PressureNormalizer';

describe('PressureNormalizer', () => {
  let normalizer: PressureNormalizer;

  beforeEach(() => {
    normalizer = new PressureNormalizer('default');
  });

  // ─── Pen input ─────────────────────────────────────────

  it('should pass through pen pressure unchanged with default curve', () => {
    const result = normalizer.normalize(0.6, 'pen', 1);
    expect(result).toBeCloseTo(0.6, 5);
  });

  it('should detect pen input after receiving a pen event', () => {
    expect(normalizer.hasPenBeenDetected()).toBe(false);
    normalizer.normalize(0.5, 'pen', 1);
    expect(normalizer.hasPenBeenDetected()).toBe(true);
  });

  it('should provide fallback floor for pen with 0 pressure and buttons > 0', () => {
    const result = normalizer.normalize(0, 'pen', 1);
    expect(result).toBeCloseTo(0.1, 5);
  });

  it('should return 0 for pen hover (pressure=0, buttons=0)', () => {
    const result = normalizer.normalize(0, 'pen', 0);
    expect(result).toBe(0);
  });

  it('should clamp pen pressure to [0, 1]', () => {
    expect(normalizer.normalize(1.5, 'pen', 1)).toBe(1);
    expect(normalizer.normalize(-0.5, 'pen', 1)).toBe(0);
  });

  // ─── Mouse input ───────────────────────────────────────

  it('should return 0.5 for mouse with button down', () => {
    const result = normalizer.normalize(0.5, 'mouse', 1);
    expect(result).toBeCloseTo(0.5, 5);
  });

  it('should return 0 for mouse hover (buttons=0)', () => {
    const result = normalizer.normalize(0, 'mouse', 0);
    expect(result).toBe(0);
  });

  // ─── Touch input ───────────────────────────────────────

  it('should use raw touch pressure if available', () => {
    const result = normalizer.normalize(0.8, 'touch', 1);
    expect(result).toBeCloseTo(0.8, 5);
  });

  it('should fall back to 0.5 for touch with 0 pressure', () => {
    const result = normalizer.normalize(0, 'touch', 1);
    expect(result).toBeCloseTo(0.5, 5);
  });

  // ─── Pressure curves ──────────────────────────────────

  it('should apply light curve (power 0.7) — boosts low pressure', () => {
    normalizer.setCurve('light');
    const result = normalizer.normalize(0.25, 'pen', 1);
    const expected = Math.pow(0.25, 0.7);
    expect(result).toBeCloseTo(expected, 4);
    // Light curve should be higher than linear
    expect(result).toBeGreaterThan(0.25);
  });

  it('should apply firm curve (power 1.5) — suppresses low pressure', () => {
    normalizer.setCurve('firm');
    const result = normalizer.normalize(0.25, 'pen', 1);
    const expected = Math.pow(0.25, 1.5);
    expect(result).toBeCloseTo(expected, 4);
    // Firm curve should be lower than linear
    expect(result).toBeLessThan(0.25);
  });

  it('should pass through 0 and 1 unchanged regardless of curve', () => {
    normalizer.setCurve('light');
    expect(normalizer.normalize(0, 'pen', 0)).toBe(0);
    // For pressure = 1.0 with pen + buttons
    expect(normalizer.normalize(1, 'pen', 1)).toBe(1);

    normalizer.setCurve('firm');
    expect(normalizer.normalize(0, 'pen', 0)).toBe(0);
    expect(normalizer.normalize(1, 'pen', 1)).toBe(1);
  });

  it('should allow switching curves at runtime', () => {
    expect(normalizer.getCurve()).toBe('default');
    normalizer.setCurve('firm');
    expect(normalizer.getCurve()).toBe('firm');
  });
});
