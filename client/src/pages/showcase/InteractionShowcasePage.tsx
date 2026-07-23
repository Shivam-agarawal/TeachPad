import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const InteractionShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Interactive Toolbar');
  const [activeTool, setActiveTool] = useState('near_me');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredInk1, setHoveredInk1] = useState(false);

  const navItems = [
    { id: 'toolbar', label: 'Interactive Toolbar', icon: 'fluid_med' },
    { id: 'buttons', label: 'Button Presets', icon: 'buttons_alt' },
    { id: 'dialogs', label: 'Fluid Dialogs', icon: 'layers' },
    { id: 'ink', label: 'Ink Transitions', icon: 'draw' },
    { id: 'indicators', label: 'System Indicators', icon: 'potted_plant' },
  ];

  return (
    <div className="bg-[#fcf8fb] text-[#1b1b1d] font-sans min-h-screen flex selection:bg-[#0058bc]/20">
      {/* ─── Sidebar ─── */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#f6f3f5]/80 backdrop-blur-xl border-r border-[#c1c6d7]/20 p-6 z-40">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-[#0058bc] flex items-center justify-center text-white shadow">
            <span className="material-symbols-outlined text-[22px]">auto_awesome</span>
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-[#1b1b1d]">TeachPad</h2>
            <p className="text-[12px] text-[#414755] opacity-70">Interaction Lab</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveNav(item.label)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all ${
                activeNav === item.label
                  ? 'bg-[#6664e4] text-white font-bold shadow-sm'
                  : 'text-[#414755] hover:bg-[#e4e2e4]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#c1c6d7]/20">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 bg-[#0058bc] text-white rounded-xl py-2.5 text-[13px] font-medium hover:bg-[#0070eb] transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 md:ml-64 p-8 max-w-6xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-[32px] font-bold text-[#1b1b1d] tracking-tight">Interaction Showcase</h1>
            <p className="text-[14px] text-[#414755] mt-1">
              Master documentation of TeachPad's luminous motion language.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-full bg-[#eae7ea] hover:bg-[#e4e2e4] transition-colors cursor-pointer text-[#414755]">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-[#0058bc] flex items-center justify-center text-white font-bold text-[13px]">
              N
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Floating Toolbar */}
          <section id="toolbar" className="lg:col-span-12 glass-panel rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h3 className="text-[20px] font-bold text-[#1b1b1d]">Floating Toolbar</h3>
                <p className="text-[12px] text-[#414755] mt-0.5">Click tools to experience spring-based active states</p>
              </div>

              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-2xl shadow-xl border border-white/60 backdrop-blur-md">
                {['near_me', 'edit', 'rectangle', 'text_fields', 'image'].map((icon, i) => (
                  <React.Fragment key={icon}>
                    {i === 3 && <div className="w-[1px] h-8 bg-[#c1c6d7]/30 mx-1" />}
                    <button
                      onClick={() => setActiveTool(icon)}
                      className={`p-3 rounded-xl transition-all cursor-pointer ${
                        activeTool === icon
                          ? 'bg-[#0058bc] text-white shadow-md scale-105'
                          : 'text-[#414755] hover:bg-[#eae7ea]/50'
                      }`}
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Button Presets */}
          <section id="buttons" className="lg:col-span-6 glass-panel rounded-3xl p-8 shadow-sm">
            <h3 className="text-[20px] font-bold text-[#1b1b1d] mb-6">Button States</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-[#717786]">Hover State</p>
                <button className="w-full bg-[#6664e4] text-white py-3 px-6 rounded-xl hover:-translate-y-0.5 hover:scale-[1.02] shadow-md transition-all cursor-pointer font-medium text-[13px]">
                  Lift on Hover
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-[#717786]">Press State</p>
                <button className="w-full bg-[#e4e2e4] text-[#1b1b1d] py-3 px-6 rounded-xl active:scale-95 transition-all cursor-pointer font-medium text-[13px]">
                  Scale Down
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-[#717786]">Accent Active</p>
                <button className="w-full border-2 border-[#0058bc] text-[#0058bc] py-3 px-6 rounded-xl hover:bg-[#0058bc]/5 active:bg-[#0058bc] active:text-white transition-colors cursor-pointer font-medium text-[13px]">
                  Toggle State
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-[#717786]">Ghost Group</p>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">format_bold</span>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">format_italic</span>
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#eae7ea] text-[#414755] transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">format_underlined</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Fluid Dialogs */}
          <section id="dialogs" className="lg:col-span-6 glass-panel rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-[20px] font-bold text-[#1b1b1d]">Fluid Dialogs</h3>
              <p className="text-[13px] text-[#414755] mt-1 mb-6">Smooth transitions from origin point.</p>
            </div>
            <div className="relative h-32 flex items-center justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0070eb] text-white px-8 py-3 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#0070eb]/20 cursor-pointer text-[14px]"
              >
                Launch Project
              </button>
            </div>
          </section>

          {/* 4. Ink Stroke Animations */}
          <section id="ink" className="lg:col-span-8 glass-panel rounded-3xl p-8 shadow-sm">
            <h3 className="text-[20px] font-bold text-[#1b1b1d] mb-6">Ink Stroke Animations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onMouseEnter={() => setHoveredInk1(true)}
                onMouseLeave={() => setHoveredInk1(false)}
                className="bg-white/60 border border-[#c1c6d7]/20 rounded-2xl p-6 h-48 flex flex-col items-center justify-center cursor-pointer relative"
              >
                <svg className="w-full h-full" viewBox="0 0 200 60">
                  <path
                    d="M10,30 Q50,5 100,30 T190,30"
                    fill="none"
                    stroke="#0058bc"
                    strokeLinecap="round"
                    strokeWidth="3"
                    strokeDasharray="200"
                    strokeDashoffset={hoveredInk1 ? '0' : '200'}
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                </svg>
                <span className="absolute bottom-4 text-[12px] text-[#717786]">Hover to draw</span>
              </div>

              <div className="bg-white/60 border border-[#c1c6d7]/20 rounded-2xl p-6 h-48 flex items-center justify-center cursor-pointer">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke="#0058bc"
                    strokeLinecap="round"
                    strokeWidth="4"
                    className="animate-spin"
                    strokeDasharray="140"
                    strokeDashoffset="40"
                  />
                </svg>
              </div>
            </div>
          </section>

          {/* 5. System Indicators */}
          <section id="indicators" className="lg:col-span-4 glass-panel rounded-3xl p-8 shadow-sm">
            <h3 className="text-[20px] font-bold text-[#1b1b1d] mb-6">System Indicators</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
                <span className="text-[12px] font-medium text-[#414755]">Changes saved automatically</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#0058bc]/20 border-t-[#0058bc] rounded-full animate-spin" />
                <span className="text-[12px] font-medium text-[#414755]">Processing asset...</span>
              </div>

              <div className="relative w-full h-24 border-2 border-dashed border-[#0058bc]/40 rounded-lg flex items-center justify-center hover:bg-[#0058bc]/5 transition-colors cursor-pointer">
                <span className="text-[12px] font-medium text-[#717786]">Hover to select</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ─── Modal System ─── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1b1b1d]/30 backdrop-blur-sm animate-entry">
          <div className="glass-panel max-w-lg w-full rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#c1c6d7]/20">
              <h2 className="text-[20px] font-bold text-[#1b1b1d]">New Project</h2>
              <p className="text-[13px] text-[#414755]">Select a starting point for your creative journey.</p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/workspace/new-blank');
                }}
                className="p-4 rounded-2xl bg-[#f6f3f5] hover:bg-[#eae7ea] transition-colors cursor-pointer border border-[#c1c6d7]/20"
              >
                <span className="material-symbols-outlined text-[#0058bc] text-[28px] mb-2">description</span>
                <p className="text-[12px] font-bold text-[#1b1b1d]">Blank Canvas</p>
              </div>
              <div
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/pdf/unit-4-calculus');
                }}
                className="p-4 rounded-2xl bg-[#f6f3f5] hover:bg-[#eae7ea] transition-colors cursor-pointer border border-[#c1c6d7]/20"
              >
                <span className="material-symbols-outlined text-[#4c4aca] text-[28px] mb-2">
                  temp_preferences_custom
                </span>
                <p className="text-[12px] font-bold text-[#1b1b1d]">From Template</p>
              </div>
            </div>
            <div className="p-4 bg-[#f0edef]/40 flex justify-end gap-2 border-t border-[#c1c6d7]/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-[12px] font-medium hover:bg-[#eae7ea] transition-colors cursor-pointer text-[#414755]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  navigate('/workspace/new-project');
                }}
                className="bg-[#0058bc] text-white px-6 py-2 rounded-xl text-[12px] font-bold hover:bg-[#0070eb] shadow-md cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
