import React from 'react';
import { X, Globe, Compass, Sparkles, Check, Flame, Snowflake, Sun } from 'lucide-react';
import { HabitableWorld, HABITABLE_WORLDS } from './logic';

interface WorldSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWorldId: string;
  onSelectWorld: (world: HabitableWorld) => void;
}

export const WorldSelectorModal: React.FC<WorldSelectorModalProps> = ({
  isOpen,
  onClose,
  currentWorldId,
  onSelectWorld
}) => {
  if (!isOpen) return null;

  const referenceImage = '/assets/aistudio/IMG-20261105-WA0036_bb0fc27f.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-slate-950/95 border-2 border-cyan-500/50 rounded-2xl sm:rounded-3xl shadow-[0_0_70px_rgba(6,182,212,0.35)] overflow-hidden font-sans text-white">
        
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-amber-400 to-fuchsia-500" />

        {/* Modal Header matching Image 1 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-cyan-950/80 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/90 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl md:text-2xl font-black font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-amber-200 to-fuchsia-200">
                  NEX KONI v9.2
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                  SELECCIÓN DE MUNDOS HABITABLES
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                Elige un mundo para comenzar tu expedición • 3 MUNDOS DISPONIBLES
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Official Graphic Reference Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-black/80 max-h-52 hidden md:block">
            <img
              src={referenceImage}
              alt="Nex Koni v9.2 Mundos Habitables"
              className="w-full h-52 object-cover object-top opacity-75 hover:opacity-100 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold drop-shadow">
                3 MUNDOS HÍBRIDOS DISPONIBLES EN TIEMPO REAL: TUNDRA • DESIERTO • VOLCÁN
              </span>
              <span className="text-amber-300 drop-shadow">Renderizado Three.js Activo</span>
            </div>
          </div>

          {/* 3 Habitable Worlds Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HABITABLE_WORLDS.map((world) => {
              const isSelected = currentWorldId === world.id;

              return (
                <div
                  key={world.id}
                  onClick={() => onSelectWorld(world)}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group active:scale-95 ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_35px_rgba(6,182,212,0.45)] scale-[1.02]'
                      : 'bg-slate-950/90 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80'
                  }`}
                >
                  {/* Badge & Active State */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                      {world.badge}
                    </span>
                    {isSelected && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] font-mono flex items-center gap-1 shadow-md shadow-cyan-400/50">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>MUNDO ACTUAL</span>
                      </span>
                    )}
                  </div>

                  {/* World Icon & Title */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {world.id === 'tundra_cristal' && '❄️'}
                        {world.id === 'desierto_dorado' && '☀️'}
                        {world.id === 'yermo_volcanico' && '🌋'}
                      </div>
                      <div>
                        <h2 className="text-base font-black font-cinzel tracking-wider text-white">
                          {world.name}
                        </h2>
                        <div className="text-[11px] font-mono text-cyan-300 line-clamp-1">
                          {world.subtitle}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {world.description}
                    </p>

                    {/* Features list */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-1">
                      {world.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                          <span className="text-cyan-400">✦</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button matching Image 1: "SELECCIONAR" */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectWorld(world);
                        onClose();
                      }}
                      className={`w-full py-2 rounded-xl font-bold text-xs font-mono tracking-wider transition uppercase shadow-md active:scale-95 ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                          : 'bg-slate-800 hover:bg-cyan-600 text-white'
                      }`}
                    >
                      {isSelected ? 'EXPLORANDO ESTE MUNDO' : 'SELECCIONAR'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-cyan-950/80 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Teletransportación cuántica instantánea y cambio dinámico de bioma 3D</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition self-end sm:self-auto"
          >
            Cerrar [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
