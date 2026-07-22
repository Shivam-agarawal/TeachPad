// Zustand store: UI state (toolbar, panels, presentation mode)
// Skeleton — no functionality implemented yet

import { create } from 'zustand';

interface UIStore {
  // State
  isToolbarVisible: boolean;
  isPresentationMode: boolean;
  isFullscreen: boolean;
  activePanelId: string | null;

  // Actions (stubs)
  setToolbarVisible: (visible: boolean) => void;
  toggleToolbar: () => void;
  setPresentationMode: (active: boolean) => void;
  setFullscreen: (active: boolean) => void;
  setActivePanel: (panelId: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  isToolbarVisible: true,
  isPresentationMode: false,
  isFullscreen: false,
  activePanelId: null,

  // Action stubs
  setToolbarVisible: (visible) => set({ isToolbarVisible: visible }),
  toggleToolbar: () => set((state) => ({ isToolbarVisible: !state.isToolbarVisible })),
  setPresentationMode: (active) => set({ isPresentationMode: active }),
  setFullscreen: (active) => set({ isFullscreen: active }),
  setActivePanel: (panelId) => set({ activePanelId: panelId }),
}));
