// Zustand store: active tool, color, brush size, opacity
// Skeleton — no functionality implemented yet

import { create } from 'zustand';
import type { ToolId, EraserMode } from '@/types/tools';
import { INK_PALETTE } from '@/constants/design-tokens';

interface ToolStore {
  // State
  activeToolId: ToolId;
  previousToolId: ToolId | null;
  eraserMode: EraserMode;
  color: string;
  brushSize: number;
  brushOpacity: number;
  recentColors: string[];

  // Actions (stubs)
  setActiveTool: (toolId: ToolId) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setEraserMode: (mode: EraserMode) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  // Initial state
  activeToolId: 'pen',
  previousToolId: null,
  eraserMode: 'stroke',
  color: INK_PALETTE[0] ?? '#1A1B1E',
  brushSize: 4,
  brushOpacity: 1,
  recentColors: [],

  // Action stubs
  setActiveTool: (toolId) =>
    set((state) => ({
      activeToolId: toolId,
      previousToolId: state.activeToolId,
    })),
  setColor: (color) => set({ color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setBrushOpacity: (opacity) => set({ brushOpacity: opacity }),
  setEraserMode: (mode) => set({ eraserMode: mode }),
}));
