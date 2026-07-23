import React from 'react';
import { useToolStore } from '@/state/toolStore';
import { useUIStore } from '@/state/uiStore';
import type { ToolId } from '@/types/tools';

interface ToolBtn {
  id: ToolId;
  icon: string;
  label: string;
}

const TOOLS: ToolBtn[] = [
  { id: 'select', icon: 'navigation', label: 'Select' },
  { id: 'pen', icon: 'edit', label: 'Pen' },
  { id: 'rectangle', icon: 'shapes', label: 'Shapes' },
  { id: 'text', icon: 'text_fields', label: 'Text' },
  { id: 'image', icon: 'image', label: 'Image' },
];

const COLORS = [
  '#0058bc', // primary
  '#4c4aca', // secondary
  '#9e3d00', // tertiary
  '#1b1b1d', // on-surface
];

export const Toolbar: React.FC = () => {
  const { activeToolId, setActiveTool, color, setColor } = useToolStore();
  const { showToolbar, isPresentationMode } = useUIStore();

  if (!showToolbar || isPresentationMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-entry" style={{ animationDelay: '0.2s' }}>
      <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-4 border border-[#c1c6d7]/30 no-select shadow-lg">
        {/* Main Tools */}
        <div className="flex items-center gap-1">
          {TOOLS.map((tool) => {
            const isActive = activeToolId === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                aria-label={tool.label}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-[#0058bc] text-white shadow-sm'
                    : 'hover:bg-[#eae7ea] text-[#414755]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#c1c6d7]/30" />

        {/* Color Swatches */}
        <div className="flex items-center gap-2 px-1">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform ${
                color.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-[#0058bc]/40 scale-105' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-6 bg-[#c1c6d7]/30" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            aria-label="Undo"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">undo</span>
          </button>
          <button
            aria-label="Redo"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">redo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
