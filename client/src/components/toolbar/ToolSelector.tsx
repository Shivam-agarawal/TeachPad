import React from 'react';
import type { ToolId } from '@/types/tools';
import { useToolStore } from '@/state/toolStore';

interface ToolOption {
  id: ToolId;
  label: string;
  shortcut: string;
}

const TOOLS: ToolOption[] = [
  { id: 'pen', label: 'Pen', shortcut: 'P' },
  { id: 'pencil', label: 'Pencil', shortcut: 'B' },
  { id: 'highlighter', label: 'Highlighter', shortcut: 'H' },
  { id: 'eraser', label: 'Eraser', shortcut: 'E' },
  { id: 'laser', label: 'Laser', shortcut: 'L' },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R' },
  { id: 'ellipse', label: 'Ellipse', shortcut: 'O' },
  { id: 'text', label: 'Text', shortcut: 'T' },
  { id: 'select', label: 'Select', shortcut: 'V' },
];

export const ToolSelector: React.FC = () => {
  const activeToolId = useToolStore((s) => s.activeToolId);
  const setActiveTool = useToolStore((s) => s.setActiveTool);

  return (
    <div className="flex items-center gap-1">
      {TOOLS.map((tool) => {
        const isActive = activeToolId === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            aria-label={`${tool.label} tool (${tool.shortcut})`}
            title={`${tool.label} (${tool.shortcut})`}
            className={`rounded-[var(--radius-sm)] px-2 py-1 text-[11px] font-medium transition-colors ${
              isActive
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
            }`}
          >
            {tool.label}
          </button>
        );
      })}
    </div>
  );
};
