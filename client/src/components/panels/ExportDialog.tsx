import React, { useState } from 'react';
import { useUIStore } from '@/state/uiStore';

type ExportFormat = 'PNG' | 'JPEG' | 'PDF' | 'Print';

export const ExportDialog: React.FC = () => {
  const { isExportOpen, setExportOpen } = useUIStore();
  const [format, setFormat] = useState<ExportFormat>('PNG');
  const [quality, setQuality] = useState(90);
  const [scale, setScale] = useState('2x (Retina / 4K)');
  const [pageRange, setPageRange] = useState('1, 3-5');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [transparentBg, setTransparentBg] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isExportOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportOpen(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1b1b1d]/30 backdrop-blur-sm animate-entry"
      onClick={() => setExportOpen(false)}
    >
      <main
        className="relative z-50 w-full max-w-5xl h-[640px] flex glass-panel rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Left Side: Canvas Preview ─── */}
        <section className="flex-1 bg-[#f6f3f5] border-r border-[#c1c6d7]/20 flex flex-col relative overflow-hidden">
          <div className="canvas-bg absolute inset-0 opacity-40 z-0" />
          <div className="p-4 flex justify-between items-center z-10">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#414755]">Live Preview</span>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eae7ea] transition-colors text-[#414755]">
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eae7ea] transition-colors text-[#414755]">
                <span className="material-symbols-outlined text-[18px]">zoom_out</span>
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-6 relative z-10">
            <div className="w-[85%] aspect-[16/9] bg-white rounded shadow-xl overflow-hidden border border-[#c1c6d7]/20 group cursor-default transition-transform hover:scale-[1.02] relative">
              <img
                alt="Canvas High-Fidelity Preview"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeKMOUFDThlhhPdLMyDbAmDYYn0OSzrxd9pbldufsCC_dkbYc5MnaqtRR-U1lih90ZPLawoZAWLVfbAQWY6XvE_ImgkfxJGAY5YoyJdWKQJ6XSnKxKvG8E9Cu5Uv6phSS68Z-bSAm33Ol3TZlp7UtILqTNFj7WcaudFEYfmMoGe3YdV9cDDQyxajGM0f5_izbUAUK9eVgPz9U4gvaS0PNbAH2co-mmlwmxzPtOYCj3xlyUDLnKdxP9nglbV6KNCL8FjiC5fwo_yKs"
              />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center bg-[#1b1b1d]/40 backdrop-blur-md px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-medium text-white uppercase tracking-tight">1920 × 1080 PX</span>
                <span className="text-[10px] font-medium text-white uppercase tracking-tight">TeachPad System</span>
              </div>
            </div>
          </div>

          <div className="p-4 flex gap-3 z-10 overflow-x-auto border-t border-[#c1c6d7]/10">
            <div className="w-16 h-10 border-2 border-[#0058bc] rounded cursor-pointer bg-white overflow-hidden flex-shrink-0 shadow-sm">
              <img
                alt="Page 1 Thumb"
                className="w-full h-full object-cover opacity-80"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxSJAKeD0mnj6Cf4EP0aJaRPAXtqm7AWPRNcvp9jTui3VsWCiQusU6gfanFoqy-5fwtQLcxbASeGITVtvFcqK2w7Z370ayyHE-czezE8B7WTHr3LVIVOnheo4jBkDqpffnqKGnYqbnkqhaIhP6_kJUVrckieSlZ0GbA_y7d6QRCpKKD13W0WpOMSm_W5CUZmq1j0VgLrb76aGCS0pFbNGggNLY34cM2AvxsEVwDa1cdBaY7DONLn_IKpor_7g2NJki4cuabxUBHP4"
              />
            </div>
            <div className="w-16 h-10 border border-[#c1c6d7]/30 rounded cursor-pointer hover:border-[#717786] bg-[#f0edef] overflow-hidden flex-shrink-0" />
            <div className="w-16 h-10 border border-[#c1c6d7]/30 rounded cursor-pointer hover:border-[#717786] bg-[#f0edef] overflow-hidden flex-shrink-0" />
          </div>
        </section>

        {/* ─── Right Side: Export Settings ─── */}
        <aside className="w-[360px] flex flex-col bg-[#fcf8fb]/90 backdrop-blur-md">
          {/* Header */}
          <header className="px-6 py-4 flex justify-between items-center border-b border-[#c1c6d7]/20">
            <h2 className="text-[18px] font-bold text-[#1b1b1d]">Export Workspace</h2>
            <button
              onClick={() => setExportOpen(false)}
              className="p-1 rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </header>

          {/* Scrollable Settings */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Format Selector */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#717786]">Format</h3>
              <div className="grid grid-cols-4 gap-1 bg-[#eae7ea] p-1 rounded-lg">
                {(['PNG', 'JPEG', 'PDF', 'Print'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-1.5 rounded text-[12px] transition-colors cursor-pointer ${
                      format === fmt
                        ? 'bg-white text-[#0058bc] shadow-sm font-semibold'
                        : 'text-[#414755] font-medium hover:text-[#1b1b1d]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Scale */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#717786]">Export Size</h3>
                <span className="text-[10px] font-mono text-[#0058bc] bg-[#0070eb]/10 px-2 py-0.5 rounded">300 DPI</span>
              </div>
              <select
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="w-full bg-[#f6f3f5] border border-[#c1c6d7]/30 rounded-lg px-3 py-2 text-[13px] text-[#1b1b1d] focus:outline-none focus:ring-2 focus:ring-[#0058bc]/20 cursor-pointer"
              >
                <option>1x (Original Size)</option>
                <option>2x (Retina / 4K)</option>
                <option>3x (Super Resolution)</option>
                <option>Custom Scaling...</option>
              </select>
            </div>

            {/* Quality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#717786]">Quality</h3>
                <span className="text-[12px] font-semibold text-[#0058bc]">{quality}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-1 bg-[#eae7ea] rounded-full appearance-none cursor-pointer accent-[#0058bc]"
              />
              <p className="text-[11px] text-[#414755]">Lower quality reduces file size significantly for sharing.</p>
            </div>

            {/* Page Range */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[#717786]">Page Range</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    className="w-full bg-[#f6f3f5] border border-[#c1c6d7]/30 rounded-lg pl-8 pr-3 py-2 text-[13px] text-[#1b1b1d] focus:outline-none focus:ring-2 focus:ring-[#0058bc]/20"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[16px] text-[#717786]">
                    auto_stories
                  </span>
                </div>
                <button
                  onClick={() => setPageRange('All')}
                  className="px-3 bg-[#eae7ea] rounded-lg text-[12px] font-medium text-[#414755] hover:text-[#1b1b1d] transition-colors cursor-pointer"
                >
                  All
                </button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-2 space-y-2">
              <label className="flex items-center gap-3 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c1c6d7] text-[#0058bc] focus:ring-[#0058bc]/30 cursor-pointer"
                />
                <span className="text-[13px] text-[#414755] group-hover:text-[#1b1b1d] transition-colors">
                  Include workspace metadata
                </span>
              </label>
              <label className="flex items-center gap-3 group cursor-pointer">
                <input
                  type="checkbox"
                  checked={transparentBg}
                  onChange={(e) => setTransparentBg(e.target.checked)}
                  className="w-4 h-4 rounded border-[#c1c6d7] text-[#0058bc] focus:ring-[#0058bc]/30 cursor-pointer"
                />
                <span className="text-[13px] text-[#414755] group-hover:text-[#1b1b1d] transition-colors">
                  Transparent background
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <footer className="p-6 border-t border-[#c1c6d7]/20 flex flex-col gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-[#0058bc] hover:bg-[#0070eb] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0058bc]/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Exporting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">file_download</span>
                  Export Workspace
                </>
              )}
            </button>
            <button
              onClick={() => setExportOpen(false)}
              className="w-full bg-[#eae7ea]/50 hover:bg-[#eae7ea] text-[#414755] py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <p className="text-[10px] text-center text-[#717786] uppercase tracking-widest mt-1">
              Estimated size: 4.2 MB
            </p>
          </footer>
        </aside>
      </main>
    </div>
  );
};
