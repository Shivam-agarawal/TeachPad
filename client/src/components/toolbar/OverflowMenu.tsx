import React, { useState, useRef, useEffect } from 'react';
import { useUIStore } from '@/state/uiStore';

export const OverflowMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { toggleTheme, setExportOpen, setSettingsOpen, toggleLayersPanel, isLayersPanelOpen } = useUIStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={popoverRef} className="relative flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More Options"
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95"
      >
        <span className="material-symbols-outlined text-[20px]">more_vert</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 p-1.5 glass-panel rounded-2xl shadow-xl z-50 flex flex-col gap-0.5 w-48 animate-entry">
          <button
            onClick={() => {
              toggleLayersPanel();
              setIsOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[12px] font-medium text-[var(--text-primary)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">layers</span>
              <span>Layers Panel</span>
            </div>
            {isLayersPanelOpen && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />}
          </button>

          <button
            onClick={() => {
              setExportOpen(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[12px] font-medium text-[var(--text-primary)] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Export Canvas</span>
          </button>

          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[12px] font-medium text-[var(--text-primary)] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">brightness_6</span>
            <span>Toggle Theme</span>
          </button>

          <div className="my-1 border-t border-black/10 dark:border-white/10" />

          <button
            onClick={() => {
              setSettingsOpen(true);
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[12px] font-medium text-[var(--text-primary)] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </button>
        </div>
      )}
    </div>
  );
};
