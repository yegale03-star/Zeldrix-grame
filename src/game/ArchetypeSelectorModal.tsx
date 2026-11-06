import React, { useState } from 'react';
import { X, Sparkles, Check, Crown, Shield, Zap, Flame, Compass } from 'lucide-react';
import { PlayerArchetype, ARCHETYPES, ArchetypeConfig } from './logic';

interface ArchetypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentArchetype: PlayerArchetype;
  onSelectArchetype: (archetype: PlayerArchetype) => void;
  onPlayFrequency?: (freq: number) => void;
}

export const ArchetypeSelectorModal: React.FC<ArchetypeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentArchetype,
  onSelectArchetype,
  onPlayFrequency
}) => {
  const [activeTab, setActiveTab] = useState<'nexx_koni' | 'legacy'>('nexx_koni');

  if (!isOpen) return null;

  const nexxKoniHeroes = ARCHETYPES.filter((a) => a.isNexxKoniHero);
  const legacyHeroes = ARCHETYPES.filter((a) => !a.isNexxKoniHero);

  const displayedHeroes = activeTab === 'nexx_koni' ? nexxKoniHeroes : legacyHeroes;

  // Background reference artwork path
  const referenceImg = '/assets/aistudio/IMG-20261105-WA0046_38099eb4.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col bg-slate-950/95 border-2 border-indigo-500/60 rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(168,85,247,0.35)] overflow-hidden font-sans text-white">
        
        {/* Glow Header Top Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-cyan-400" />

        {/* Header matching Image 4 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-indigo-900/40 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 border border-fuchsia-400/50 flex items-center justify-center text-amber-300 shadow-md">
              <Crown className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl md:text-2xl font-black font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-fuchsia-200 to-cyan-200">
                  “NEXX KONI” v9.2
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40">
                  SELECCIÓN DE PERSONAJES
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                SELECCIONA A TU PERSONAJE — SINTONIZACIÓN CUÁNTICA [3, 6, 9, 5] · 9.5 Hz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: NEXX KONI v9.2 vs Clásicos */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('nexx_koni')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                activeTab === 'nexx_koni'
                  ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md shadow-fuchsia-950/60 border border-fuchsia-400/60'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>NEXX KONI v9.2 (5 ARQUETIPOS)</span>
            </button>
            <button
              onClick={() => setActiveTab('legacy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition flex items-center gap-1.5 ${
                activeTab === 'legacy'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md border border-amber-400/60'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>CLÁSICOS (MU / SOLO / ZELDA)</span>
            </button>
          </div>

          <span className="hidden sm:inline text-[11px] font-mono text-cyan-400/80">
            Frecuencia Resonante: 9.5 Hz
          </span>
        </div>

        {/* Character Showcase Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Reference Banner Preview for high graphics scale */}
          <div className="relative rounded-2xl overflow-hidden border border-fuchsia-500/30 shadow-2xl bg-black/80 max-h-48 hidden md:block">
            <img
              src={referenceImg}
              alt="Nexx Koni v9.2 Selección de Personajes"
              className="w-full h-48 object-cover object-top opacity-70 hover:opacity-100 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-300 font-bold drop-shadow">
                PEDESTALES CUÁNTICOS EN SUPERPOSICIÓN: NEXX KONI • ESCARABAJO • 3 LOBOS
              </span>
              <span className="text-cyan-300 drop-shadow">Alta Fidelidad 2050</span>
            </div>
          </div>

          {/* Pedestals Grid */}
          <div className={`grid gap-3 sm:gap-4 ${
            activeTab === 'nexx_koni' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-3'
          }`}>
            {displayedHeroes.map((hero, index) => {
              const isSelected = currentArchetype === hero.id;

              return (
                <div
                  key={hero.id}
                  onClick={() => {
                    onSelectArchetype(hero.id);
                    if (onPlayFrequency) {
                      onPlayFrequency(hero.id === 'golden_scarab' ? 432 : hero.id === 'wolf_oracle' ? 528 : 369);
                    }
                  }}
                  className={`relative p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between group active:scale-95 ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.5)] scale-[1.02]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-fuchsia-500/50 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Active Indicator Crown */}
                  {isSelected && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[10px] font-mono flex items-center gap-1 shadow-lg shadow-cyan-400/50">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>ACTIVO</span>
                    </div>
                  )}

                  <div>
                    {/* Pedestal Top Visual */}
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800 flex flex-col items-center justify-center p-2 mb-3">
                      <div className="text-4xl sm:text-5xl mb-1 group-hover:scale-110 transition duration-300 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                        {hero.icon}
                      </div>

                      {/* Illuminated Pedestal Base Ring */}
                      <div
                        className="w-20 h-4 rounded-full border-2 shadow-lg mt-1"
                        style={{
                          borderColor: hero.primaryColor,
                          backgroundColor: `${hero.primaryColor}25`,
                          boxShadow: `0 0 15px ${hero.primaryColor}88`
                        }}
                      />

                      <span className="text-[10px] font-mono uppercase tracking-widest mt-1 text-slate-400">
                        {hero.pedestalLabel || `CLASE 0${index + 1}`}
                      </span>
                    </div>

                    {/* Hero Title & Subname */}
                    <div className="text-center">
                      <h3 className="text-xs sm:text-sm font-black font-cinzel tracking-wider text-white">
                        {hero.name}
                      </h3>
                      <div className="text-[10px] font-mono text-fuchsia-300 mt-0.5 line-clamp-1">
                        {hero.subname}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                        {hero.lore}
                      </p>
                    </div>
                  </div>

                  {/* Stats & Special Skill */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
                      <div className="p-1 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">ATK</span>
                        <span className="text-emerald-400 font-bold">+{hero.bonusAtk}</span>
                      </div>
                      <div className="p-1 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">DEF</span>
                        <span className="text-sky-400 font-bold">+{hero.bonusDef}</span>
                      </div>
                      <div className="p-1 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[9px]">SPD</span>
                        <span className="text-amber-400 font-bold">+{hero.bonusSpd}</span>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono text-center py-1 px-2 rounded bg-black/40 border border-slate-800 text-cyan-300 truncate">
                      ⚡ {hero.specialSkillName}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectArchetype(hero.id);
                        onClose();
                      }}
                      className={`w-full py-1.5 rounded-xl font-bold text-xs font-mono transition shadow-md active:scale-95 ${
                        isSelected
                          ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                          : 'bg-slate-800 hover:bg-fuchsia-700 text-white'
                      }`}
                    >
                      {isSelected ? 'SELECCIONADO' : 'SELECCIONAR'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-indigo-900/50 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>5 Arquetipos Legendarios adaptados a la Escala Gráfica Real NEXX KONI</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition self-end sm:self-auto"
          >
            Confirmar y Volver al Juego
          </button>
        </div>
      </div>
    </div>
  );
};
