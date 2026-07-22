import React from 'react';

interface SettingsDialogProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen = false, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-96 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-[var(--shadow-float)]">
        <h2 className="mb-4 text-[15px] font-semibold text-[var(--text-primary)]">Preferences</h2>
        <p className="text-[13px] text-[var(--text-secondary)]">Grid settings, shortcuts, and tablet options.</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-[var(--radius-sm)] bg-[var(--accent)] px-3 py-1.5 text-[13px] font-medium text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
