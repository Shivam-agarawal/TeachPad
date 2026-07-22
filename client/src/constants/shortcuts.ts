// Keyboard shortcut map
// Matches PRD §Keyboard Shortcuts

import type { ToolId } from '@/types/tools';

export interface ShortcutDef {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  action: string;
  description: string;
}

/** Tool-switching shortcuts (single key, no modifier) */
export const TOOL_SHORTCUTS: Record<string, ToolId> = {
  p: 'pen',
  b: 'pencil',
  h: 'highlighter',
  e: 'eraser',
  l: 'laser',
  r: 'rectangle',
  o: 'ellipse',
  a: 'arrow',
  t: 'text',
  i: 'image',
  v: 'select',
} as const;

/** Action shortcuts (modifier keys) */
export const ACTION_SHORTCUTS: ShortcutDef[] = [
  { key: 'z', ctrl: true, action: 'undo', description: 'Undo' },
  { key: 'z', ctrl: true, shift: true, action: 'redo', description: 'Redo' },
  { key: 'c', ctrl: true, action: 'copy', description: 'Copy' },
  { key: 'v', ctrl: true, action: 'paste', description: 'Paste' },
  { key: 'x', ctrl: true, action: 'cut', description: 'Cut' },
  { key: 'd', ctrl: true, action: 'duplicate', description: 'Duplicate' },
  { key: '0', ctrl: true, action: 'resetZoom', description: 'Reset zoom to 100%' },
  { key: 'f', ctrl: true, shift: true, action: 'fitToContent', description: 'Fit to content' },
  { key: 'F11', action: 'fullscreen', description: 'Toggle fullscreen' },
  { key: 'Tab', action: 'toggleToolbar', description: 'Toggle toolbar visibility' },
  { key: 'p', ctrl: true, action: 'presentationMode', description: 'Presentation Mode' },
  { key: 'e', ctrl: true, action: 'exportMenu', description: 'Export menu' },
  { key: 's', ctrl: true, action: 'saveToDisk', description: 'Save project to disk' },
  { key: 'Escape', action: 'escape', description: 'Exit mode / close panel' },
] as const;
