import React from 'react';
import { useToolStore } from '@/state/toolStore';
import type { ToolId } from '@/types/tools';

interface ToolItem {
  id: ToolId;
  label: string;
  icon: string;
  shortcut: string;
}

const TOOLS: ToolItem[] = [
  { id: 'select', label: 'Select', icon: 'near_me', shortcut: 'V' },
  { id: 'pen', label: 'Pen', icon: 'edit', shortcut: 'P' },
  { id: 'pencil', label: 'Pencil', icon: 'draw', shortcut: 'B' },
  { id: 'highlighter', label: 'Highlighter', icon: 'ink_highlighter', shortcut: 'H' },
  { id: 'eraser', label: 'Eraser', icon: 'ink_eraser', shortcut: 'E' },
  { id: 'laser', label: 'Laser', icon: 'magic_button', shortcut: 'L' },
  { id: 'rectangle', label: 'Shapes', icon: 'category', shortcut: 'S' },
  { id: 'text', label: 'Text', icon: 'title', shortcut: 'T' },
  { id: 'image', label: 'Image', icon: 'image', shortcut: 'I' },
];

export const ToolSelector: React.FC = () => {
  const { activeToolId, setActiveTool } = useToolStore();

  return (
    <div className="flex items-center gap-1">
      {TOOLS.map((tool) => {
        const isActive = activeToolId === tool.id;
        return (
          <div key={tool.id} className="group relative">
            <button
              onClick={() => setActiveTool(tool.id)}
              aria-label={`${tool.label} (${tool.shortcut})`}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#0058bc] text-white shadow-md'
                  : 'hover:bg-[#eae7ea]/60 text-[#414755] hover:text-[#1b1b1d]'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-[#303032] text-[#f3f0f2] text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
              {tool.label} <span className="shortcut-badge ml-1">{tool.shortcut}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
