import React from 'react';
import { Sparkles, Ghost, AlertCircle, Zap } from 'lucide-react';
import { FallenShadowVortex, calculateExtractionChance } from './logic';

interface ShadowExtractionPromptProps {
  vortex: FallenShadowVortex | null;
  playerMana: number;
  playerLevel: number;
  intelligence: number;
  perception: number;
  onAttemptExtraction: (vortex: FallenShadowVortex) => void;
  onDismiss: () => void;
}

export const ShadowExtractionPrompt: React.FC<ShadowExtractionPromptProps> = ({
  vortex,
  playerMana,
  playerLevel,
  intelligence,
  perception,
  onAttemptExtraction,
  onDismiss
}) => {
  if (!vortex) return null;

  const currentAttempt = 4 - vortex.attemptsRemaining;
  const successChance = calculateExtractionChance(
    playerLevel,
    intelligence,
    perception,
    vortex.rank,
    currentAttempt
  );
  const chancePercent = Math.round(successChance * 100);
  const hasMana = playerMana >= vortex.manaCost;

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[60] w-[92%] sm:w-auto sm:min-w-[420px] max-w-lg select-none animate-in slide-in-from-bottom-6 duration-200">
      <div className="relative p-4 rounded-2xl bg-slate-950/95 border-2 border-purple-500/80 shadow-[0_0_35px_rgba(168,85,247,0.5)] backdrop-blur-xl overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-cyan-950/40 to-purple-900/30 pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-cyan-600/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-lg animate-pulse"
              style={{
                backgroundColor: `${vortex.color}30`,
                borderColor: vortex.color
              }}
            >
              {vortex.icon}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/50">
                  PRESENCIA DE SOMBRA DETECTADA
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">
                  {vortex.attemptsRemaining}/3 INTENTOS
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-cinzel mt-0.5">
                {vortex.enemyName}
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Rango Espiritual: <span className="text-purple-300 font-bold uppercase">{vortex.rank}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs"
          >
            ✕
          </button>
        </div>

        {/* Stats & Chance */}
        <div className="relative grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-purple-900/60 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Probabilidad:</span>
            <span className={`font-bold ${chancePercent >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {chancePercent}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Coste Maná:</span>
            <span className={`font-bold ${hasMana ? 'text-cyan-400' : 'text-rose-400'}`}>
              {vortex.manaCost} MP
            </span>
          </div>
        </div>

        {/* Action Button: ARISE / SURGE */}
        <div className="relative mt-3">
          <button
            disabled={!hasMana}
            onClick={() => onAttemptExtraction(vortex)}
            className={`w-full py-2.5 sm:py-3 rounded-xl font-bold font-mono tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              hasMana
                ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 text-white shadow-[0_0_25px_rgba(147,51,234,0.7)] hover:brightness-110 animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Ghost className="w-5 h-5" />
            <span>¡SURGE! (ARISE)</span>
          </button>
          {!hasMana && (
            <p className="text-center text-[11px] text-rose-400 mt-1 font-mono">
              Maná insuficiente. Bebe una poción de maná o descansa en la sombra.
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
