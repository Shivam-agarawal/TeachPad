import React from 'react';
import { useUIStore } from '@/state/uiStore';
import { useSettingsStore } from '@/state/settingsStore';

export const SettingsDialog: React.FC = () => {
  const { isSettingsOpen, setSettingsOpen } = useUIStore();
  const { theme, setTheme, gridStyle, setGridStyle, pressureCurve, setPressureCurve } = useSettingsStore();

  if (!isSettingsOpen) return null;

  const SegmentedControl = <T extends string>({
    options,
    value,
    onChange,
  }: {
    options: T[];
    value: T;
    onChange: (v: T) => void;
  }) => (
    <div className="flex gap-1 bg-[#f0edef] rounded-xl p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all cursor-pointer ${
            value === opt
              ? 'bg-[#0058bc] text-white shadow-sm'
              : 'text-[#414755] hover:text-[#1b1b1d]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1b1b1d]/40 backdrop-blur-sm"
      onClick={() => setSettingsOpen(false)}
    >
      <div
        className="glass-panel w-[480px] max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden animate-entry"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c1c6d7]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058bc] text-[22px]">settings</span>
            <h2 className="text-[18px] font-bold text-[#1b1b1d]">Settings</h2>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#eae7ea] text-[#414755] hover:text-[#1b1b1d] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Appearance */}
          <section>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#717786] mb-3">Appearance</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#1b1b1d]">Theme</p>
                <p className="text-[11px] text-[#717786]">Choose your visual preference</p>
              </div>
              <SegmentedControl
                options={['light', 'dark', 'system'] as const}
                value={theme}
                onChange={setTheme as (v: string) => void}
              />
            </div>
          </section>

          {/* Canvas */}
          <section>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#717786] mb-3">Canvas</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#1b1b1d]">Grid Style</p>
                <p className="text-[11px] text-[#717786]">Background grid pattern</p>
              </div>
              <SegmentedControl
                options={['none', 'dot', 'line', 'graph'] as const}
                value={gridStyle as string}
                onChange={setGridStyle as (v: string) => void}
              />
            </div>
          </section>

          {/* Pen Input */}
          <section>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#717786] mb-3">Pen Input</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-[#1b1b1d]">Pressure Curve</p>
                <p className="text-[11px] text-[#717786]">How responsive the pen feels</p>
              </div>
              <SegmentedControl
                options={['light', 'default', 'firm'] as const}
                value={pressureCurve}
                onChange={setPressureCurve}
              />
            </div>
          </section>

          {/* About */}
          <section>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#717786] mb-3">About</h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f6f3f5]">
              <div className="w-10 h-10 rounded-xl bg-[#0058bc] flex items-center justify-center shadow">
                <span className="material-symbols-outlined text-white text-[20px]">edit</span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1b1b1d]">TeachPad v1.0.0</p>
                <p className="text-[11px] text-[#717786]">100% Offline-First • Local-First • Zero Server</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
