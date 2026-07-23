// Pressure Normalizer — detects pen vs mouse, normalizes and curves pressure values
// Supports three pressure curves per PRD: light, default, firm

import { clamp } from '@/utils/math';

export type PressureCurve = 'light' | 'default' | 'firm';

/**
 * PressureNormalizer handles:
 * 1. Detecting whether the device reports real pressure (pen) or not (mouse)
 * 2. Applying a pressure curve to shape the feel
 * 3. Providing a fallback pressure for mouse input (constant 0.5)
 * 4. Clamping to [0, 1] range
 */
export class PressureNormalizer {
  private curve: PressureCurve = 'default';
  private hasPenInput: boolean = false;

  constructor(curve: PressureCurve = 'default') {
    this.curve = curve;
  }

  /** Update the active pressure curve */
  public setCurve(curve: PressureCurve): void {
    this.curve = curve;
  }

  /** Get the active pressure curve */
  public getCurve(): PressureCurve {
    return this.curve;
  }

  /** Whether a real pen/stylus has been detected during this session */
  public hasPenBeenDetected(): boolean {
    return this.hasPenInput;
  }

  /**
   * Normalize a raw PointerEvent pressure value.
   *
   * @param rawPressure - The PointerEvent.pressure value (0.0 - 1.0 for pen, 0.5 for mouse down, 0 for mouse hover)
   * @param pointerType - The PointerEvent.pointerType string ('pen', 'mouse', 'touch')
   * @param buttons - The PointerEvent.buttons bitmask
   * @returns Normalized pressure in [0, 1]
   */
  public normalize(rawPressure: number, pointerType: string, buttons: number): number {
    // Track whether we've ever seen real pen input
    if (pointerType === 'pen') {
      this.hasPenInput = true;
    }

    let pressure: number;

    if (pointerType === 'pen') {
      // Pen: use real pressure data. Some tablets report 0 during hover.
      // During contact (buttons > 0), ensure a minimum floor so strokes aren't invisible.
      if (buttons > 0 && rawPressure === 0) {
        pressure = 0.1; // fallback floor for faulty drivers
      } else {
        pressure = rawPressure;
      }
    } else if (pointerType === 'touch') {
      // Touch: browsers report 0-1 force. Use it if available, else constant.
      pressure = rawPressure > 0 ? rawPressure : 0.5;
    } else {
      // Mouse: no real pressure. Use 0.5 when button is down, 0 when hovering.
      pressure = buttons > 0 ? 0.5 : 0;
    }

    // Apply pressure curve
    pressure = this.applyCurve(pressure);

    return clamp(pressure, 0, 1);
  }

  /**
   * Apply the selected pressure curve transfer function.
   *
   * Light curve:   more responsive at low pressure (power < 1)
   * Default curve: linear pass-through
   * Firm curve:    requires harder press for full width (power > 1)
   */
  private applyCurve(pressure: number): number {
    if (pressure <= 0) return 0;
    if (pressure >= 1) return 1;

    switch (this.curve) {
      case 'light':
        // Sqrt curve — lighter touch feels bigger
        return Math.pow(pressure, 0.7);
      case 'firm':
        // Quadratic curve — need firmer pressure to reach full width
        return Math.pow(pressure, 1.5);
      case 'default':
      default:
        // Linear — no transformation
        return pressure;
    }
  }
}
