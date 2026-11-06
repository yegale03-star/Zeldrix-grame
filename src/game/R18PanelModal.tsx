import React from 'react';
import { X, Shield, Sword, Heart, Zap, Sparkles, Navigation, Layers, Check } from 'lucide-react';
import { R18_SKINS, R18Skin } from './logic';

interface R18PanelModalProps {
  currentSkinId: string;
  isMounted: boolean;
  onSelectSkin: (skin: R18Skin) => void;
  onToggleMount: () => void;
  onTravelTorlan: () => void;
  onClose: () => void;
}

export const R18PanelModal: React.FC<R18PanelModalProps> = ({
  currentSkinId,
  isMounted,
  onSelectSkin,
  onToggleMount,
  onTravelTorlan,
  onClose
}) => {
  const activeSkin = R18_SKINS.find((s) => s.id === currentSkinId) || R18_SKINS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-cyan-500/70 shadow-[0_0_40px_rgba(6,182,212,0.4)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/30 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <span className="text-xl">⚔️</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 font-bold">
                  MU 3D NEXUS R18
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  HYBRID COMBAT EVOLUTION
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-rajdhani text-white tracking-wide">
                Panel de Integración R18
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Mount Toggle Button */}
            <button
              onClick={onToggleMount}
              className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition-all shadow-lg active:scale-98 ${
                isMounted
                  ? 'bg-gradient-to-r from-cyan-950 via-sky-900 to-cyan-900 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                  : 'bg-slate-900/80 border-slate-700 hover:border-cyan-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏇</span>
                <div className="text-left">
                  <div className="text-xs font-black font-mono tracking-wide">
                    {isMounted ? 'DESMONTAR CIBER CORCEL' : 'INVOCAR CIBER CORCEL'}
                  </div>
                  <div className="text-[11px] text-cyan-300">
                    {isMounted ? 'Montura activa (+80% velocidad)' : 'Presiona para montar el Corcel de Neón'}
                  </div>
                </div>
              </div>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 ${
                  isMounted ? 'bg-cyan-400 border-white animate-pulse' : 'bg-slate-700 border-slate-600'
                }`}
              />
            </button>

            {/* Travel Torlan Button */}
            <button
              onClick={onTravelTorlan}
              className="p-3.5 rounded-xl border-2 border-amber-500/60 bg-gradient-to-r from-amber-950/80 to-slate-900 hover:border-amber-400 text-white flex items-center justify-between transition-all shadow-lg active:scale-98"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌀</span>
                <div className="text-left">
                  <div className="text-xs font-black font-mono tracking-wide text-amber-300">
                    VIAJAR A CAÑÓN TORLAN
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Tier Alto (Lv. 100+) · Drones y Titanes
                  </div>
                </div>
              </div>
              <Navigation className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Skins Catalog */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono tracking-wide text-cyan-300 uppercase">
                  Catálogo de Skins R18 (Buffs de Combate)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Activa: <strong className="text-cyan-400">{activeSkin.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {R18_SKINS.map((skin) => {
                const isSelected = skin.id === currentSkinId;
                const hexColor = '#' + skin.color.toString(16).padStart(6, '0');

                return (
                  <div
                    key={skin.id}
                    onClick={() => onSelectSkin(skin)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
                          style={{ backgroundColor: hexColor }}
                        />
                        <div>
                          <div className="text-xs font-bold text-white font-rajdhani">{skin.name}</div>
                          <div className="text-[11px] text-amber-400 font-mono">{skin.desc}</div>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">{skin.badge}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ciber Corcel Lore / Visual Reference */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-cyan-500/30 flex items-center gap-3">
            <span className="text-3xl">🐎</span>
            <div className="text-xs text-slate-300">
              <strong className="text-cyan-300 font-mono">Ciber Corcel de Neón:</strong> Montura de combate con chasis de titanio oscurecido, crin y pezuñas de fuego de plasma cian. Aumenta la velocidad de exploración un <strong>+80%</strong> y añade presencia de combate a alta velocidad.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            R18.0 · Totalmente compatible con R17 & Solo Leveling
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
          >
            Aceptar y Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
};
