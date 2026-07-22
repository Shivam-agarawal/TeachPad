import React from 'react';
import { useParams } from 'react-router-dom';
import { CanvasHost } from './CanvasHost';
import { Toolbar } from '@/components/toolbar/Toolbar';
import { ZoomIndicator } from '@/components/indicators/ZoomIndicator';
import { PageIndicator } from '@/components/indicators/PageIndicator';
import { ProjectLabel } from '@/components/indicators/ProjectLabel';

export const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[var(--bg-canvas)]">
      {/* Infinite Canvas Surface */}
      <CanvasHost />

      {/* Top Left Project Title Indicator */}
      <ProjectLabel projectName={id ? `Project ${id}` : 'Untitled Project'} />

      {/* Floating Centered Pill Toolbar */}
      <Toolbar />

      {/* Bottom Right Workspace Indicators */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <PageIndicator currentPage={1} totalPages={1} />
        <ZoomIndicator zoomLevel={100} />
      </div>
    </div>
  );
};
