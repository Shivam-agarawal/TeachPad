import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';
export type GridType = 'dot' | 'line' | 'none';

interface UIStore {
  // Theme & Viewport state
  theme: ThemeMode;
  isLayersPanelOpen: boolean;
  isSettingsOpen: boolean;
  isExportOpen: boolean;
  isPresentationMode: boolean;
  isRecordingMode: boolean;
  gridType: GridType;
  showToolbar: boolean;

  // Actions
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  toggleLayersPanel: () => void;
  setLayersPanelOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setExportOpen: (open: boolean) => void;
  setPresentationMode: (active: boolean) => void;
  setRecordingMode: (active: boolean) => void;
  setGridType: (type: GridType) => void;
  setShowToolbar: (show: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  isLayersPanelOpen: false,
  isSettingsOpen: false,
  isExportOpen: false,
  isPresentationMode: false,
  isRecordingMode: false,
  gridType: 'dot',
  showToolbar: true,

  setTheme: (theme) => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { theme: nextTheme };
    });
  },

  toggleLayersPanel: () => set((state) => ({ isLayersPanelOpen: !state.isLayersPanelOpen })),
  setLayersPanelOpen: (open) => set({ isLayersPanelOpen: open }),
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  setExportOpen: (open) => set({ isExportOpen: open }),
  setPresentationMode: (active) => set({ isPresentationMode: active }),
  setRecordingMode: (active) => set({ isRecordingMode: active }),
  setGridType: (type) => set({ gridType: type }),
  setShowToolbar: (show) => set({ showToolbar: show }),
}));
