import { create } from 'zustand';
import type { ToolId, EraserMode } from '@/types/tools';

export type PressureCurveType = 'light' | 'default' | 'firm';
export type ShapeType = 'line' | 'arrow' | 'rectangle' | 'ellipse';

interface ToolStore {
  // State
  activeToolId: ToolId;
  previousToolId: ToolId | null;
  eraserMode: EraserMode;
  color: string;
  brushSize: number;
  brushOpacity: number;
  recentColors: string[];
  pressureCurve: PressureCurveType;
  selectedShape: ShapeType;

  // Actions
  setActiveTool: (toolId: ToolId) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setEraserMode: (mode: EraserMode) => void;
  setPressureCurve: (curve: PressureCurveType) => void;
  setSelectedShape: (shape: ShapeType) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  // Initial state matching Stitch design system palette defaults
  activeToolId: 'pen',
  previousToolId: null,
  eraserMode: 'stroke',
  color: '#3D7FFF', // Default blue accent ink
  brushSize: 4,
  brushOpacity: 1,
  recentColors: ['#3D7FFF', '#1A1B1E', '#E5484D', '#22C55E', '#F59E0B', '#A855F7'],
  pressureCurve: 'default',
  selectedShape: 'rectangle',

  // Actions
  setActiveTool: (toolId) =>
    set((state) => ({
      activeToolId: toolId,
      previousToolId: state.activeToolId,
    })),

  setColor: (color) =>
    set((state) => {
      const filtered = state.recentColors.filter((c) => c.toLowerCase() !== color.toLowerCase());
      return {
        color,
        recentColors: [color, ...filtered].slice(0, 8),
      };
    }),

  setBrushSize: (size) => set({ brushSize: size }),
  setBrushOpacity: (opacity) => set({ brushOpacity: opacity }),
  setEraserMode: (mode) => set({ eraserMode: mode }),
  setPressureCurve: (curve) => set({ pressureCurve: curve }),
  setSelectedShape: (shape) => set({ selectedShape: shape }),
}));
