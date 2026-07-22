import React from 'react';
import { MoreHorizontal } from 'lucide-react';

export const OverflowMenu: React.FC = () => {
  return (
    <div className="border-l border-[var(--border-subtle)] pl-2">
      <button
        aria-label="More options"
        title="More Options"
        className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};
