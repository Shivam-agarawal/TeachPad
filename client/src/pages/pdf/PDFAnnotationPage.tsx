import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToolStore } from '@/state/toolStore';
import type { ToolId } from '@/types/tools';

/* ─── PDF Thumbnail placeholders ─── */
const PDF_PAGES = [
  { page: 1, title: 'Section 4.1 — Derivatives' },
  { page: 2, title: 'Practice Problems' },
  { page: 3, title: 'Section 4.2 — Chain Rule' },
  { page: 4, title: 'Limit Notation' },
];

interface ToolBtn { id: ToolId | string; icon: string; label: string }

const HAND_TOOLS: ToolBtn[] = [
  { id: 'pan', icon: 'back_hand', label: 'Pan' },
  { id: 'select', icon: 'near_me', label: 'Select' },
];

const ANNOTATION_TOOLS: ToolBtn[] = [
  { id: 'pen', icon: 'edit', label: 'Pen' },
  { id: 'highlighter', icon: 'ink_highlighter', label: 'Highlighter' },
  { id: 'text', icon: 'text_fields', label: 'Text' },
  { id: 'sticky', icon: 'sticky_note_2', label: 'Sticky Note' },
];

const OBJECT_TOOLS: ToolBtn[] = [
  { id: 'rectangle', icon: 'shapes', label: 'Shapes' },
  { id: 'image', icon: 'image', label: 'Image' },
  { id: 'link', icon: 'link', label: 'Link' },
];

export const PDFAnnotationPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeToolId, setActiveTool } = useToolStore();
  const [activePdfPage, setActivePdfPage] = useState(1);
  const [zoom, setZoom] = useState(85);

  const ToolGroup = ({ tools }: { tools: ToolBtn[] }) => (
    <div className="flex items-center gap-1">
      {tools.map((tool) => {
        const isActive = activeToolId === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as ToolId)}
            aria-label={tool.label}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
              isActive
                ? 'bg-[#0058bc] text-white shadow-sm'
                : 'text-[#414755] hover:bg-[#eae7ea]/50'
            }`}
          >
            <span className="material-symbols-outlined">{tool.icon}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="bg-[#fcf8fb] overflow-hidden h-screen flex flex-col text-[#1b1b1d]">
      {/* ─── Top Navigation Bar ─── */}
      <header className="fixed top-0 w-full z-50 bg-[#fcf8fb]/80 backdrop-blur-md border-b border-[#c1c6d7]/20 shadow-sm flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="text-[20px] font-bold text-[#0058bc] tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
          >
            TeachPad
          </button>
          <nav className="hidden md:flex gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-[#414755] hover:text-[#1b1b1d] transition-colors text-[14px]">Dashboard</a>
            <a href="#" className="text-[#0058bc] font-semibold border-b-2 border-[#0058bc] pb-1 text-[14px]">Templates</a>
            <a href="#" className="text-[#414755] hover:text-[#1b1b1d] transition-colors text-[14px]">Shared</a>
            <a href="#" className="text-[#414755] hover:text-[#1b1b1d] transition-colors text-[14px]">Archive</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-[#eae7ea]/50 transition-all text-[#414755]">
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-[#eae7ea]/50 transition-all text-[#414755]">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button
            onClick={() => navigate(`/workspace/new-${Date.now()}`)}
            className="px-4 py-2 bg-[#0058bc] text-white rounded-full text-[12px] font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            New Project
          </button>
          <div className="w-8 h-8 rounded-full bg-[#0058bc] flex items-center justify-center text-white text-[12px] font-bold cursor-pointer border border-[#c1c6d7]/20">
            N
          </div>
        </div>
      </header>

      {/* ─── Main Workspace ─── */}
      <main className="flex-1 flex pt-[60px]">
        {/* ─── Side Panel: PDF Pages ─── */}
        <aside className="h-[calc(100vh-60px)] w-64 bg-white/70 backdrop-blur-xl border-r border-[#c1c6d7]/20 flex flex-col z-40">
          <div className="p-4 flex items-center justify-between border-b border-[#c1c6d7]/10">
            <div>
              <h3 className="text-[16px] font-bold text-[#1b1b1d]">PDF Pages</h3>
              <p className="text-[12px] text-[#414755] font-medium">Unit 4: Calculus.pdf</p>
            </div>
            <button className="text-[#717786] hover:text-[#1b1b1d] transition-colors cursor-pointer">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>

          {/* Thumbnails List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {PDF_PAGES.map((page) => (
              <button
                key={page.page}
                onClick={() => setActivePdfPage(page.page)}
                className={`w-full aspect-[3/4] rounded-lg overflow-hidden relative cursor-pointer transition-all ${
                  activePdfPage === page.page
                    ? 'border-2 border-[#0058bc] shadow-md'
                    : 'border border-[#c1c6d7]/30 hover:border-[#0058bc]/50 shadow-sm'
                }`}
              >
                {/* Placeholder content for PDF thumbnail */}
                <div className="w-full h-full bg-white flex flex-col items-center justify-center p-3">
                  <span className="material-symbols-outlined text-[#0058bc]/20 text-3xl mb-1">description</span>
                  <span className="text-[10px] text-[#717786] font-medium truncate w-full text-center">{page.title}</span>
                </div>
                <div
                  className={`absolute bottom-1 right-1 text-[10px] px-1.5 rounded font-mono ${
                    activePdfPage === page.page
                      ? 'bg-[#0058bc] text-white'
                      : 'bg-[#e4e2e4] text-[#414755]'
                  }`}
                >
                  {page.page}
                </div>
              </button>
            ))}
          </div>

          {/* Add Document Button */}
          <div className="p-4 border-t border-[#c1c6d7]/10">
            <button className="w-full py-3 px-3 bg-[#6664e4] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:translate-x-1 transition-transform cursor-pointer">
              <span className="material-symbols-outlined">cloud_upload</span>
              <span className="text-[12px]">Add Document</span>
            </button>
          </div>
        </aside>

        {/* ─── Infinite Canvas ─── */}
        <div className="flex-1 relative canvas-bg overflow-hidden flex items-center justify-center">
          {/* PDF Page Object with Selection Handles */}
          <div className="relative group">
            {/* Rotation Handle */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-0.5 h-6 bg-[#0058bc]" />
              <button className="w-8 h-8 rounded-full bg-white shadow-lg border border-[#c1c6d7]/30 flex items-center justify-center hover:bg-[#f6f3f5] transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[#0058bc] text-[18px]">refresh</span>
              </button>
            </div>

            {/* Page Display */}
            <div className="bg-white shadow-2xl rounded-sm w-[580px] aspect-[1/1.41] relative border border-[#c1c6d7]/20 p-8 flex flex-col">
              <h4 className="text-[28px] font-bold text-[#1b1b1d] mb-4">Section 4.2: Chain Rule</h4>
              <p className="text-[15px] text-[#414755] mb-6 leading-relaxed">
                The chain rule is a formula for finding the derivative of a composite function.
                In simple terms, if a variable z depends on y, and y depends on x, then z depends on x as well.
                The chain rule gives us a way to compute the derivative of this composite relationship.
              </p>

              {/* Diagram Placeholder */}
              <div className="w-full h-40 bg-[#f6f3f5] rounded-xl border border-dashed border-[#c1c6d7]/40 flex items-center justify-center mb-6">
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-[#0058bc]/20">show_chart</span>
                  <p className="text-[11px] text-[#717786] mt-1">Composite Function Graph</p>
                </div>
              </div>

              {/* Text placeholder lines */}
              <div className="space-y-3">
                <div className="h-2 w-full bg-[#eae7ea] rounded-full" />
                <div className="h-2 w-3/4 bg-[#eae7ea] rounded-full" />
                <div className="h-2 w-1/2 bg-[#eae7ea] rounded-full" />
              </div>

              {/* Annotation SVG Overlay */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full">
                <path d="M100 100 Q 150 50, 300 120" fill="none" stroke="#0058bc" strokeLinecap="round" strokeWidth="3" />
              </svg>
            </div>

            {/* Selection Handles */}
            {['-top-[5px] -left-[5px] cursor-nw-resize', '-top-[5px] -right-[5px] cursor-ne-resize', '-bottom-[5px] -left-[5px] cursor-sw-resize', '-bottom-[5px] -right-[5px] cursor-se-resize'].map((pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-[10px] h-[10px] bg-[#0058bc] border-2 border-white shadow-sm`}
              />
            ))}

            {/* Page Indicator */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 glass-panel border border-[#c1c6d7]/30 px-3 py-1 rounded-full shadow-sm">
              <span className="text-[12px] font-medium text-[#1b1b1d]">
                Page {activePdfPage} of {PDF_PAGES.length}
              </span>
            </div>
          </div>

          {/* ─── Floating Toolbar ─── */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-panel p-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-2">
              <ToolGroup tools={HAND_TOOLS} />
              <div className="w-[1px] h-6 bg-[#c1c6d7]/20 mx-1" />
              <ToolGroup tools={ANNOTATION_TOOLS} />
              <div className="w-[1px] h-6 bg-[#c1c6d7]/20 mx-1" />
              <ToolGroup tools={OBJECT_TOOLS} />
              <div className="w-[1px] h-6 bg-[#c1c6d7]/20 mx-1" />
              {/* Zoom / Meta */}
              <div className="flex items-center gap-3 px-2">
                <span className="font-mono text-[13px] text-[#414755] font-medium tracking-tight">{zoom}%</span>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 rounded border border-[#c1c6d7]/30 font-mono text-[10px] text-[#717786] bg-[#e4e2e4]">⌘</span>
                  <span className="px-1.5 py-0.5 rounded border border-[#c1c6d7]/30 font-mono text-[10px] text-[#717786] bg-[#e4e2e4]">1</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Bottom Right: Mini Map + Zoom ─── */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 items-end">
            {/* Mini Map */}
            <div className="glass-panel w-32 h-20 rounded-xl border border-[#c1c6d7]/20 shadow-sm p-2 overflow-hidden relative">
              <div className="w-8 h-12 bg-white border border-[#0058bc]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm" />
            </div>
            {/* Zoom Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 10, 300))}
                className="w-10 h-10 rounded-full glass-panel border border-[#c1c6d7]/20 shadow-sm flex items-center justify-center hover:bg-white transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 10, 10))}
                className="w-10 h-10 rounded-full glass-panel border border-[#c1c6d7]/20 shadow-sm flex items-center justify-center hover:bg-white transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="w-full bg-[#fcf8fb] border-t border-[#c1c6d7]/20 flex justify-between items-center px-6 py-4 z-50">
        <span className="text-[12px] text-[#414755]">© 2024 TeachPad Systems. Built for educators.</span>
        <div className="flex gap-4">
          <a className="text-[12px] text-[#414755] hover:text-[#0058bc] transition-colors" href="#">Privacy</a>
          <a className="text-[12px] text-[#414755] hover:text-[#0058bc] transition-colors" href="#">Terms</a>
          <a className="text-[12px] text-[#414755] hover:text-[#0058bc] transition-colors" href="#">Changelog</a>
          <a className="text-[12px] text-[#414755] hover:text-[#0058bc] transition-colors" href="#">Status</a>
        </div>
      </footer>
    </div>
  );
};
