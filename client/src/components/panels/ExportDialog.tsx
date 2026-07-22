import React from 'react';

interface ExportDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen = false, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-96 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-float)]">
        <h2 className="mb-4 text-[15px] font-semibold text-[var(--text-primary)]">Export Whiteboard</h2>
        <div className="mb-6 space-y-2 text-[13px] text-[var(--text-secondary)]">
          <label className="flex items-center gap-2">
            <input type="radio" name="format" value="png" defaultChecked /> PNG Image
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="format" value="pdf" /> PDF Document
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            aria-label="Cancel export"
            className="rounded-[var(--radius-sm)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-translucent)]"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            aria-label="Export board"
            className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
