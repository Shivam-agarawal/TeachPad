import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CanvasHost } from './CanvasHost';
import { useToolStore } from '@/state/toolStore';
import { useUIStore } from '@/state/uiStore';
import { SettingsDialog } from '@/components/panels/SettingsDialog';
import { ExportDialog } from '@/components/panels/ExportDialog';
import { LayerPanel } from '@/components/panels/LayerPanel';
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

export const WorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeToolId, setActiveTool } = useToolStore();
  const {
    isPresentationMode,
    setPresentationMode,
    isRecordingMode,
    setRecordingMode,
    toggleLayersPanel,
    toggleTheme,
    setSettingsOpen,
    setExportOpen,
  } = useUIStore();

  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [recSeconds, setRecSeconds] = useState(0);
  const [isRecPaused, setIsRecPaused] = useState(false);
  const totalPages = 4;

  const projectName = id
    ? id.replace(/^project-/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Q4 Strategy Whiteboard';

  // Recording Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isRecordingMode && !isRecPaused) {
      timer = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingMode, isRecPaused]);

  const formatRecTime = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#fcf8fb] text-[#1b1b1d] selection:bg-[#0058bc]/20 font-sans">
      {/* ─── Whiteboard Canvas ─── */}
      <main className="w-full h-full cursor-crosshair">
        <CanvasHost />
      </main>

      {/* ─── Top Left Overlay: Project Status ─── */}
      {!isPresentationMode && (
        <div className="fixed top-6 left-6 z-50 animate-entry">
          <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-[#c1c6d7]/30">
            <button
              onClick={() => navigate('/')}
              className="text-[20px] font-bold tracking-tight text-[#0058bc] hover:opacity-80 transition-opacity cursor-pointer"
            >
              TeachPad
            </button>
            <div className="w-[1px] h-4 bg-[#c1c6d7]/30 mx-1" />
            <span className="text-[14px] font-semibold text-[#1b1b1d]/80 max-w-[200px] truncate">
              {projectName}
            </span>
            <div className="flex items-center gap-1 ml-2 opacity-60 text-[#414755]">
              <span className="material-symbols-outlined text-[16px]">cloud_done</span>
              <span className="text-[12px] font-medium">Saved</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Top Right Overlay: Global Actions ─── */}
      {!isPresentationMode && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 animate-entry" style={{ animationDelay: '0.1s' }}>
          {/* Record */}
          <button
            onClick={() => {
              if (!isRecordingMode) {
                setRecordingMode(true);
                setRecSeconds(0);
                setIsRecPaused(false);
              } else {
                setRecordingMode(false);
              }
            }}
            className={`glass-panel px-3.5 py-2 flex items-center gap-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm ${
              isRecordingMode ? 'bg-red-500 text-white border-red-600' : 'hover:bg-white text-[#414755]'
            }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${isRecordingMode ? 'animate-pulse text-white' : 'text-red-500'}`}>
              videocam
            </span>
            <span className="text-[12px] font-semibold">{isRecordingMode ? 'Recording' : 'Record'}</span>
          </button>

          {/* Present */}
          <button
            onClick={() => setPresentationMode(true)}
            className="glass-panel px-3.5 py-2 flex items-center gap-1.5 rounded-full hover:bg-white text-[#414755] transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-[#0058bc]">present_to_all</span>
            <span className="text-[12px] font-semibold">Present</span>
          </button>

          {/* Layers */}
          <button
            onClick={toggleLayersPanel}
            aria-label="Layers"
            className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[#414755] group-hover:text-[#0058bc] transition-colors">layers</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) document.documentElement.requestFullscreen();
              else document.exitFullscreen();
            }}
            aria-label="Fullscreen"
            className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[#414755] group-hover:text-[#0058bc] transition-colors">fullscreen</span>
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            aria-label="Theme Toggle"
            className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[#414755] group-hover:text-[#0058bc] transition-colors">light_mode</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            className="glass-panel w-10 h-10 flex items-center justify-center rounded-full hover:bg-white transition-all active:scale-95 group cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[#414755] group-hover:text-[#0058bc] transition-colors">settings</span>
          </button>

          {/* Avatar Profile Portrait */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#0058bc]/20 hover:border-[#0058bc] transition-all cursor-pointer shadow-sm">
            <img
              alt="Educator Portrait"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyG8tOuBShgzZjoNgpcZq37iegIbS8hvqBF0PyUGfqW7pzKKLC-Ik-7x3OUnABG9XjjjVfweAKTCjg7CVwhFiDF2S2XyzKzT1gRiblz0yCIU-eeRcY1ctW-MBv6r5YEVM7P4ALmwci5PC6CiU6R1ABVQt6MzcV05M7ZazxkK-cj9V5aZ0FOExpTkm6X1zbeJi7LELix39T7PYB-zbkzTqV4X1LsvIQN7BBwuExkWszcdMNjLihn5Yrw43gGIJKCb2JX4XNQdiwZjg"
            />
          </div>
        </div>
      )}

      {/* ─── Recording Mode Header Bar (Stitch Screen 73e7b8de9e6f4ecba36d03cbf0ff2783) ─── */}
      {isRecordingMode && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-entry">
          <div className="glass-panel px-5 py-2 rounded-full flex items-center gap-4 border-red-500/30 bg-red-500/10 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-[12px] font-bold text-red-600 uppercase tracking-wider">REC</span>
              <span className="font-mono text-[14px] font-bold text-red-600">{formatRecTime(recSeconds)}</span>
            </div>

            <div className="w-[1px] h-4 bg-red-500/20" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRecPaused(!isRecPaused)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-red-600 shadow-sm hover:scale-105 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">{isRecPaused ? 'play_arrow' : 'pause'}</span>
              </button>
              <button
                onClick={() => setRecordingMode(false)}
                className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">stop</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Presentation Mode Bottom Bar (Stitch Screen b71e6684b8d14039bc243dce041dec08) ─── */}
      {isPresentationMode && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-entry">
          <div className="glass-panel px-6 py-2.5 rounded-full flex items-center gap-6 shadow-2xl border border-white/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eae7ea] text-[#414755] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="text-[13px] font-semibold text-[#1b1b1d]">
                Slide {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eae7ea] text-[#414755] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            <div className="w-[1px] h-5 bg-[#c1c6d7]/30" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTool('laser')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  activeToolId === 'laser' ? 'bg-[#0058bc] text-white shadow-sm' : 'hover:bg-[#eae7ea] text-[#414755]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
              </button>

              <button
                onClick={() => setPresentationMode(false)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#1b1b1d] text-white text-[12px] font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">fullscreen_exit</span>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Centered Signature Floating Toolbar (Stitch Screen d0e6cb756a5a48a4a22360490943b4d8) ─── */}
      {!isPresentationMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-entry" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-[#c1c6d7]/20 no-select">
            {/* Tools */}
            {TOOLS.map((tool) => {
              const isActive = activeToolId === tool.id;
              return (
                <div key={tool.id} className="group relative">
                  <button
                    onClick={() => setActiveTool(tool.id)}
                    aria-label={`${tool.label} (${tool.shortcut})`}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-[#0058bc] text-white shadow-sm'
                        : 'hover:bg-[#eae7ea] text-[#414755]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{tool.icon}</span>
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#303032] text-[#f3f0f2] text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
                    {tool.label} <span className="shortcut-badge ml-1">{tool.shortcut}</span>
                  </div>
                </div>
              );
            })}

            <div className="w-[1px] h-6 bg-[#c1c6d7]/30 mx-1" />

            {/* Undo */}
            <div className="group relative">
              <button
                aria-label="Undo (⌘Z)"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7ea] text-[#414755] transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">undo</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#303032] text-[#f3f0f2] text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
                Undo <span className="shortcut-badge ml-1">⌘Z</span>
              </div>
            </div>

            {/* Redo */}
            <div className="group relative">
              <button
                aria-label="Redo (⌘⇧Z)"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7ea] text-[#414755] transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">redo</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#303032] text-[#f3f0f2] text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
                Redo <span className="shortcut-badge ml-1">⌘⇧Z</span>
              </div>
            </div>

            <div className="w-[1px] h-6 bg-[#c1c6d7]/30 mx-1" />

            {/* Export */}
            <div className="group relative">
              <button
                onClick={() => setExportOpen(true)}
                aria-label="Export (⌘E)"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7ea] text-[#414755] transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">ios_share</span>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#303032] text-[#f3f0f2] text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md z-50">
                Export <span className="shortcut-badge ml-1">⌘E</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Bottom Right Overlay: Viewport Controls ─── */}
      {!isPresentationMode && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-entry" style={{ animationDelay: '0.3s' }}>
          <div className="glass-panel p-1 rounded-xl flex flex-col gap-1 shadow-sm">
            <button
              onClick={() => setZoom((z) => Math.min(z + 10, 300))}
              aria-label="Zoom In"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
            <div className="w-full h-[1px] bg-[#c1c6d7]/20" />
            <button
              onClick={() => setZoom((z) => Math.max(z - 10, 10))}
              aria-label="Zoom Out"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">remove</span>
            </button>
          </div>

          <div className="glass-panel px-4 py-1.5 rounded-full flex items-center gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tracking-wider text-[#414755]">ZOOM</span>
              <span className="text-[13px] font-semibold w-10 text-center">{zoom}%</span>
            </div>

            <div className="w-[1px] h-4 bg-[#c1c6d7]/30" />

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Prev Page"
                className="hover:text-[#0058bc] transition-colors cursor-pointer flex items-center text-[#414755]"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="text-[13px] font-semibold">
                {currentPage}/{totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next Page"
                className="hover:text-[#0058bc] transition-colors cursor-pointer flex items-center text-[#414755]"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            <div className="w-[1px] h-4 bg-[#c1c6d7]/30" />

            <button
              aria-label="Grid Toggle"
              className="text-[#414755] hover:text-[#0058bc] transition-colors cursor-pointer flex items-center"
            >
              <span className="material-symbols-outlined text-[18px]">grid_on</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Floating Dialogs ─── */}
      <LayerPanel />
      <SettingsDialog />
      <ExportDialog />
    </div>
  );
};
