// Zustand store: current project metadata
// Skeleton — no functionality implemented yet

import { create } from 'zustand';
import type { ProjectMeta } from '@/types/project';

interface ProjectStore {
  // State
  currentProject: ProjectMeta | null;
  recentProjects: ProjectMeta[];
  isLoading: boolean;

  // Actions (stubs)
  setCurrentProject: (project: ProjectMeta | null) => void;
  setRecentProjects: (projects: ProjectMeta[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  // Initial state
  currentProject: null,
  recentProjects: [],
  isLoading: false,

  // Action stubs
  setCurrentProject: (project) => set({ currentProject: project }),
  setRecentProjects: (projects) => set({ recentProjects: projects }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
