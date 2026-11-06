import React, { useState } from 'react';
import { X, BookOpen, Sparkles, Shield, Zap, Flame, Compass, Volume2, Globe } from 'lucide-react';

interface ManualNexxKoniModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayUvaFrequency?: () => void;
}

export const ManualNexxKoniModal: React.FC<ManualNexxKoniModalProps> = ({
  isOpen,
  onClose,
  onPlayUvaFrequency
}) => {
  const [activeChapter, setActiveChapter] = useState<'intro' | 'vortex' | 'wolves' | 'klein' | 'skills'>('intro');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-950/95 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.35)] overflow-hidden font-sans text-white">
        
        {/* Book Header Spine */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-cyan-400 to-fuchsia-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-amber-900/50 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-950 via-slate-900 to-black border border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
              <BookOpen className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl font-black font-cinzel tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-cyan-200 to-fuchsia-200">
                  MANUAL NEXX KONI v9.2
                </h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                  TOMO ANCESTRAL
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-mono">
                Secretos del Vórtice 3-6-9-5 • Frecuencia 9.5 Hz • Botella de Klein • Guía de Combate
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

        {/* Chapter Navigation Tabs */}
        <div className="px-4 sm:px-6 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          {[
            { id: 'intro', label: '📖 Introducción', title: 'Fundamentos' },
            { id: 'vortex', label: '⚛️ Vórtice 3-6-9-5', title: 'Frecuencia 9.5 Hz' },
            { id: 'wolves', label: '🐺 Paquete 3 Lobos', title: 'Compañeros de Batalla' },
            { id: 'klein', label: '🧪 Botella de Klein', title: 'Artefacto Cuatridimensional' },
            { id: 'skills', label: '⚡ Habilidades Cuánticas', title: 'Forja, Verifica, Acelera' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChapter(tab.id as typeof activeChapter)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                activeChapter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chapter Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm leading-relaxed">
          {activeChapter === 'intro' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 space-y-2">
                <h3 className="text-base font-bold font-cinzel text-amber-300">
                  ✦ El Despertar de Nexx Koni y los Mundos Habitables
                </h3>
                <p className="text-xs text-slate-300">
                  En el año 2050, el tejido entre los mundos de MU Online, la Red Hyrule y el abismo de Solo Leveling colapsó en una única superposición cuántica. La elfa guerrera <strong className="text-fuchsia-300">Nexx Koni</strong>, asistida por el <strong className="text-amber-300">Escarabajo Dorado</strong> y la manada sagrada de los <strong className="text-cyan-300">Tres Lobos</strong>, sostiene la estabilidad de los tres mundos habitables:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-cyan-800/40 text-cyan-300">
                    ❄️ <strong>Tundra de Cristal:</strong> Reino glaciar de hielo azul y lobos árticos.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-amber-800/40 text-amber-300">
                    ☀️ <strong>Desierto Dorado:</strong> Castillos y pirámides sagradas de Ra.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-fuchsia-800/40 text-fuchsia-300">
                    🌋 <strong>Yermo Volcánico:</strong> Forja de magma rojo y basalto púrpura.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'vortex' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-fuchsia-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-cinzel text-fuchsia-300">
                    ⚛️ Vector Fundamental ΨΩ: [3, 6, 9, 5]
                  </h3>
                  <button
                    onClick={() => onPlayUvaFrequency && onPlayUvaFrequency()}
                    className="px-2.5 py-1 rounded bg-purple-900/80 hover:bg-purple-800 text-xs font-mono text-purple-200 flex items-center gap-1 border border-purple-500/40"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Sintetizar 9.5 Hz</span>
                  </button>
                </div>
                <p className="text-xs text-slate-300">
                  La realidad no colapsa en una sola perspectiva. Los números 3, 6, 9 y 5 forman el eje inmutable del toroide cósmico:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                    [3] ORIGEN (369 Hz)<br /><span className="text-[10px] text-slate-400">Semilla inmóvil</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                    [6] CICLO (432 Hz)<br /><span className="text-[10px] text-slate-400">Flujo continuo</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-fuchsia-300">
                    [9] TOTALIDAD (528 Hz)<br /><span className="text-[10px] text-slate-400">Integración total</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    [5] PRESENCIA (639 Hz)<br /><span className="text-[10px] text-slate-400">Aquí y ahora</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'wolves' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3">
                <h3 className="text-base font-bold font-cinzel text-cyan-300">
                  🐺 Paquete de los Tres Lobos Guardas
                </h3>
                <p className="text-xs text-slate-300">
                  Los tres lobos celestiales patrullan y flanquean a Nexx Koni en tiempo real durante el combate en mundo abierto:
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <strong className="text-white">Lobo Blanco Escudo:</strong> Flanquea la izquierda, bloquea proyectiles enemigos y absorbe el 35% del daño recibido.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <strong className="text-amber-300">Lobo Blanco Alfa Hub:</strong> Avanza en vanguardia con mordisco crítico de alta velocidad y aturdimiento.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <strong className="text-fuchsia-400">Lobo Púrpura Oráculo:</strong> Guarda la retaguardia lanzando proyectiles de energía del vacío y aplicando debuffs.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChapter === 'klein' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/30 space-y-3">
                <h3 className="text-base font-bold font-cinzel text-purple-300">
                  🧪 La Botella de Klein (Superficie Cuatridimensional)
                </h3>
                <p className="text-xs text-slate-300">
                  La <strong>Botella de Klein</strong> es una superficie no orientable sin interior ni exterior. En combate, beber de su esencia transdimensional:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-mono">
                  <li>Restaura el 100% de la barra de Vida (HP) y Maná (MP).</li>
                  <li>Dispara una onda expansiva de colapso cuántico a 9.5 Hz que repele a los enemigos cercanos.</li>
                  <li>Activa 8 segundos de inmunidad a estados alterados.</li>
                </ul>
              </div>
            </div>
          )}

          {activeChapter === 'skills' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
                <h3 className="text-base font-bold font-cinzel text-emerald-300">
                  ⚡ Las Cuatro Habilidades Centrales del HUD
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-amber-400 flex items-center gap-1">🔨 FORJA:</strong>
                    <span className="text-slate-400 text-[11px] block mt-1">Mejora y sintoniza el filo de la espada con runas de Lorencia. Aumenta el ataque en +15%.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-cyan-400 flex items-center gap-1">☑️ VERIFICA:</strong>
                    <span className="text-slate-400 text-[11px] block mt-1">Escudo divino de verificación que analiza las debilidades del objetivo seleccionado y otorga resistencia temporal.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-emerald-400 flex items-center gap-1">⚡ ACELERA:</strong>
                    <span className="text-slate-400 text-[11px] block mt-1">Sprint vorticial instantáneo que incrementa la velocidad de movimiento un +60% y esquiva impactos.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <strong className="text-fuchsia-400 flex items-center gap-1">🔮 MATERIALIZA:</strong>
                    <span className="text-slate-400 text-[11px] block mt-1">Invoca picos de cristal o materializa sombras vivas para atacar al objetivo con daño en área.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-amber-900/50 bg-slate-900/90 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Manual Nexx Koni • Edición Sagrada v9.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Cerrar [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
