import React, { useState } from 'react';
import { useUIStore } from '@/state/uiStore';

interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  active: boolean;
}

const INITIAL_LAYERS: LayerItem[] = [
  { id: '1', name: 'Math Equations', visible: true, locked: false, active: false },
  { id: '2', name: 'Calculus Sketch', visible: true, locked: false, active: true },
  { id: '3', name: 'Diagram Outlines', visible: true, locked: false, active: false },
  { id: '4', name: 'Graph Grid', visible: true, locked: true, active: false },
];

export const LayerPanel: React.FC = () => {
  const { isLayersPanelOpen, setLayersPanelOpen } = useUIStore();
  const [layers, setLayers] = useState<LayerItem[]>(INITIAL_LAYERS);
  const [search, setSearch] = useState('');

  if (!isLayersPanelOpen) return null;

  const toggleVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const selectLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => ({ ...l, active: l.id === id }))
    );
  };

  const addLayer = () => {
    const newLayer: LayerItem = {
      id: String(Date.now()),
      name: `New Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      active: true,
    };
    setLayers((prev) => [newLayer, ...prev.map((l) => ({ ...l, active: false }))]);
  };

  const filteredLayers = layers.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed top-20 right-6 w-72 glass-panel rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-white/40 animate-entry">
      {/* ─── Header ─── */}
      <div className="px-4 py-3 border-b border-[#c1c6d7]/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0058bc]">layers</span>
          <h3 className="text-[15px] font-semibold text-[#1b1b1d]">Layers</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={addLayer}
            title="Add Layer"
            className="p-1 hover:bg-[#eae7ea] rounded-md transition-colors cursor-pointer text-[#414755]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
          </button>
          <button
            onClick={() => setLayersPanelOpen(false)}
            className="p-1 hover:bg-[#eae7ea] rounded-md transition-colors cursor-pointer text-[#414755]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* ─── Search / Filter Mini Bar ─── */}
      <div className="px-3 py-2 border-b border-[#c1c6d7]/10">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[#717786] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter layers..."
            className="w-full bg-[#f0edef]/60 border-none rounded-lg pl-7 pr-2 py-1 text-[12px] text-[#1b1b1d] focus:ring-1 focus:ring-[#0058bc]/30 placeholder:text-[#717786] outline-none"
          />
        </div>
      </div>

      {/* ─── Layers List ─── */}
      <div className="flex-grow overflow-y-auto max-h-[360px] py-1 px-2 space-y-1">
        {filteredLayers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => selectLayer(layer.id)}
            className={`group flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all duration-150 border ${
              layer.active
                ? 'bg-[#6664e4]/10 border-[#6664e4]/30'
                : 'hover:bg-white/60 border-transparent'
            } ${!layer.visible ? 'opacity-50' : ''}`}
          >
            <span className="material-symbols-outlined text-[#c1c6d7] cursor-grab text-[18px]">
              drag_indicator
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleVisibility(layer.id);
              }}
              className={`material-symbols-outlined text-[18px] cursor-pointer ${
                layer.visible ? 'text-[#0058bc]' : 'text-[#717786]'
              }`}
            >
              {layer.visible ? 'visibility' : 'visibility_off'}
            </button>

            <div className="flex-grow min-w-0">
              <span
                className={`text-[13px] truncate block ${
                  layer.active ? 'font-semibold text-[#6664e4]' : 'text-[#1b1b1d]'
                }`}
              >
                {layer.name}
              </span>
            </div>

            {layer.locked ? (
              <span className="material-symbols-outlined text-[14px] text-[#717786] px-1">
                lock
              </span>
            ) : (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[16px] text-[#414755] hover:bg-white/60 rounded p-0.5">
                  more_horiz
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── Footer Stats ─── */}
      <div className="px-4 py-2 border-t border-[#c1c6d7]/20 bg-white/20 flex justify-between items-center text-[12px] text-[#414755]">
        <span className="font-medium">{layers.length} Layers</span>
        <span className="shortcut-badge">⌘ L</span>
      </div>
    </div>
  );
};
