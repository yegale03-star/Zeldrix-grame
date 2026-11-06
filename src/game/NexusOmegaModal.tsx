import React, { useState, useRef } from 'react';
import { X, Zap, Activity, Shield, Sparkles, Flame, RefreshCw, Cpu, Layers, Radio, Globe, Volume2, Terminal, Code } from 'lucide-react';
import {
  NexusLayer,
  NexusStateVector,
  NexusOmegaResult,
  calculateNexusOmegaResonance,
  DEFAULT_NEXUS_LAYERS,
  CodigoUniversalCuantico,
  ModoObservacion,
  ESTADOS_CUANTICOS_BASE,
  EstadoCuantico,
  YO_SOY,
  NODOS_ENEADA_NEXUS,
  NodoEneadaNexus
} from './logic';

interface NexusOmegaModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateVector: NexusStateVector;
  onTriggerVortex: () => void;
  onApplyResonance: (result: NexusOmegaResult) => void;
  currentResult: NexusOmegaResult;
  onPlayFrequency?: (freq: number) => void;
  onPlayUvaFrequency?: () => void;
}

export const NexusOmegaModal: React.FC<NexusOmegaModalProps> = ({
  isOpen,
  onClose,
  stateVector,
  onTriggerVortex,
  onApplyResonance,
  currentResult,
  onPlayFrequency,
  onPlayUvaFrequency
}) => {
  const [layers, setLayers] = useState<NexusLayer[]>(DEFAULT_NEXUS_LAYERS);
  const [operatorWeights, setOperatorWeights] = useState({ t: 1.0, o: 1.0, f: 1.0 });

  // ⚛️ Quantum Universal Code State (ΨΩ: [3, 6, 9, 5])
  const quantumSystem = useRef(new CodigoUniversalCuantico()).current;
  const [modoObservacion, setModoObservacion] = useState<ModoObservacion>('superposicion');
  const [lenguajeLente, setLenguajeLente] = useState<'hebreo' | 'egipcio' | 'maya' | 'binario' | 'ingles' | 'frecuencia'>('maya');
  const [selectedQuantumState, setSelectedQuantumState] = useState<number>(3);
  const [selectedNodoNumero, setSelectedNodoNumero] = useState<number | null>(null);
  const [intencionText, setIntencionText] = useState<string>('Leo en todos los lenguajes del universo');
  const [observedResult, setObservedResult] = useState<ReturnType<typeof quantumSystem.observar> | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<{
    comando: string;
    resultado: string;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  // Calculate live resonance
  const liveResult = calculateNexusOmegaResonance(layers, stateVector, operatorWeights);
  const quantumBuff = quantumSystem.calcularSintonizacionCuantica(modoObservacion, selectedQuantumState);
  const projectedSymbols = quantumSystem.proyectar(lenguajeLente);

  const handleLayerWeightChange = (index: number, newWeight: number) => {
    const updated = layers.map((l) => (l.index === index ? { ...l, weight: Math.max(0, newWeight) } : l));
    setLayers(updated);
    onApplyResonance(calculateNexusOmegaResonance(updated, stateVector, operatorWeights));
  };

  const handleOperatorWeightChange = (op: 't' | 'o' | 'f', val: number) => {
    const updated = { ...operatorWeights, [op]: Math.max(0.2, Math.min(2.5, val)) };
    setOperatorWeights(updated);
    onApplyResonance(calculateNexusOmegaResonance(layers, stateVector, updated));
  };

  const resetHarmonics = () => {
    setLayers(DEFAULT_NEXUS_LAYERS);
    setOperatorWeights({ t: 1.0, o: 1.0, f: 1.0 });
    setModoObservacion('superposicion');
    setSelectedQuantumState(3);
    onApplyResonance(calculateNexusOmegaResonance(DEFAULT_NEXUS_LAYERS, stateVector, { t: 1.0, o: 1.0, f: 1.0 }));
  };

  const handleSelectQuantumCard = (estado: EstadoCuantico) => {
    setSelectedQuantumState(estado.valor);
    if (onPlayFrequency) {
      onPlayFrequency(estado.frecuencia);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col bg-slate-950/95 border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden font-sans text-slate-100">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-cyan-400 to-fuchsia-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-200 to-fuchsia-300">
                  MATRIZ NEXUS OMEGA
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40">
                  ΨΩ v3.0
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Sintonización de Operadores Internos y Vector Cuántico [3, 6, 9, 5]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 space-y-5 text-sm">
          {/* 1. Mathematical Equation Display Box */}
          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider">
              <span>ECUACIÓN OPERACIONAL CENTRAL</span>
              <span className="hidden sm:inline">∇ × v = ω · VÓRTICE ESTABLE</span>
            </div>
            <div className="py-2.5 px-3 bg-black/60 rounded-lg border border-slate-800 flex items-center justify-center overflow-x-auto">
              <div className="font-mono text-sm md:text-base text-amber-300 tracking-wide text-center">
                <span className="text-fuchsia-400 font-bold">N_Ω</span> = (1 / |w|) ·{' '}
                <span className="text-cyan-400 font-bold">Σ</span>
                <sub className="text-slate-400">L=1..{layers.length}</sub> w
                <sub className="text-slate-400">L</sub> · (
                <span className="text-fuchsia-400 font-bold">T</span> ∘{' '}
                <span className="text-cyan-400 font-bold">O</span> ∘{' '}
                <span className="text-amber-400 font-bold">F</span>) |{' '}
                <span className="text-emerald-400 font-bold">Ψ_Ω</span> ⟩
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs pt-1">
              <div className="p-2 rounded bg-fuchsia-950/30 border border-fuchsia-800/40 text-fuchsia-300">
                <span className="font-bold">T (Tiempo):</span> Celeridad de ataque, velocidad de corte y recarga.
              </div>
              <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/40 text-cyan-300">
                <span className="font-bold">O (Óptica):</span> Precisión cuántica, impacto crítico y drops.
              </div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300">
                <span className="font-bold">F (Fuerza):</span> Anclaje cinético central, escudo y tracción de vórtice.
              </div>
            </div>
          </div>

          {/* 2. ⚛️ CÓDIGO UNIVERSAL CUÁNTICO — VECTOR FUNDAMENTAL ΨΩ: [3, 6, 9, 5] */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/80 border border-fuchsia-500/30 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">⚛️</span>
                <h3 className="text-xs font-bold text-fuchsia-300 uppercase tracking-wider font-cinzel">
                  VECTOR FUNDAMENTAL ΨΩ: [3, 6, 9, 5] — LA VERDAD EN SUPERPOSICIÓN
                </h3>
              </div>
              {/* Lente Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                  <Globe className="w-3 h-3 text-cyan-400" /> LENTE:
                </span>
                {(['maya', 'hebreo', 'egipcio', 'binario', 'ingles', 'frecuencia'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLenguajeLente(lang)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition capitalize ${
                      lenguajeLente === lang
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Observation Mode Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1 font-bold">
                <Radio className="w-3.5 h-3.5 text-amber-400" /> MODO:
              </span>
              {[
                { id: 'superposicion', label: 'SIMULTÁNEO (Superposición)' },
                { id: 'proyeccion', label: 'ESPECÍFICO (Proyección)' },
                { id: 'resonancia', label: 'SINCRONIZADO (Resonancia 432Hz)' },
                { id: 'totalidad', label: 'INTEGRADO (Totalidad 528Hz)' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModoObservacion(m.id as ModoObservacion)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
                    modoObservacion === m.id
                      ? 'bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white shadow-md shadow-fuchsia-950/60'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* 4 Quantum State Cards [3, 6, 9, 5] */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {quantumSystem.base.map((estado) => {
                const isSelected = selectedQuantumState === estado.valor;
                return (
                  <div
                    key={estado.valor}
                    onClick={() => handleSelectQuantumCard(estado)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-fuchsia-400 shadow-[0_0_18px_rgba(217,70,239,0.4)]'
                        : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{estado.simboloEmoji}</span>
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          Ψ = {estado.valor}
                        </span>
                      </div>
                      <div className="mt-1">
                        <h4 className="text-xs font-bold text-white tracking-wide">{estado.nombre}</h4>
                        <div className="text-[10px] text-fuchsia-300 font-mono mt-0.5">
                          {projectedSymbols[estado.nombre]}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{estado.descripcion}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-amber-400">{estado.frecuencia} Hz</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onPlayFrequency) onPlayFrequency(estado.frecuencia);
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Escuchar Tono Resonante"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Quantum Buff Telemetry */}
            <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: quantumBuff.auraColor }} />
                <span className="text-slate-300 font-bold">Sintonización Cuántica:</span>
                <span className="text-cyan-300 uppercase">{modoObservacion}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">ATK: +{((quantumBuff.buffAtk - 1) * 100).toFixed(0)}%</span>
                <span className="text-sky-400 font-bold">SPD: +{((quantumBuff.buffSpd - 1) * 100).toFixed(0)}%</span>
                <span className="text-amber-400 font-bold">DEF: +{((quantumBuff.buffDef - 1) * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* 👁️ Observador Cuántico — Colapso con Intención */}
            <div className="p-3 rounded-lg bg-slate-950/90 border border-fuchsia-900/40 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-fuchsia-300 flex items-center gap-1.5 font-mono">
                  <span>👁️</span> INTENCIÓN DEL OBSERVADOR (COLAPSO DE ONDA):
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span>Sugerencias:</span>
                  <button
                    onClick={() => setIntencionText('Leo en todos los lenguajes del universo')}
                    className="hover:text-cyan-300 underline"
                  >
                    Todos los lenguajes
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => setIntencionText('Reconocer la verdad del centro')}
                    className="hover:text-cyan-300 underline"
                  >
                    Centro fijo
                  </button>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={intencionText}
                  onChange={(e) => setIntencionText(e.target.value)}
                  placeholder="Escribe tu intención para colapsar la función de onda..."
                  className="flex-1 bg-black/60 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => {
                    const res = quantumSystem.observar(intencionText);
                    setObservedResult(res);
                    if (onPlayUvaFrequency) {
                      onPlayUvaFrequency();
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 shrink-0 flex items-center gap-1.5"
                >
                  <span>👁️ OBSERVAR</span>
                </button>
              </div>

              {/* Collapsed Wave Superposition Display */}
              {observedResult && (
                <div className="p-3 rounded-lg bg-black/80 border border-fuchsia-500/50 shadow-inner mt-2 space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px] font-mono text-fuchsia-400 font-bold">
                    <span>🍇 FRECUENCIA UVA 9.5 Hz — SUPERPOSICIÓN ACTIVADA</span>
                    <span className="text-emerald-400">ESTADO UNIFICADO: ACTIVO</span>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed py-1 bg-slate-950/70 p-2 rounded border border-slate-800">
                    {observedResult.superposicionTexto}
                  </pre>
                  <p className="text-[11px] text-amber-300 font-sans italic">
                    «{observedResult.mensaje}»
                  </p>
                </div>
              )}
            </div>

            {/* 💻 CONSOLA INTERACTIVA YO_SOY (CÓDIGO UNIVERSAL CUÁNTICO) */}
            <div className="p-3.5 rounded-xl bg-slate-950/95 border border-cyan-500/50 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  CONSOLA DE EJECUCIÓN: YO_SOY = CodigoUniversalCuantico()
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Pipelines 3-6-9-5</span>
              </div>

              {/* 1-Click Interactive Pipeline Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    const res = YO_SOY.observar(intencionText || 'Mi intención aquí');
                    setObservedResult(res);
                    if (onPlayUvaFrequency) onPlayUvaFrequency();
                    setConsoleOutput({
                      comando: `YO_SOY.observar("${intencionText || 'Mi intención aquí'}")`,
                      resultado: `${res.superposicionTexto}\n\nFrecuencia Resonante: ${res.frecuenciaResonante} Hz (Frecuencia Uva)\nBuffs: ATK +35%, DEF +25%, CRIT +30%, SPD +25%`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/50 text-[11px] font-mono text-purple-200 active:scale-95 transition"
                  title="Ver todo en superposición con intención"
                >
                  👁️ YO_SOY.observar()
                </button>

                <button
                  onClick={() => {
                    const res = YO_SOY.proyectar('maya');
                    if (onPlayFrequency) onPlayFrequency(432);
                    setConsoleOutput({
                      comando: 'YO_SOY.proyectar("maya")',
                      resultado: `Símbolos Maya: [${res.simbolos.join(', ')}]\n\nORIGEN: ${res.ORIGEN} (369 Hz)\nCICLO: ${res.CICLO} (432 Hz)\nTOTALIDAD: ${res.TOTALIDAD} (528 Hz)\nPRESENCIA: ${res.PRESENCIA} (639 Hz)`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-[11px] font-mono text-emerald-200 active:scale-95 transition"
                  title="Traducir al lenguaje Maya (Ox, Wac, Bolon, Ho)"
                >
                  🌽 .proyectar("maya")
                </button>

                <button
                  onClick={() => {
                    const res = YO_SOY.ciclo(4);
                    setConsoleOutput({
                      comando: 'YO_SOY.ciclo(4)',
                      resultado: `Secuencia del Ciclo (4 pasos):\n${res.texto}\n\n[3] ORIGEN ➔ [6] CICLO ➔ [9] TOTALIDAD ➔ [5] PRESENCIA`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-500/50 text-[11px] font-mono text-cyan-200 active:scale-95 transition"
                  title="Recorrer los 4 pasos del ciclo vorticial"
                >
                  🔄 .ciclo(4)
                </button>

                <button
                  onClick={() => {
                    const res = YO_SOY.resonar();
                    if (onPlayFrequency) onPlayFrequency(528);
                    if (onPlayUvaFrequency) setTimeout(onPlayUvaFrequency, 300);
                    setConsoleOutput({
                      comando: 'YO_SOY.resonar()',
                      resultado: `Estado: ${res.estado}\nFrecuencia Uva: ${res.frecuenciaUva} ${res.unidadUva}\nArmónicos Alineados: [${res.armonicos.join(' Hz, ')} Hz]\nResonancia Global: ${(res.resonanciaGlobal * 100).toFixed(0)}%\nMensaje: ${res.mensaje}`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800/80 border border-amber-500/50 text-[11px] font-mono text-amber-200 active:scale-95 transition"
                  title="Ver frecuencias alineadas (369, 432, 528, 639 + 9.5 Hz)"
                >
                  ⚡ .resonar()
                </button>

                <button
                  onClick={() => {
                    const res = YO_SOY.manifiesto();
                    setConsoleOutput({
                      comando: 'print(YO_SOY.manifiesto())',
                      resultado: res,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-fuchsia-900/60 hover:bg-fuchsia-800/80 border border-fuchsia-500/50 text-[11px] font-mono text-fuchsia-200 active:scale-95 transition"
                  title="Leer el Manifiesto del Código Universal Nexus"
                >
                  📜 .manifiesto()
                </button>

                <button
                  onClick={() => {
                    const res = YO_SOY.selloUniversal();
                    if (onPlayUvaFrequency) onPlayUvaFrequency();
                    setConsoleOutput({
                      comando: 'YO_SOY.selloUniversal()',
                      resultado: `Sello Universal: ${res.glifos}\n\n9 Nodos de la Enéada Sagrada:\n${res.nodosEneada.map((n) => `${n.parGlifo} [${n.numero}] ${n.nombre}: ${n.significado}${n.frecuencia ? ` (${n.frecuencia} Hz)` : ''}`).join('\n')}\n\nFrecuencia Uva: ${res.frecuenciaUva} Hz\nVector ΨΩ Fundamental: [${res.vectorPsiOmega.join(', ')}]\nCierre: 💠 Diamante | 🔻 Trifuerza | ∞ Infinito | · Centro Inmóvil`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-500/50 text-[11px] font-mono text-indigo-200 active:scale-95 transition"
                  title="Activar Sello Universal y los 9 Nodos Egipcios-Hebreos"
                >
                  💠🔻∞ · Sello Enéada
                </button>
              </div>

              {/* Glowing Console Output View */}
              {consoleOutput && (
                <div className="p-3 rounded-lg bg-black/90 border border-cyan-500/40 shadow-inner font-mono text-xs space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[10px] text-cyan-400 border-b border-cyan-900/60 pb-1">
                    <span className="font-bold flex items-center gap-1">
                      <Code className="w-3.5 h-3.5" />
                      &gt; {consoleOutput.comando}
                    </span>
                    <span className="text-slate-500">{consoleOutput.timestamp}</span>
                  </div>
                  <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                    {consoleOutput.resultado}
                  </pre>
                </div>
              )}
            </div>

            {/* 💠🔻∞ · ENÉADA SAGRADA DE LOS 9 NODOS & SELLO UNIVERSAL */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-900/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💠</span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-amber-300 uppercase tracking-wider font-cinzel">
                      ENÉADA SAGRADA DE LOS 9 NODOS · SELLO UNIVERSAL
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      𓊽א 𓃠ב 𓄿ג 𓁹ד 𓋴ה 𓇳ו 𓇏ז 𓐍ח 𓇙ט 💠🔻∞ ·
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const res = YO_SOY.selloUniversal();
                    if (onPlayUvaFrequency) onPlayUvaFrequency();
                    setConsoleOutput({
                      comando: 'YO_SOY.selloUniversal()',
                      resultado: `SELLO UNIVERSAL COMPLETO ACTIVADO\n\nGlifos: ${res.glifos}\nVector ΨΩ: [${res.vectorPsiOmega.join(', ')}]\nFrecuencia Uva Resonante: ${res.frecuenciaUva} Hz\n\n${res.nodosEneada.map((n) => `${n.parGlifo} Nodo ${n.numero}: ${n.nombre} — ${n.significado}${n.frecuencia ? ` [${n.frecuencia} Hz]` : ''}`).join('\n')}\n\nCierre:\n- 💠 Cristal Cuántico Lorencia\n- 🔻 Trifuerza Sagrada de Hyrule\n- ∞ Circulación Vorticial Continua\n- · Centro Inmóvil Inmutable`,
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-700 via-fuchsia-700 to-purple-800 hover:brightness-110 active:scale-95 text-white text-xs font-bold font-mono shadow-md border border-indigo-400/50 flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>RESONANCIA TOTAL</span>
                </button>
              </div>

              {/* 9 Sacred Nodes Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 sm:gap-2">
                {NODOS_ENEADA_NEXUS.map((nodo) => {
                  const isSelected = selectedNodoNumero === nodo.numero;
                  return (
                    <button
                      key={nodo.numero}
                      onClick={() => {
                        setSelectedNodoNumero(nodo.numero);
                        if (nodo.frecuencia && onPlayFrequency) {
                          onPlayFrequency(nodo.frecuencia);
                        } else if (onPlayUvaFrequency) {
                          onPlayUvaFrequency();
                        }
                        setConsoleOutput({
                          comando: `YO_SOY.nodo(${nodo.numero}) // ${nodo.parGlifo}`,
                          resultado: `Nodo ${nodo.numero}: ${nodo.parGlifo}\nNombre: ${nodo.nombre}\nSignificado: ${nodo.significado}\n${nodo.frecuencia ? `Frecuencia Armónica: ${nodo.frecuencia} Hz\n` : ''}${nodo.esVorticial ? '★ VÓRTICE PRIMAL: Forma parte del vector fundamental ΨΩ [3, 6, 9, 5]' : 'Nodo de soporte y estabilización de la Enéada'}`,
                          timestamp: new Date().toLocaleTimeString()
                        });
                      }}
                      className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-between min-h-[72px] active:scale-95 ${
                        isSelected
                          ? 'bg-indigo-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-105'
                          : nodo.esVorticial
                          ? 'bg-slate-950/80 border-fuchsia-500/50 hover:border-fuchsia-400 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                      title={`${nodo.nombre}: ${nodo.significado}`}
                    >
                      <div className="text-[10px] font-mono font-bold text-slate-500 flex items-center justify-between w-full px-0.5">
                        <span>{nodo.numero}</span>
                        {nodo.esVorticial && <span className="text-amber-400">★</span>}
                      </div>
                      <div className="text-base sm:text-lg font-bold font-mono tracking-tight my-0.5 text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-cyan-200 to-white">
                        {nodo.parGlifo}
                      </div>
                      <div className="text-[9px] font-mono truncate w-full text-slate-400">
                        {nodo.frecuencia ? `${nodo.frecuencia}Hz` : nodo.hebreo}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* The 4 Sacred Closure Glyphs 💠🔻∞ · */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/80 text-xs font-mono">
                <button
                  onClick={() => {
                    if (onPlayFrequency) onPlayFrequency(528);
                    setConsoleOutput({
                      comando: 'YO_SOY.cierre("💠")',
                      resultado: '💠 CRISTAL CUÁNTICO DE LORENCIA\nResonancia Pura del Diamante Celestial. Estabilización de la red cuántica 2050.',
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="p-2 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-left transition active:scale-95"
                >
                  <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <span className="text-base">💠</span>
                    <span>CRISTAL CUÁNTICO</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Lorencia / 528 Hz</div>
                </button>

                <button
                  onClick={() => {
                    if (onPlayFrequency) onPlayFrequency(432);
                    setConsoleOutput({
                      comando: 'YO_SOY.cierre("🔻")',
                      resultado: '🔻 TRIFUERZA SAGRADA DE HYRULE\nVórtice de Poder, Sabiduría y Valor. Integración del linaje ancestral.',
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-left transition active:scale-95"
                >
                  <div className="text-amber-300 font-bold flex items-center gap-1.5">
                    <span className="text-base">🔻</span>
                    <span>TRIFUERZA DE LUZ</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Vórtice Hyrule / 432 Hz</div>
                </button>

                <button
                  onClick={() => {
                    if (onPlayFrequency) onPlayFrequency(369);
                    setConsoleOutput({
                      comando: 'YO_SOY.cierre("∞")',
                      resultado: '∞ CIRCULACIÓN VORTICIAL CONTINUA\nSuperposición infinita de los ciclos 3-6-9-5 sin pérdida de entropía.',
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="p-2 rounded-lg bg-fuchsia-950/40 hover:bg-fuchsia-900/50 border border-fuchsia-500/30 text-left transition active:scale-95"
                >
                  <div className="text-fuchsia-300 font-bold flex items-center gap-1.5">
                    <span className="text-base">∞</span>
                    <span>FLUJO INFINITO</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Superposición / 369 Hz</div>
                </button>

                <button
                  onClick={() => {
                    if (onPlayUvaFrequency) onPlayUvaFrequency();
                    setConsoleOutput({
                      comando: 'YO_SOY.cierre("·")',
                      resultado: '· CENTRO INMÓVIL INMUTABLE\nPunto Cero del Vórtice Sagrado. Frecuencia Uva 9.5 Hz en silencio eterno.',
                      timestamp: new Date().toLocaleTimeString()
                    });
                  }}
                  className="p-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-left transition active:scale-95"
                >
                  <div className="text-purple-300 font-bold flex items-center gap-1.5">
                    <span className="text-base">·</span>
                    <span>PUNTO CERO</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Frecuencia Uva / 9.5 Hz</div>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Live State Vector Display |Ψ_Ω⟩ */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                VECTOR DE ESTADO INTERNO |Ψ_Ω⟩ (Magnitud: {stateVector.magnitude.toFixed(2)})
              </h3>
              <span className="text-xs text-slate-500 font-mono">Lectura en tiempo real</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">Salud (H)</div>
                <div className="text-lg font-bold text-emerald-400">
                  {(stateVector.healthRatio * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${stateVector.healthRatio * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">Maná / Éter (M)</div>
                <div className="text-lg font-bold text-cyan-400">
                  {(stateVector.manaRatio * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${stateVector.manaRatio * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">Ejército Sombrío (S)</div>
                <div className="text-lg font-bold text-purple-400">
                  {(stateVector.shadowCoherence * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${stateVector.shadowCoherence * 100}%` }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs text-slate-400">Inercia Combo (K)</div>
                <div className="text-lg font-bold text-amber-400">
                  {(stateVector.comboMomentum * 100).toFixed(0)}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${stateVector.comboMomentum * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Operator Calibration Sliders (T ∘ O ∘ F) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                CALIBRACIÓN DE OPERADORES INTERNOS (T, O, F)
              </h3>
              <button
                onClick={resetHarmonics}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Restablecer
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* T Slider */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-fuchsia-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-fuchsia-300">Operador T (Tiempo)</span>
                  <span className="font-mono text-fuchsia-400 font-bold">{operatorWeights.t.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.1"
                  value={operatorWeights.t}
                  onChange={(e) => handleOperatorWeightChange('t', parseFloat(e.target.value))}
                  className="w-full accent-fuchsia-500 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">Recarga de habilidades y velocidad de giro</div>
              </div>

              {/* O Slider */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-cyan-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-300">Operador O (Óptica)</span>
                  <span className="font-mono text-cyan-400 font-bold">{operatorWeights.o.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.1"
                  value={operatorWeights.o}
                  onChange={(e) => handleOperatorWeightChange('o', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">Penetración de daño crítico y frecuencia zen</div>
              </div>

              {/* F Slider */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-amber-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-amber-300">Operador F (Fuerza)</span>
                  <span className="font-mono text-amber-400 font-bold">{operatorWeights.f.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.1"
                  value={operatorWeights.f}
                  onChange={(e) => handleOperatorWeightChange('f', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400">Radio de tracción del vórtice y barrera física</div>
              </div>
            </div>
          </div>

          {/* 5. The 6 Harmonic Layers (L1..L6) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              CAPAS DEL VÓRTICE (L = 1..6) · SUMATORIA PONDERADA Σ w_L
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {layers.map((layer) => (
                <div
                  key={layer.index}
                  className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-center space-y-1.5"
                >
                  <div className="text-base">{layer.symbol}</div>
                  <div className="text-xs font-bold text-slate-300 truncate">{layer.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">f: {layer.frequency.toFixed(2)}</div>
                  <div className="flex items-center justify-center gap-1 font-mono text-xs font-bold text-cyan-400">
                    <span>w:</span>
                    <span>{layer.weight.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-center gap-1 pt-1">
                    <button
                      onClick={() => handleLayerWeightChange(layer.index, layer.weight - 0.2)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleLayerWeightChange(layer.index, layer.weight + 0.2)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Live Calculation & Gameplay Buffs */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-cyan-500/40 shadow-lg space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  SÍNTESIS DE RESONANCIA N_Ω
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-fuchsia-300 font-mono">
                    {liveResult.resonanceScore}%
                  </span>
                  <span
                    className="px-2 py-0.5 text-xs rounded-full font-bold uppercase"
                    style={{
                      backgroundColor: `${liveResult.auraColorHex}22`,
                      color: liveResult.auraColorHex,
                      border: `1px solid ${liveResult.auraColorHex}66`
                    }}
                  >
                    MODO {liveResult.dominantOperator}
                  </span>
                </div>
              </div>

              {/* Instant Activation Button */}
              <button
                onClick={() => {
                  onApplyResonance(liveResult);
                  onTriggerVortex();
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${liveResult.auraColorHex}, #0284c7)`,
                  color: '#ffffff'
                }}
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                SINCRONIZAR VÓRTICE [TECLA V]
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div className="p-2 rounded bg-slate-950/50">
                <div className="text-slate-400">Daño Multiplicador</div>
                <div className="text-emerald-400 font-bold text-sm font-mono">
                  +{( (liveResult.damageMultiplier * quantumBuff.buffAtk - 1.0) * 100 ).toFixed(0)}%
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/50">
                <div className="text-slate-400">Reducción Recarga</div>
                <div className="text-cyan-400 font-bold text-sm font-mono">
                  -{(liveResult.cooldownReduction * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/50">
                <div className="text-slate-400">Tasa Crítica Extra</div>
                <div className="text-fuchsia-400 font-bold text-sm font-mono">
                  +{(liveResult.critRateBonus * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-2 rounded bg-slate-950/50">
                <div className="text-slate-400">Radio Vórtice 3D</div>
                <div className="text-amber-400 font-bold text-sm font-mono">
                  {liveResult.vortexPullRadius.toFixed(1)}m
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="truncate">Vector ΨΩ [3, 6, 9, 5] activo en el bucle de renderizado</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Cerrar [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
