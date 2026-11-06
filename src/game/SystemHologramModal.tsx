import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Shield,
  Sword,
  Activity,
  Plus,
  Edit3,
  Gift,
  AlertTriangle,
  Crown,
  Ghost,
  Check,
  ChevronRight,
  Flame,
  Award,
  Layers,
  Heart,
  Droplets
} from 'lucide-react';
import {
  SystemAttributes,
  SystemDailyQuest,
  ShadowSoldier,
  SystemSkill,
  calculateShadowCapacity,
  calculateExtractionChance,
  formatNumber
} from './logic';

interface SystemHologramModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributes: SystemAttributes;
  onAddStatPoint: (stat: keyof Pick<SystemAttributes, 'strength' | 'vitality' | 'agility' | 'intelligence' | 'perception'>) => void;
  dailyQuest: SystemDailyQuest;
  onClaimDailyQuest: () => void;
  shadowSoldiers: ShadowSoldier[];
  onRenameShadow: (id: string, newName: string) => void;
  onReleaseShadow: (id: string) => void;
  shadowsSummoned: boolean;
  onToggleSummonArmy: () => void;
  onActivateMonarchDomain: () => void;
  monarchDomainActive: boolean;
  skills: SystemSkill[];
  playerLevel: number;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  maxMana: number;
  onCheatFinishDaily?: () => void;
}

export const SystemHologramModal: React.FC<SystemHologramModalProps> = ({
  isOpen,
  onClose,
  attributes,
  onAddStatPoint,
  dailyQuest,
  onClaimDailyQuest,
  shadowSoldiers,
  onRenameShadow,
  onReleaseShadow,
  shadowsSummoned,
  onToggleSummonArmy,
  onActivateMonarchDomain,
  monarchDomainActive,
  skills,
  playerLevel,
  currentHp,
  maxHp,
  currentMana,
  maxMana,
  onCheatFinishDaily
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'daily' | 'army' | 'skills'>('status');
  const [editingShadowId, setEditingShadowId] = useState<string | null>(null);
  const [newNameInput, setNewNameInput] = useState<string>('');

  if (!isOpen) return null;

  const maxCapacity = calculateShadowCapacity(attributes.intelligence, playerLevel);

  const startRename = (soldier: ShadowSoldier) => {
    setEditingShadowId(soldier.id);
    setNewNameInput(soldier.name);
  };

  const submitRename = (id: string) => {
    if (newNameInput.trim()) {
      onRenameShadow(id, newNameInput.trim());
    }
    setEditingShadowId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-200">
      {/* Outer Hologram Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 border-2 border-cyan-400/60 shadow-[0_0_50px_rgba(6,182,212,0.35)] overflow-hidden">
        
        {/* Holographic Scanline Overlay & Cyber Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/10" />

        {/* Top Header */}
        <div className="relative flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/30 bg-slate-900/80">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-cyan-400 font-bold uppercase bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                  SYSTEM LOG
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline-block font-mono">
                  SOLO LEVELING INTERFACE v3.2
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-cinzel font-bold text-white tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                SISTEMA DEL MONARCA DE LAS SOMBRAS
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {attributes.availablePoints > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold animate-bounce flex items-center gap-1">
                <Plus className="w-3 h-3" />
                {attributes.availablePoints} PTS
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Holographic Tab Selector */}
        <div className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-6 pt-2.5 pb-2 border-b border-cyan-900/40 bg-slate-950/60 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'status'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>ESTADO (STATUS)</span>
          </button>

          <button
            onClick={() => setActiveTab('daily')}
            className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'daily'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>MISIÓN DIARIA</span>
            {dailyQuest.isCompleted && !dailyQuest.rewardClaimed && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('army')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'army'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Ghost className="w-4 h-4 text-indigo-400" />
            <span>EJÉRCITO DE SOMBRAS ({shadowSoldiers.length}/{maxCapacity})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all whitespace-nowrap ${
              activeTab === 'skills'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            <Crown className="w-4 h-4 text-purple-400" />
            <span>HABILIDADES</span>
          </button>
        </div>

        {/* Main Tab Content Area */}
        <div className="relative flex-1 p-3 sm:p-6 overflow-y-auto max-h-[68vh] text-slate-200">
          
          {/* TAB 1: ESTADO / STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Hunter Profile Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-cyan-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    👑
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base font-cinzel">
                      {attributes.playerName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-cyan-300 font-mono font-semibold">{attributes.title}</span>
                      <span className="px-1.5 py-0.2 rounded bg-purple-950/80 border border-purple-400/40 text-[10px] text-purple-300 font-bold">
                        {attributes.hunterRank}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-400" /> SALUD (HP)
                    </span>
                    <span className="text-rose-400 font-bold">{currentHp} / {maxHp}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-rose-950">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400"
                      style={{ width: `${Math.min(100, Math.max(0, (currentHp / maxHp) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> MANÁ (MP)
                    </span>
                    <span className="text-cyan-400 font-bold">{currentMana} / {maxMana}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-cyan-950">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-blue-400"
                      style={{ width: `${Math.min(100, Math.max(0, (currentMana / maxMana) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stat Allocation Header */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-sm font-bold text-cyan-300 font-cinzel">
                    PARÁMETROS DE ATRIBUTOS (STATS)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Asigna tus puntos de crecimiento libremente para moldear el poder del Monarca.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Puntos disponibles:</div>
                  <div className="text-base font-bold font-mono text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]">
                    {attributes.availablePoints} PTS
                  </div>
                </div>
              </div>

              {/* Stat Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* STR */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400">
                      <Sword className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-white">FUERZA (STR)</span>
                        <span className="text-xs text-cyan-400 font-mono font-bold">{attributes.strength}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        +{attributes.strength * 2} Daño Físico Melee
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={attributes.availablePoints <= 0}
                    onClick={() => onAddStatPoint('strength')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 disabled:opacity-30 disabled:pointer-events-none active:scale-95 text-xs font-bold font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1
                  </button>
                </div>

                {/* VIT */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-white">VITALIDAD (VIT)</span>
                        <span className="text-xs text-cyan-400 font-mono font-bold">{attributes.vitality}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        +{attributes.vitality * 10} HP Máx, +{Math.round(attributes.vitality * 0.8)} Defensa
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={attributes.availablePoints <= 0}
                    onClick={() => onAddStatPoint('vitality')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 disabled:opacity-30 disabled:pointer-events-none active:scale-95 text-xs font-bold font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1
                  </button>
                </div>

                {/* AGI */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-white">AGILIDAD (AGI)</span>
                        <span className="text-xs text-cyan-400 font-mono font-bold">{attributes.agility}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        +Velocidad de movimiento y evasión táctica
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={attributes.availablePoints <= 0}
                    onClick={() => onAddStatPoint('agility')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 disabled:opacity-30 disabled:pointer-events-none active:scale-95 text-xs font-bold font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1
                  </button>
                </div>

                {/* INT */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400">
                      <Ghost className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-white">INTELIGENCIA (INT)</span>
                        <span className="text-xs text-cyan-400 font-mono font-bold">{attributes.intelligence}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        +{attributes.intelligence * 8} MP Máx, Capacidad Sombras: {maxCapacity}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={attributes.availablePoints <= 0}
                    onClick={() => onAddStatPoint('intelligence')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 disabled:opacity-30 disabled:pointer-events-none active:scale-95 text-xs font-bold font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1
                  </button>
                </div>

                {/* PER */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between sm:col-span-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-white">PERCEPCIÓN (PER)</span>
                        <span className="text-xs text-cyan-400 font-mono font-bold">{attributes.perception}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        +Éxito de Extracción de Sombras (ARISE) y tasa de hallazgo de reliquias
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={attributes.availablePoints <= 0}
                    onClick={() => onAddStatPoint('perception')}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 disabled:opacity-30 disabled:pointer-events-none active:scale-95 text-xs font-bold font-mono flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> +1
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MISIÓN DIARIA / DAILY QUEST */}
          {activeTab === 'daily' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/40 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      MISIÓN DIARIA DE SUPERVIVENCIA
                    </span>
                    <h3 className="text-base font-bold text-white font-cinzel mt-1">
                      {dailyQuest.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {dailyQuest.description}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-400/30 text-amber-400">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                {/* Goals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Goal 1: Sword Swings / Pushups */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">🏋️ Espadazos / Ataques de Espada</span>
                      <span className="font-bold text-cyan-400">
                        {dailyQuest.swordSwings.current} / {dailyQuest.swordSwings.target}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{
                          width: `${Math.min(100, (dailyQuest.swordSwings.current / dailyQuest.swordSwings.target) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Goal 2: Distance Run */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">🏃 Carrera en el Mundo Abierto</span>
                      <span className="font-bold text-cyan-400">
                        {dailyQuest.distanceMeters.current} / {dailyQuest.distanceMeters.target} m
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width: `${Math.min(100, (dailyQuest.distanceMeters.current / dailyQuest.distanceMeters.target) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Goal 3: Monsters killed */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">💀 Monstruos Abatidos</span>
                      <span className="font-bold text-cyan-400">
                        {dailyQuest.monstersKilled.current} / {dailyQuest.monstersKilled.target}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400"
                        style={{
                          width: `${Math.min(100, (dailyQuest.monstersKilled.current / dailyQuest.monstersKilled.target) * 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Goal 4: Shadows Extracted */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-slate-300">🌌 Sombras Extraídas (ARISE)</span>
                      <span className="font-bold text-cyan-400">
                        {dailyQuest.shadowsExtracted.current} / {dailyQuest.shadowsExtracted.target}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400"
                        style={{
                          width: `${Math.min(100, (dailyQuest.shadowsExtracted.current / dailyQuest.shadowsExtracted.target) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Rewards Area */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                    <span className="text-amber-400 font-bold">RECOMPENSAS:</span>
                    <span>+{dailyQuest.rewards.statPoints} Puntos Stats</span>
                    <span>+{dailyQuest.rewards.rupees} Rupias</span>
                    <span className="text-purple-300">🎁 {dailyQuest.rewards.lootBox}</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {onCheatFinishDaily && !dailyQuest.isCompleted && (
                      <button
                        onClick={onCheatFinishDaily}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs hover:text-white"
                        title="Autocompletar misión para probar recompensas"
                      >
                        ⚡ Completar
                      </button>
                    )}
                    <button
                      disabled={!dailyQuest.isCompleted || dailyQuest.rewardClaimed}
                      onClick={onClaimDailyQuest}
                      className={`w-full sm:w-auto px-4 py-2 rounded-xl font-bold font-mono text-xs sm:text-sm tracking-wide transition-all ${
                        dailyQuest.rewardClaimed
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : dailyQuest.isCompleted
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] active:scale-95 animate-pulse'
                          : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {dailyQuest.rewardClaimed ? '✓ RECOMPENSA RECLAMADA' : '🎁 RECLAMAR RECOMPENSA'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Warning box */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  No completar la misión diaria antes de la media noche transportará al Cazador a la Zona de Penalización (Supervivencia de 4 horas en el Desierto).
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: EJÉRCITO DE SOMBRAS / SHADOW ARMY */}
          {activeTab === 'army' && (
            <div className="space-y-4">
              {/* Army Command Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-900/80 border border-indigo-500/40">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white font-cinzel text-sm sm:text-base">
                      EJÉRCITO DE LAS SOMBRAS DEL MONARCA
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-400 text-indigo-300 font-mono text-xs font-bold">
                      {shadowSoldiers.length} / {maxCapacity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Soldados espectrales extraídos con el comando ¡SURGE! (ARISE). Combaten a tu lado en el mundo 3D.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={onToggleSummonArmy}
                    className={`flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide border transition-all active:scale-95 ${
                      shadowsSummoned
                        ? 'bg-indigo-500/30 border-indigo-400 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {shadowsSummoned ? '🌑 GUARDAR EN LA SOMBRA' : '🌌 ¡SURJAN! (INVOCAR AL MUNDO)'}
                  </button>

                  <button
                    onClick={onActivateMonarchDomain}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wide border transition-all active:scale-95 ${
                      monarchDomainActive
                        ? 'bg-purple-600 border-purple-300 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] animate-pulse'
                        : 'bg-purple-950/60 border-purple-500/50 text-purple-300 hover:bg-purple-900/60'
                    }`}
                  >
                    👑 DOMINIO (+50% ATK)
                  </button>
                </div>
              </div>

              {/* Soldiers List */}
              {shadowSoldiers.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
                  <Ghost className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="font-cinzel text-sm">Aún no has extraído soldados para tu ejército.</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Derrota monstruos en combate y acércate a sus almas para pronunciar: "¡SURGE!" (ARISE).
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shadowSoldiers.map((soldier) => {
                    const isEditing = editingShadowId === soldier.id;
                    return (
                      <div
                        key={soldier.id}
                        className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl border shadow-md"
                                style={{
                                  backgroundColor: `${soldier.color}20`,
                                  borderColor: soldier.color
                                }}
                              >
                                {soldier.icon}
                              </div>
                              <div>
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="text"
                                      value={newNameInput}
                                      onChange={(e) => setNewNameInput(e.target.value)}
                                      className="px-2 py-0.5 rounded bg-slate-950 border border-cyan-400 text-xs text-white"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => submitRename(soldier.id)}
                                      className="p-1 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-white text-sm">
                                      {soldier.name}
                                    </h4>
                                    <button
                                      onClick={() => startRename(soldier)}
                                      className="text-slate-500 hover:text-slate-300"
                                      title="Renombrar soldado"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span
                                    className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded"
                                    style={{
                                      backgroundColor: `${soldier.color}30`,
                                      color: soldier.color
                                    }}
                                  >
                                    RANGO {soldier.rank}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    Nvl. {soldier.level} • {soldier.kills} bajas
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => onReleaseShadow(soldier.id)}
                              className="text-[10px] text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50"
                              title="Liberar soldado de la sombra"
                            >
                              Liberar
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-mono text-slate-300 bg-slate-950/50 p-2 rounded-lg">
                            <div>⚔️ ATK: <span className="text-cyan-400 font-bold">{soldier.atk}</span></div>
                            <div>🛡️ DEF: <span className="text-emerald-400 font-bold">{soldier.def}</span></div>
                            <div className="col-span-2 text-[10px] text-slate-400 truncate">
                              ✨ Habilidad: {soldier.specialSkill}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HABILIDADES DEL SISTEMA / SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/30">
                <h3 className="font-bold text-purple-300 font-cinzel text-sm">
                  ÁRBOL DE HABILIDADES DEL MONARCA DE LAS SOMBRAS
                </h3>
                <p className="text-xs text-slate-400">
                  Poderes arcanos conferidos por el Sistema para dominar el campo de batalla.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-3 sm:p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-xl">
                            {skill.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-white text-sm">
                                {skill.name}
                              </h4>
                              <span className="text-[10px] text-cyan-400 font-mono font-bold">
                                [{skill.koreanName}]
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Nvl. {skill.level}/{skill.maxLevel} • {skill.type === 'active' ? `Coste: ${skill.manaCost} MP` : 'Pasiva'}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300">
                          {skill.isUnlocked ? 'DESBLOQUEADA' : 'BLOQUEADA'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-cyan-900/40 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>COMANDO DE VOZ RECONOCIDO: "¡SURGE! (ARISE)"</span>
          <span>ESTADO: CONECTADO AL SISTEMA</span>
        </div>

      </div>
    </div>
  );
};
