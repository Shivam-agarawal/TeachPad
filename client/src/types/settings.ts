// Application settings types

import type { BrushParams } from './stroke';
import type { ToolId } from './tools';

export type ThemeMode = 'light' | 'dark' | 'system';
export type GridStyle = 'none' | 'dot' | 'line';
export type ToolbarPosition = 'top' | 'left';

export interface AppSettings {
  theme: ThemeMode;
  gridStyle: GridStyle;
  gridDensity: number;
  toolbarPosition: ToolbarPosition;
  toolbarAutoHideMs: number;
  pressureCurve: 'light' | 'default' | 'firm';
  brushDefaults: Partial<Record<ToolId, BrushParams>>;
  shortcutOverrides: Record<string, string>;
}
