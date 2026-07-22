import React from 'react';

interface SaveIndicatorProps {
  isSaving?: boolean;
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({ isSaving = false }) => {
  if (!isSaving) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-surface-translucent)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur-md">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
      Saving...
    </div>
  );
};
