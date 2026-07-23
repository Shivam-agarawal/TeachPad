// Zustand store: application settings
// Skeleton — no functionality implemented yet

import { create } from 'zustand';
import type { ThemeMode, GridStyle, ToolbarPosition } from '@/types/settings';

interface SettingsStore {
  // State
  theme: ThemeMode;
  gridStyle: GridStyle;
  gridDensity: number;
  toolbarPosition: ToolbarPosition;
  toolbarAutoHideMs: number;
  pressureCurve: 'light' | 'default' | 'firm';

  // Actions (stubs)
  setTheme: (theme: ThemeMode) => void;
  setGridStyle: (style: GridStyle) => void;
  setGridDensity: (density: number) => void;
  setToolbarPosition: (position: ToolbarPosition) => void;
  setToolbarAutoHideMs: (ms: number) => void;
  setPressureCurve: (curve: 'light' | 'default' | 'firm') => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  // Initial state
  theme: 'light',
  gridStyle: 'none',
  gridDensity: 24,
  toolbarPosition: 'top',
  toolbarAutoHideMs: 3000,
  pressureCurve: 'default',

  // Action stubs
  setTheme: (theme) => set({ theme }),
  setGridStyle: (style) => set({ gridStyle: style }),
  setGridDensity: (density) => set({ gridDensity: density }),
  setToolbarPosition: (position) => set({ toolbarPosition: position }),
  setToolbarAutoHideMs: (ms) => set({ toolbarAutoHideMs: ms }),
  setPressureCurve: (curve) => set({ pressureCurve: curve }),
}));
