// Project, page, and layer metadata types

import type { Transform } from './geometry';

export interface ProjectMeta {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail: Blob | null;
  cameraState: Transform;
  theme: 'light' | 'dark';
  activePageIndex: number;
}

export interface PageMeta {
  id: string;
  projectId: string;
  pageIndex: number;
  backgroundType: 'none' | 'dot-grid' | 'line-grid' | 'image' | 'pdf';
  backgroundImage: Blob | null;
}

export interface LayerMeta {
  id: string;
  pageId: string;
  name: string;
  zIndex: number;
  visible: boolean;
  opacity: number;
}
