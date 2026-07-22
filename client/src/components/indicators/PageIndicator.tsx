import React from 'react';

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({ currentPage, totalPages }) => {
  return (
    <div className="rounded-[var(--radius-sm)] bg-[var(--bg-surface-translucent)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur-md shadow-sm">
      Page {currentPage} / {totalPages}
    </div>
  );
};
