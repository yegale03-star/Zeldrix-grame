import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Shield,
  Sword,
  Sparkles,
  Trophy,
  BookOpen,
  Backpack,
  Compass,
  Crosshair,
  Volume2,
  VolumeX,
  Zap,
  Flame,
  Search,
  CheckCircle2,
  RotateCcw,
  Heart,
  Droplets,
  X,
  Terminal,
  Camera,
  Maximize2,
  Ghost,
  Crown,
  Activity,
  Award,
  Plus
} from 'lucide-react';
import {
  BESTIARY_DATA,
  INITIAL_ACHIEVEMENTS,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_SYSTEM_ATTRIBUTES,
  INITIAL_SYSTEM_SKILLS,
  INITIAL_SHADOW_SOLDIERS,
  INITIAL_DAILY_QUEST,
  Achievement,
  InventoryItem,
  EnemyCategory,
  AchievementCategory,
  ShadowSoldier,
  FallenShadowVortex,
  SystemAttributes,
  SystemDailyQuest,
  SystemSkill,
  PlayerArchetype,
  ARCHETYPES,
  determineEnemyShadowRank,
  calculateShadowCapacity,
  calculateExtractionChance,
  evaluateAchievements,
  calculateCombatDamage,
  calculateLevelAndXp,
  formatNumber,
  R18_SKINS,
  R18Skin,
  calculateMovementSpeed,
  TORLAN_MAP_CONFIG,
  WorldLootDrop,
  LEGENDARY_LOOT_CATALOG,
  getRarityVisuals,
  rollLootDrop,
  NexusOmegaResult,
  DEFAULT_NEXUS_LAYERS,
  computeNexusStateVector,
  calculateNexusOmegaResonance,
  HabitableWorld,
  HABITABLE_WORLDS
} from './game/logic';
import {
  createCobblestoneTexture,
  createCobblestoneBumpMap,
  createRunicPillarTexture,
  createShieldTexture,
  createSkyDomeTexture
} from './game/textures';
import { UltraVfxManager } from './game/vfx';
import { SystemHologramModal } from './game/SystemHologramModal';
import { ShadowExtractionPrompt } from './game/ShadowExtractionPrompt';
import { ArchetypeSelectorModal } from './game/ArchetypeSelectorModal';
import { R18PanelModal } from './game/R18PanelModal';
import { NexusOmegaModal } from './game/NexusOmegaModal';
import { WorldSelectorModal } from './game/WorldSelectorModal';
import { ManualNexxKoniModal } from './game/ManualNexxKoniModal';

// Web Audio sound synthesizer with MU 3D Nexus, Solo Leveling, and mobile haptics
class GameAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  public unlock() {
    this.init();
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private triggerHaptic(duration = 25) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch {
        // Ignore vibration errors if blocked by browser policy
      }
    }
  }

  playSwordSlash() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(20);
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  playHit() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(40);
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.21);
  }

  playTwistingSlash() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(50);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.32);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.33);
  }

  playFanfare() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(60);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.26);
    });
  }

  playBombExplode() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(70);
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  playHeal() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(25);
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.31);
  }

  playSystemChime() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(30);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [1046.5, 1567.98].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.23);
    });
  }

  playAriseChant() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(65);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.45);
    subGain.gain.setValueAtTime(0.35, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.5);

    const hOsc = this.ctx.createOscillator();
    const hGain = this.ctx.createGain();
    hOsc.type = 'sine';
    hOsc.frequency.setValueAtTime(330, now + 0.1);
    hOsc.frequency.exponentialRampToValueAtTime(660, now + 0.45);
    hGain.gain.setValueAtTime(0.2, now + 0.1);
    hGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    hOsc.connect(hGain);
    hGain.connect(this.ctx.destination);
    hOsc.start(now + 0.1);
    hOsc.stop(now + 0.52);
  }

  playExtractionSuccess() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(80);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.22, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.36);
    });
  }

  playExtractionFailed() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(50);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  playStatPointUp() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(20);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now);
    osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.12);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playJewelDropSound() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(75);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Classic MU Online Jewel of Bless / Soul ring sound:
    // Pure high-frequency crystalline chime with shimmering overtones
    const frequencies = [2093.0, 3135.96, 4186.01, 5587.65];
    frequencies.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.035);
      gain.gain.setValueAtTime(0.24, now + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.035 + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.035);
      osc.stop(now + idx * 0.035 + 0.68);
    });
  }

  playItemPickupSound() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(30);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playLegendaryDropFanfare() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(85);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chords = [440, 554.37, 659.25, 880, 1108.73];
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.58);
    });
  }

  playNexusOmegaChord() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(90);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Resonant Triad for Operators: F (144Hz), O (432Hz Solfeggio), T (864Hz & 1296Hz)
    const triad = [144, 432, 864, 1296];
    triad.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.4);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.78);
    });
  }

  playQuantumFrequency(freq: number = 432.0) {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(40);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.58);
  }

  playUvaFrequency9_5Hz() {
    if (!this.enabled) return;
    this.init();
    this.triggerHaptic(80);
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 432Hz Carrier Wave
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(432.0, now);

    // 9.5Hz Uva Modulator (LFO)
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(9.5, now);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.5, now);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.3, now);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    lfo.connect(lfoGain);
    carrier.connect(mainGain);
    mainGain.connect(this.ctx.destination);

    carrier.start(now);
    carrier.stop(now + 1.25);
    lfo.start(now);
    lfo.stop(now + 1.25);
  }
}

const audioSystem = new GameAudio();

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Player Stats
  const [hp, setHp] = useState<number>(100);
  const [maxHp, setMaxHp] = useState<number>(100);
  const [mana, setMana] = useState<number>(100);
  const [maxMana, setMaxMana] = useState<number>(100);
  const [rupees, setRupees] = useState<number>(85);
  const [totalXp, setTotalXp] = useState<number>(120);
  const [currentSector, setCurrentSector] = useState<string>('Tundra de Cristal · Valle de los Lobos');

  // NEXX KONI v9.2 Archetype, World & Companion State
  const [currentArchetype, setCurrentArchetype] = useState<PlayerArchetype>('nexx_koni');
  const [isWorldModalOpen, setIsWorldModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [currentWorldId, setCurrentWorldId] = useState<string>('tundra_cristal');
  const [wolfPackActive, setWolfPackActive] = useState<boolean>(true);
  const [wolfPackMode, setWolfPackMode] = useState<'flank' | 'attack' | 'guard'>('flank');
  const [activeSkillBuffs, setActiveSkillBuffs] = useState<{
    forja: boolean;
    verifica: boolean;
    acelera: boolean;
    materializa: boolean;
  }>({ forja: false, verifica: false, acelera: false, materializa: false });
  const [selectedEnemyForHud, setSelectedEnemyForHud] = useState<{
    name: string;
    hp: number;
    maxHp: number;
    dist: number;
    weakness: string;
  } | null>(null);

  // Solo Leveling System State
  const [systemAttrs, setSystemAttrs] = useState<SystemAttributes>(INITIAL_SYSTEM_ATTRIBUTES);
  const [dailyQuest, setDailyQuest] = useState<SystemDailyQuest>(INITIAL_DAILY_QUEST);
  const [systemSkills, setSystemSkills] = useState<SystemSkill[]>(INITIAL_SYSTEM_SKILLS);
  const [shadowSoldiers, setShadowSoldiers] = useState<ShadowSoldier[]>(INITIAL_SHADOW_SOLDIERS);
  const [shadowsSummoned, setShadowsSummoned] = useState<boolean>(true);
  const [monarchDomainActive, setMonarchDomainActive] = useState<boolean>(false);
  const [fallenShadows, setFallenShadows] = useState<FallenShadowVortex[]>([
    {
      id: 'vortex_tutorial',
      enemyType: 'sombra',
      enemyName: 'Sombra Residual del Abismo',
      position: { x: -3.5, y: 0.1, z: -8.0 },
      expiresAt: Date.now() + 180000,
      attemptsRemaining: 3,
      rank: 'soldier',
      manaCost: 15,
      icon: '👤',
      color: '#818cf8'
    }
  ]);
  const [activeVortexNearPlayer, setActiveVortexNearPlayer] = useState<FallenShadowVortex | null>(null);

  // Legendary Loot & World Drops State (MU Light Beams & Jewels)
  const [worldLootDrops, setWorldLootDrops] = useState<WorldLootDrop[]>([
    {
      id: 'tutorial_bless',
      item: LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless')!,
      position: { x: 3.5, y: 0.05, z: -6.0 },
      rarity: 'legendary',
      beamHeight: 8.5,
      beamColor: 0xfbbf24,
      hexColor: '#fbbf24',
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000,
      isJewel: true
    }
  ]);
  const [nearbyLoot, setNearbyLoot] = useState<WorldLootDrop | null>(null);
  const activeNearbyLootRef = useRef<WorldLootDrop | null>(null);
  const [legendaryBanner, setLegendaryBanner] = useState<{ title: string; item: InventoryItem } | null>(null);

  // Combat Targeting & State
  const [isZTargeting, setIsZTargeting] = useState<boolean>(false);
  const [targetEnemyName, setTargetEnemyName] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);

  // Mobile Virtual Joystick State
  const [joystickActive, setJoystickActive] = useState<boolean>(false);
  const [joystickKnob, setJoystickKnob] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const joystickTouchIdRef = useRef<number | null>(null);
  const joystickOriginRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mobile Screen Touch Look-Around
  const cameraTouchRef = useRef<{ id: number; lastX: number; lastY: number } | null>(null);

  // Cinematic & Expansive Camera State
  const [cameraZoom, setCameraZoom] = useState<number>(14.5);
  const cameraZoomRef = useRef<number>(14.5);
  const [isCinematicView, setIsCinematicView] = useState<boolean>(false);
  const vfxRef = useRef<UltraVfxManager | null>(null);

  // Sync zoom ref
  useEffect(() => {
    cameraZoomRef.current = cameraZoom;
  }, [cameraZoom]);

  // Adaptive Panoramic Viewport State (Phone Panoramic Landscape vs PC Normal)
  const [viewportMode, setViewportMode] = useState<{
    isMobile: boolean;
    isLandscape: boolean;
    isPanoramic: boolean;
  }>({
    isMobile: false,
    isLandscape: true,
    isPanoramic: false
  });
  const [showRotatePrompt, setShowRotatePrompt] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isMobile = isTouch || (width < 1024 && width < height);
      const isLandscape = width > height;
      const isPanoramic = isMobile && isLandscape;

      setViewportMode({ isMobile, isLandscape, isPanoramic });

      if (gameRef.current?.camera && gameRef.current?.renderer) {
        if (isPanoramic) {
          gameRef.current.camera.fov = 76; // Ultra-wide cinematic panoramic perspective for cell landscape
        } else if (isMobile && !isLandscape) {
          gameRef.current.camera.fov = 65; // Mobile portrait
        } else {
          gameRef.current.camera.fov = 68; // Normal PC desktop view
        }
        gameRef.current.camera.aspect = width / height;
        gameRef.current.camera.updateProjectionMatrix();
        gameRef.current.renderer.setSize(width, height);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    if ('screen' in window && 'orientation' in window.screen) {
      window.screen.orientation?.addEventListener('change', updateViewport);
    }
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      if ('screen' in window && 'orientation' in window.screen) {
        window.screen.orientation?.removeEventListener('change', updateViewport);
      }
    };
  }, []);

  // Modals & Menu State
  const [activeMenuTab, setActiveMenuTab] = useState<
    'inventory' | 'bestiary' | 'achievements' | 'cheats' | 'system' | 'class' | 'r18' | null
  >(null);

  // 🌀 Nexus Omega N_Ω Matrix State (T ∘ O ∘ F |Ψ_Ω⟩)
  const [isNexusModalOpen, setIsNexusModalOpen] = useState<boolean>(false);
  const [nexusResult, setNexusResult] = useState<NexusOmegaResult>(() => {
    const initialVec = computeNexusStateVector(100, 100, 100, 100, 4, 10, 0);
    return calculateNexusOmegaResonance(DEFAULT_NEXUS_LAYERS, initialVec);
  });

  // MU 3D Nexus R18 Evolution State
  const [currentR18Skin, setCurrentR18Skin] = useState<string>('venom');
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const r18MountedRef = useRef<boolean>(false);
  const r18SkinDataRef = useRef<R18Skin>(R18_SKINS[0]);
  const mountMeshRef = useRef<THREE.Group | null>(null);
  const playerBodyMeshRef = useRef<THREE.Mesh | null>(null);

  // Achievements State
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [unlockedBanner, setUnlockedBanner] = useState<Achievement | null>(null);
  const [achievementFilter, setAchievementFilter] = useState<'all' | AchievementCategory>('all');

  // Inventory State (16-Slot Quantum Backpack)
  const [backpackSlots, setBackpackSlots] = useState<(InventoryItem | null)[]>(() => {
    const slots: (InventoryItem | null)[] = new Array(16).fill(null);
    INITIAL_INVENTORY_ITEMS.forEach((item, idx) => {
      if (idx < 16) slots[idx] = { ...item };
    });
    return slots;
  });

  // Equipment slots
  const [equippedWeapon, setEquippedWeapon] = useState<InventoryItem | null>(() => {
    const w = INITIAL_INVENTORY_ITEMS.find((i) => i.id === 'kokiri_blade');
    return w ? { ...w } : null;
  });
  const [equippedShield, setEquippedShield] = useState<InventoryItem | null>(() => {
    const s = INITIAL_INVENTORY_ITEMS.find((i) => i.id === 'deku_shield');
    return s ? { ...s } : null;
  });
  const [equippedRelic, setEquippedRelic] = useState<InventoryItem | null>(null);

  // Selected item in inspector
  const [selectedItem, setSelectedItem] = useState<{
    item: InventoryItem;
    source: 'backpack' | 'equipment';
    slotIndex?: number;
    equipType?: 'weapon' | 'shield' | 'relic';
  } | null>(null);

  // Drag and drop state for desktop
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Bestiary & Kills State
  const [killStats, setKillStats] = useState<Record<string, number>>({
    sombra: 4,
    drone: 2,
    keese: 1,
    stalchild: 0,
    stalker: 1,
    lizalfos: 0,
    gohma: 0,
    ganon: 0,
    mu_goblin: 0,
    mu_warrior: 0
  });
  const [bestiaryFilter, setBestiaryFilter] = useState<'all' | EnemyCategory>('all');
  const [bestiarySearch, setBestiarySearch] = useState<string>('');

  // Discovered sectors
  const [discoveredSectors, setDiscoveredSectors] = useState<Set<string>>(
    () => new Set(['KokiriVillage'])
  );

  // Floating battle alert message
  const [combatAlert, setCombatAlert] = useState<string | null>(
    '⚔️ ¡MU 3D Nexus R21 Activado! Bienvenido Dark Knight al combate híbrido.'
  );

  // Refs for animation loop and Three.js
  const distanceAccumulatorRef = useRef<number>(0);
  const lastPlayerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const fallenShadowsRef = useRef<FallenShadowVortex[]>([]);
  const shadowSoldiersRef = useRef<ShadowSoldier[]>(INITIAL_SHADOW_SOLDIERS);
  const shadowsSummonedRef = useRef<boolean>(true);
  const monarchDomainActiveRef = useRef<boolean>(false);

  useEffect(() => {
    fallenShadowsRef.current = fallenShadows;
  }, [fallenShadows]);

  useEffect(() => {
    shadowSoldiersRef.current = shadowSoldiers;
  }, [shadowSoldiers]);

  useEffect(() => {
    shadowsSummonedRef.current = shadowsSummoned;
  }, [shadowsSummoned]);

  useEffect(() => {
    monarchDomainActiveRef.current = monarchDomainActive;
  }, [monarchDomainActive]);

  // Three.js game engine reference
  const gameRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    player: THREE.Group;
    swordMesh: THREE.Mesh | THREE.Group;
    shieldMesh: THREE.Mesh;
    monarchDomainMesh: THREE.Mesh;
    enemies: {
      id: string;
      group: THREE.Group;
      boundingBox: THREE.Box3;
      type: string;
      hp: number;
      maxHp: number;
      name: string;
      speed: number;
      dmg: number;
      weakness: string;
    }[];
    shadowSoldierMeshes: {
      id: string;
      group: THREE.Group;
      soldierData: ShadowSoldier;
      attackTimer: number;
    }[];
    vortexMeshes: {
      id: string;
      group: THREE.Group;
    }[];
    lootMeshes: {
      id: string;
      group: THREE.Group;
      beamMesh: THREE.Mesh;
      coreBeamMesh: THREE.Mesh;
      itemMesh: THREE.Group;
      auraRing: THREE.Mesh;
      dropData: WorldLootDrop;
    }[];
    particles: THREE.Points;
    keys: Record<string, boolean>;
    joystickVec: { x: number; y: number };
    isSprinting: boolean;
    cameraYaw: number;
    cameraPitch: number;
    isRolling: boolean;
    rollTimer: number;
    rollVec: THREE.Vector3;
    isAttacking: boolean;
    isBlocking: boolean;
    targetEnemyId: string | null;
    wolfShieldMesh?: THREE.Group;
    wolfAlphaMesh?: THREE.Group;
    wolfOracleMesh?: THREE.Group;
    tesseractGroup?: THREE.Group;
    manualBookGroup?: THREE.Group;
    scarabGroup?: THREE.Group;
    wingLeft?: THREE.Mesh;
    wingRight?: THREE.Mesh;
  } | null>(null);

  // Trigger achievement unlock banner and sound
  const triggerAchievementBanner = (achievement: Achievement) => {
    setUnlockedBanner(achievement);
    audioSystem.playFanfare();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.15 }
    });
    setTimeout(() => {
      setUnlockedBanner((prev) => (prev?.id === achievement.id ? null : prev));
    }, 5000);
  };

  // Evaluate achievements progression
  const checkAchievementsProgress = (customKillOverride?: Record<string, number>) => {
    const currentKills = customKillOverride || killStats;
    const totalKills = Object.values(currentKills).reduce((a, b) => a + b, 0);
    const { level } = calculateLevelAndXp(totalXp);
    const hasSword = !!equippedWeapon;
    const hasShield = !!equippedShield;
    const hasRelic = !!equippedRelic;
    const hasEquippedAllSlots = hasSword && hasShield && hasRelic;
    const discoveredCount = discoveredSectors.size;
    const allLevelsDiscovered = discoveredCount >= 5;
    const gohmaDefeated = (currentKills['gohma'] || 0) > 0;
    const hyruleUnlocked = discoveredSectors.has('HyrulePlain');

    const result = evaluateAchievements(achievements, {
      hasStarted: true,
      hasSword,
      hasShield,
      hasRelic,
      kills: totalKills,
      gohmaDefeated,
      hyruleUnlocked,
      allLevelsDiscovered,
      discoveredCount,
      totalKills,
      playerLevel: level,
      hasEquippedAllSlots
    });

    setAchievements(result.updated);
    if (result.newlyUnlocked.length > 0) {
      triggerAchievementBanner(result.newlyUnlocked[0]);
    }
  };

  // Sync sounds & unlock on first touch
  useEffect(() => {
    audioSystem.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      audioSystem.unlock();
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  // Sync Sprint with Ref
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.isSprinting = isSprinting;
    }
  }, [isSprinting]);

  // Recalculate max HP and Max Mana based on System stats & Archetype
  useEffect(() => {
    const arch = ARCHETYPES.find((a) => a.id === currentArchetype);
    const defBonus = arch ? arch.bonusDef : 0;
    const newMaxHp = 100 + (systemAttrs.vitality - 10) * 10 + defBonus * 2;
    const newMaxMana = 100 + (systemAttrs.intelligence - 15) * 8;
    setMaxHp(newMaxHp);
    setMaxMana(newMaxMana);
  }, [systemAttrs.vitality, systemAttrs.intelligence, currentArchetype]);

  // 3D Shadow Soldier Mesh Builder
  const create3DShadowSoldier = (soldier: ShadowSoldier): THREE.Group => {
    const group = new THREE.Group();

    // Dark ethereal body
    const bodyGeo = new THREE.CylinderGeometry(0.28, 0.45, 1.4, 8);
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x070b19,
      roughness: 0.3,
      metalness: 0.8,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.4
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, darkMat);
    bodyMesh.position.y = 0.7;
    group.add(bodyMesh);

    // Helmet with crest
    const headGeo = new THREE.BoxGeometry(0.38, 0.42, 0.38);
    const headMesh = new THREE.Mesh(headGeo, darkMat);
    headMesh.position.y = 1.55;
    group.add(headMesh);

    // Glowing Neon Eyes (Solo Leveling signature eye glow)
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.04, 0.06);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.09, 1.58, 0.2);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.09, 1.58, 0.2);
    group.add(leftEye);
    group.add(rightEye);

    // Spectral Plume on helmet
    const plumeGeo = new THREE.ConeGeometry(0.12, 0.65, 6);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: soldier.color === '#f43f5e' ? 0xef4444 : 0x38bdf8,
      transparent: true,
      opacity: 0.85
    });
    const plume = new THREE.Mesh(plumeGeo, plumeMat);
    plume.position.set(0, 1.95, -0.08);
    plume.rotation.x = -Math.PI / 4;
    group.add(plume);

    // Weapon
    const weaponGeo = new THREE.BoxGeometry(0.07, 1.25, 0.14);
    const weaponMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8
    });
    const weaponMesh = new THREE.Mesh(weaponGeo, weaponMat);
    weaponMesh.position.set(0.5, 0.8, 0.2);
    weaponMesh.rotation.x = Math.PI / 6;
    group.add(weaponMesh);

    // Ground shadow aura
    const mistGeo = new THREE.RingGeometry(0.1, 0.65, 12);
    const mistMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6
    });
    const mistMesh = new THREE.Mesh(mistGeo, mistMat);
    mistMesh.rotation.x = -Math.PI / 2;
    mistMesh.position.y = 0.05;
    group.add(mistMesh);

    return group;
  };

  // 3D Fallen Shadow Vortex Mesh Builder
  const create3DFallenVortex = (vortex: FallenShadowVortex): THREE.Group => {
    const group = new THREE.Group();
    group.position.set(vortex.position.x, 0.05, vortex.position.z);

    const ringGeo = new THREE.RingGeometry(0.4, 2.0, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);

    const coreGeo = new THREE.CircleGeometry(0.65, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      side: THREE.DoubleSide
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.rotation.x = -Math.PI / 2;
    core.position.y = 0.02;
    group.add(core);

    const pillarGeo = new THREE.CylinderGeometry(0.15, 0.8, 2.4, 8, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 1.2;
    group.add(pillar);

    return group;
  };

  // Synchronize 3D Shadow Soldier Meshes
  useEffect(() => {
    if (!gameRef.current) return;
    const { scene, shadowSoldierMeshes, player } = gameRef.current;

    const currentIds = new Set(shadowSoldiers.map((s) => s.id));
    for (let i = shadowSoldierMeshes.length - 1; i >= 0; i--) {
      const sm = shadowSoldierMeshes[i];
      if (!currentIds.has(sm.id)) {
        scene.remove(sm.group);
        shadowSoldierMeshes.splice(i, 1);
      }
    }

    shadowSoldiers.forEach((soldier, idx) => {
      let existing = shadowSoldierMeshes.find((m) => m.id === soldier.id);
      if (!existing) {
        const group = create3DShadowSoldier(soldier);
        group.position.set(
          player.position.x + (idx % 2 === 0 ? -2 : 2),
          0,
          player.position.z + 2 + Math.floor(idx / 2) * 2
        );
        scene.add(group);
        shadowSoldierMeshes.push({
          id: soldier.id,
          group,
          soldierData: soldier,
          attackTimer: 0
        });
      } else {
        existing.soldierData = soldier;
      }
    });
  }, [shadowSoldiers]);

  // Synchronize 3D Vortexes
  useEffect(() => {
    if (!gameRef.current) return;
    const { scene, vortexMeshes } = gameRef.current;

    const currentIds = new Set(fallenShadows.map((v) => v.id));
    for (let i = vortexMeshes.length - 1; i >= 0; i--) {
      const vm = vortexMeshes[i];
      if (!currentIds.has(vm.id)) {
        scene.remove(vm.group);
        vortexMeshes.splice(i, 1);
      }
    }

    fallenShadows.forEach((vortex) => {
      let existing = vortexMeshes.find((m) => m.id === vortex.id);
      if (!existing) {
        const group = create3DFallenVortex(vortex);
        scene.add(group);
        vortexMeshes.push({ id: vortex.id, group });
      }
    });
  }, [fallenShadows]);

  // 3D LOOT DROP BUILDER (MU Light Beams & Legendary World Drops)
  const create3DLootDrop = (drop: WorldLootDrop) => {
    const group = new THREE.Group();
    group.position.set(drop.position.x, 0, drop.position.z);

    // 1. Vertical Outer Light Beam (Pilar de Luz)
    const beamGeo = new THREE.CylinderGeometry(0.18, 0.45, drop.beamHeight, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: drop.beamColor,
      transparent: true,
      opacity: drop.rarity === 'legendary' ? 0.65 : drop.rarity === 'epic' ? 0.5 : 0.35,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = drop.beamHeight / 2;
    group.add(beamMesh);

    // 2. High-intensity Core Light Beam (White center)
    const coreGeo = new THREE.CylinderGeometry(0.06, 0.12, drop.beamHeight, 8, 1, true);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coreBeamMesh = new THREE.Mesh(coreGeo, coreMat);
    coreBeamMesh.position.y = drop.beamHeight / 2;
    group.add(coreBeamMesh);

    // 3. Ground Light Ring & Aura
    const ringGeo = new THREE.RingGeometry(0.2, 0.9, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: drop.beamColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const auraRing = new THREE.Mesh(ringGeo, ringMat);
    auraRing.rotation.x = -Math.PI / 2;
    auraRing.position.y = 0.04;
    group.add(auraRing);

    // 4. Floating 3D Item Model
    const itemGroup = new THREE.Group();
    itemGroup.position.y = 0.9;

    if (drop.isJewel) {
      // Iconic Jewel Octahedron (MU Online Jewel of Bless / Soul)
      const gemGeo = new THREE.OctahedronGeometry(0.32, 0);
      const gemMat = new THREE.MeshStandardMaterial({
        color: drop.beamColor,
        metalness: 0.85,
        roughness: 0.15,
        emissive: drop.beamColor,
        emissiveIntensity: 1.8
      });
      const gemMesh = new THREE.Mesh(gemGeo, gemMat);
      gemMesh.castShadow = true;
      itemGroup.add(gemMesh);

      // Orbiting Sparkle Rings
      const orbitGeo = new THREE.TorusGeometry(0.48, 0.035, 8, 20);
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      const orbit1 = new THREE.Mesh(orbitGeo, orbitMat);
      orbit1.rotation.x = Math.PI / 3;
      itemGroup.add(orbit1);
    } else if (drop.item.type === 'weapon') {
      // Floating glowing weapon blade
      const bladeGeo = new THREE.BoxGeometry(0.12, 0.85, 0.06);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: drop.beamColor,
        metalness: 0.9,
        roughness: 0.2,
        emissive: drop.beamColor,
        emissiveIntensity: 1.2
      });
      const bladeMesh = new THREE.Mesh(bladeGeo, bladeMat);
      bladeMesh.rotation.z = Math.PI / 4;
      itemGroup.add(bladeMesh);

      const hiltGeo = new THREE.BoxGeometry(0.28, 0.06, 0.08);
      const hiltMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
      const hiltMesh = new THREE.Mesh(hiltGeo, hiltMat);
      hiltMesh.position.y = -0.35;
      itemGroup.add(hiltMesh);
    } else if (drop.item.type === 'shield') {
      const shieldGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 6);
      const shieldMat = new THREE.MeshStandardMaterial({
        color: drop.beamColor,
        metalness: 0.8,
        roughness: 0.25,
        emissive: drop.beamColor,
        emissiveIntensity: 1.0
      });
      const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
      shieldMesh.rotation.x = Math.PI / 2;
      itemGroup.add(shieldMesh);
    } else if (drop.item.type === 'zen') {
      // Golden coin stack / pouch
      const coinGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 16);
      const coinMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0xca8a04,
        emissiveIntensity: 1.2
      });
      const coinMesh = new THREE.Mesh(coinGeo, coinMat);
      itemGroup.add(coinMesh);
    } else {
      // Potion / Relic crystal
      const potGeo = new THREE.DodecahedronGeometry(0.28, 0);
      const potMat = new THREE.MeshStandardMaterial({
        color: drop.beamColor,
        metalness: 0.6,
        roughness: 0.2,
        emissive: drop.beamColor,
        emissiveIntensity: 1.0
      });
      const potMesh = new THREE.Mesh(potGeo, potMat);
      itemGroup.add(potMesh);
    }

    group.add(itemGroup);

    return {
      id: drop.id,
      group,
      beamMesh,
      coreBeamMesh,
      itemMesh: itemGroup,
      auraRing,
      dropData: drop
    };
  };

  // Synchronize 3D World Loot Drops
  useEffect(() => {
    if (!gameRef.current) return;
    const { scene, lootMeshes } = gameRef.current;

    const currentIds = new Set(worldLootDrops.map((d) => d.id));
    for (let i = lootMeshes.length - 1; i >= 0; i--) {
      const lm = lootMeshes[i];
      if (!currentIds.has(lm.id)) {
        scene.remove(lm.group);
        lootMeshes.splice(i, 1);
      }
    }

    worldLootDrops.forEach((drop) => {
      let existing = lootMeshes.find((m) => m.id === drop.id);
      if (!existing) {
        const dropMeshObj = create3DLootDrop(drop);
        scene.add(dropMeshObj.group);
        lootMeshes.push(dropMeshObj);
      }
    });
  }, [worldLootDrops]);

  // 3D CIBER CORCEL MODEL GENERATOR (MU 3D Nexus R18 — Hybrid Evolution)
  const createCiberCorcelModel = (): THREE.Group => {
    const mount = new THREE.Group();

    // Dark Carbon Titanium Chassis
    const bodyGeo = new THREE.BoxGeometry(0.85, 0.75, 1.45);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x161e2e,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x082f49,
      emissiveIntensity: 1.4
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    mount.add(body);

    // Neon Cyan Energy Strip
    const neonMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const neon = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 1.5), neonMat);
    neon.position.y = 1.05;
    mount.add(neon);

    // Mechanical Neck
    const neck = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.72, 0.46),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85 })
    );
    neck.position.set(0, 1.42, -0.7);
    neck.rotation.x = 0.45;
    mount.add(neck);

    // Head
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.38, 0.62),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 })
    );
    head.position.set(0, 1.72, -0.96);
    mount.add(head);

    // Glowing Cyan Eyes
    for (const side of [-0.17, 0.17]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), neonMat);
      eye.position.set(side, 1.78, -1.05);
      mount.add(eye);
    }

    // Fiery Cyan Plasma Mane (Ciber Corcel)
    const maneMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const mane = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.95), maneMat);
    mane.position.set(0, 1.68, -0.45);
    mane.rotation.x = 0.4;
    mount.add(mane);

    // 4 Mechanical Legs with glowing cyan hooves
    const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
    for (const x of [-0.34, 0.34]) {
      for (const z of [-0.5, 0.5]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.07, 0.72, 8), legMat);
        leg.position.set(x, 0.44, z);
        leg.castShadow = true;
        mount.add(leg);

        const hoof = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.22), neonMat);
        hoof.position.set(x, 0.06, z);
        mount.add(hoof);
      }
    }

    // Fiery Plasma Tail
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.85, 8), maneMat);
    tail.position.set(0, 1.08, 0.98);
    tail.rotation.x = 0.7;
    mount.add(tail);

    return mount;
  };

  // Toggle Ciber Corcel Mount
  const handleToggleMount = () => {
    if (!gameRef.current) return;
    const next = !r18MountedRef.current;
    setIsMounted(next);
    r18MountedRef.current = next;

    if (next) {
      if (!mountMeshRef.current) {
        mountMeshRef.current = createCiberCorcelModel();
      }
      gameRef.current.player.add(mountMeshRef.current);
      mountMeshRef.current.position.set(0, -0.15, 0);
      gameRef.current.player.position.y = 0.6;
      audioSystem.playFanfare();
      setCombatAlert('🏇 ¡Ciber Corcel Invocado! Velocidad +80% (R18 Hybrid Combat)');
      window.dispatchEvent(new CustomEvent('mu3d:r18-mount', { detail: { mounted: true, speedMultiplier: 1.8 } }));
    } else {
      if (mountMeshRef.current && mountMeshRef.current.parent) {
        mountMeshRef.current.parent.remove(mountMeshRef.current);
      }
      gameRef.current.player.position.y = 0;
      setCombatAlert('🏇 Ciber Corcel guardado en el establo dimensional.');
      window.dispatchEvent(new CustomEvent('mu3d:r18-mount', { detail: { mounted: false, speedMultiplier: 1.0 } }));
    }
  };

  // Select R18 Skin with live stats & material update
  const handleSelectR18Skin = (skin: R18Skin) => {
    setCurrentR18Skin(skin.id);
    r18SkinDataRef.current = skin;

    if (playerBodyMeshRef.current) {
      const mat = playerBodyMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color.setHex(skin.color);
        mat.needsUpdate = true;
      }
    }

    audioSystem.playStatPointUp();
    setCombatAlert(`⚔️ [R18 SKIN] ¡${skin.name} equipada! (${skin.desc})`);
    window.dispatchEvent(new CustomEvent('mu3d:r18-skin', { detail: { ...skin } }));
  };

  // Travel to Cañón Torlan
  const handleTravelTorlan = () => {
    if (!gameRef.current) return;
    setCurrentSector('Cañón Torlan (R18)');
    setDiscoveredSectors((prev) => new Set([...prev, 'TorlanCanyon']));

    gameRef.current.player.position.set(-35, r18MountedRef.current ? 0.6 : 0, -5);
    audioSystem.playSystemChime();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setCombatAlert('🌀 ¡Portal Dimensional Cruzado! Has entrado al Cañón Torlan (Tier Alto Lv.100+).');
    setActiveMenuTab(null);
    window.dispatchEvent(new CustomEvent('mu3d:r18-travel-torlan'));
  };

  // 🌍 Select Habitable World (NEX KONI v9.2)
  const handleSelectWorld = (world: HabitableWorld) => {
    setCurrentWorldId(world.id);
    setCurrentSector(world.sectorName);
    audioSystem.playSystemChime();
    confetti({ particleCount: 45, spread: 70, origin: { y: 0.5 } });
    setCombatAlert(`🌍 Teletransportación completada a: ${world.name}! Bioma cargado.`);
    setIsWorldModalOpen(false);

    if (gameRef.current) {
      const { scene, renderer, player } = gameRef.current;
      player.position.set(0, r18MountedRef.current ? 0.6 : 0, 0);
      if (scene.fog) {
        scene.fog.color.setHex(world.fogColor);
      }
      scene.background = new THREE.Color(world.skyColor);
      renderer.setClearColor(world.skyColor);
    }
  };

  // 🔨 Skill 1: FORJA (Weapon Tuning & +15% ATK)
  const handleSkillForja = () => {
    if (mana < 15) {
      setCombatAlert('❌ Maná insuficiente para Forja (requiere 15 MP).');
      return;
    }
    setMana((prev) => prev - 15);
    audioSystem.playStatPointUp();
    setActiveSkillBuffs((prev) => ({ ...prev, forja: true }));
    vfxRef.current?.spawnHitSparks(gameRef.current?.player.position || new THREE.Vector3(), true);
    setCombatAlert('🔨 ¡FORJA SAGRADA! Filo de espada templado con fuego celeste (+15% ATK por 15s).');
    setTimeout(() => {
      setActiveSkillBuffs((prev) => ({ ...prev, forja: false }));
    }, 15000);
  };

  // ☑️ Skill 2: VERIFICA (Divine Ward & Scanning)
  const handleSkillVerifica = () => {
    if (mana < 15) {
      setCombatAlert('❌ Maná insuficiente para Verifica (requiere 15 MP).');
      return;
    }
    setMana((prev) => prev - 15);
    audioSystem.playTwistingSlash();
    setActiveSkillBuffs((prev) => ({ ...prev, verifica: true }));
    setCombatAlert('☑️ ¡VERIFICACIÓN CUÁNTICA! Barrera protectora activa (+25% DEF por 12s).');
    setTimeout(() => {
      setActiveSkillBuffs((prev) => ({ ...prev, verifica: false }));
    }, 12000);
  };

  // ⚡ Skill 3: ACELERA (3-6-9 Vortex Sprint)
  const handleSkillAcelera = () => {
    if (mana < 10) {
      setCombatAlert('❌ Maná insuficiente para Acelera (requiere 10 MP).');
      return;
    }
    setMana((prev) => prev - 10);
    audioSystem.playQuantumFrequency(528);
    setActiveSkillBuffs((prev) => ({ ...prev, acelera: true }));
    setCombatAlert('⚡ ¡ACELERACIÓN 3-6-9! Sprint vorticial hiperbólico activo (+60% Velocidad por 8s).');
    setTimeout(() => {
      setActiveSkillBuffs((prev) => ({ ...prev, acelera: false }));
    }, 8000);
  };

  // 🔮 Skill 4: MATERIALIZA (Summon Astral Spikes / Shadows)
  const handleSkillMaterializa = () => {
    if (mana < 25) {
      setCombatAlert('❌ Maná insuficiente para Materializa (requiere 25 MP).');
      return;
    }
    setMana((prev) => prev - 25);
    audioSystem.playUvaFrequency9_5Hz();
    if (gameRef.current) {
      const pPos = gameRef.current.player.position;
      let hit = 0;
      gameRef.current.enemies.forEach((enemy) => {
        if (enemy.hp > 0 && enemy.group.position.distanceTo(pPos) < 9.0) {
          enemy.hp -= 58;
          hit++;
          vfxRef.current?.spawnHitSparks(enemy.group.position, true);
          if (enemy.hp <= 0) handleEnemyDefeated(enemy);
        }
      });
      setCombatAlert(
        hit > 0
          ? `🔮 ¡MATERIALIZACIÓN ASTRAL! Picos de cristal y sombras golpearon a ${hit} enemigos (-58 HP).`
          : '🔮 ¡MATERIALIZACIÓN ASTRAL! Picos de cristal desatados en radio de 9 metros.'
      );
    }
  };

  // 🧪 Quick Use: Botella de Klein
  const handleUseBotellaDeKlein = () => {
    setHp(maxHp);
    setMana(maxMana);
    audioSystem.playUvaFrequency9_5Hz();
    audioSystem.playHeal();
    if (gameRef.current) {
      const pPos = gameRef.current.player.position;
      gameRef.current.enemies.forEach((enemy) => {
        if (enemy.hp > 0 && enemy.group.position.distanceTo(pPos) < 8.0) {
          const kb = new THREE.Vector3().subVectors(enemy.group.position, pPos).normalize();
          enemy.group.position.addScaledVector(kb, 4.0);
        }
      });
    }
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    setCombatAlert('🧪 ¡BOTELLA DE KLEIN! 100% Vida y Maná restaurados con onda cuántica de 9.5 Hz.');
  };

  // 🐺 Toggle Wolf Pack Mode
  const handleToggleWolfPack = () => {
    const modes: Array<'flank' | 'attack' | 'guard'> = ['flank', 'attack', 'guard'];
    const nextIdx = (modes.indexOf(wolfPackMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setWolfPackMode(nextMode);
    audioSystem.playSystemChime();
    setCombatAlert(`🐺 ¡Paquete de los 3 Lobos en modo: ${nextMode.toUpperCase()}!`);
  };

  // Initialize Three.js Game Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060913);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.010);

    const isInitialTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const initialW = container.clientWidth;
    const initialH = container.clientHeight;
    const isInitialMobile = isInitialTouch || (initialW < 1024 && initialW < initialH);
    const isInitialLandscape = initialW > initialH;
    const initialFov = (isInitialMobile && isInitialLandscape) ? 76 : (isInitialMobile ? 65 : 68);

    const camera = new THREE.PerspectiveCamera(
      initialFov,
      container.clientWidth / container.clientHeight,
      0.1,
      1200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // ATMOSPHERIC CELESTIAL SKY DOME (Zelda / MU 2050 Cosmic Horizon)
    const skyGeo = new THREE.SphereGeometry(300, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      map: createSkyDomeTexture(),
      side: THREE.BackSide,
      fog: false
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);

    // LIGHTING (Cinematic MU 3D Nexus Ambience)
    const hemiLight = new THREE.HemisphereLight(0xc8e0ff, 0x1f1929, 2.2);
    scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xffdfb0, 3.2);
    sun.position.set(-14, 28, 16);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0001;
    scene.add(sun);

    // Rim light on player for cinematic depth
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(12, 14, -18);
    scene.add(rimLight);

    // TERRAIN with Ultra Procedural Textures & Normal Bump
    const groundGeo = new THREE.PlaneGeometry(450, 450, 64, 64);
    const groundTex = createCobblestoneTexture();
    const groundBump = createCobblestoneBumpMap();
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      bumpMap: groundBump,
      bumpScale: 0.09,
      roughness: 0.8,
      metalness: 0.15
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid Helper (MU 3D Nexus Arena Grid)
    const grid = new THREE.GridHelper(450, 90, 0x38bdf8, 0x1e293b);
    grid.position.y = 0.015;
    scene.add(grid);

    // Solo Leveling Monarch Domain Ground Mesh (25m radius)
    const domainGeo = new THREE.CircleGeometry(26, 32);
    const domainMat = new THREE.MeshBasicMaterial({
      color: 0x3b0764,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const monarchDomainMesh = new THREE.Mesh(domainGeo, domainMat);
    monarchDomainMesh.rotation.x = -Math.PI / 2;
    monarchDomainMesh.position.y = 0.04;
    scene.add(monarchDomainMesh);

    // SURROUNDING RUINS & OBELISKS with Runic Carved Textures
    const pillarTex = createRunicPillarTexture();
    const pillarMat = new THREE.MeshStandardMaterial({
      map: pillarTex,
      bumpMap: pillarTex,
      bumpScale: 0.06,
      roughness: 0.6,
      metalness: 0.35
    });
    for (let i = 0; i < 42; i++) {
      const obelisk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 7.5, 1.8), pillarMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 22 + Math.random() * 110;
      obelisk.position.set(Math.cos(angle) * radius, 3.75, Math.sin(angle) * radius);
      obelisk.castShadow = true;
      obelisk.receiveShadow = true;
      scene.add(obelisk);
    }

    // ULTRA VFX MANAGER INITIALIZATION
    const ultraVfx = new UltraVfxManager(scene);
    vfxRef.current = ultraVfx;

    // FLOATING ATMOSPHERIC PARTICLES
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 160;
      particlePositions[i + 1] = Math.random() * 16 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 160;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x50c9ff,
      size: 0.35,
      transparent: true,
      opacity: 0.75
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // PLAYER: MU 3D NEXUS DARK KNIGHT (HYBRID COMBAT MODEL)
    const player = new THREE.Group();
    player.position.set(0, 0, 0);

    const currentSkin = R18_SKINS.find(s => s.id === currentR18Skin) || R18_SKINS[0];
    const armorMat = new THREE.MeshStandardMaterial({ color: currentSkin.color, metalness: 0.7, roughness: 0.3 });
    const steelMat = new THREE.MeshStandardMaterial({ color: 0xa9bfd0, metalness: 0.8, roughness: 0.25 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a17e, roughness: 0.7 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x131a26, metalness: 0.35, roughness: 0.55 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc89a47, metalness: 0.65, roughness: 0.3 });

    // Torso with armor
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.9, 0.4), armorMat);
    body.position.y = 1.35;
    body.castShadow = true;
    player.add(body);
    playerBodyMeshRef.current = body;

    // Steel Pauldrons / Gorget
    const shoulders = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.2, 0.46), steelMat);
    shoulders.position.y = 1.72;
    player.add(shoulders);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 12), skinMat);
    head.position.y = 2.04;
    player.add(head);

    // Steel Helmet & Golden Crest
    const helm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.48), steelMat);
    helm.position.y = 2.22;
    player.add(helm);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, 0.12), goldMat);
    crest.position.set(0, 2.31, 0.03);
    player.add(crest);

    // Legs with Greaves & Boots
    for (const x of [-0.22, 0.22]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.23, 0.64, 0.26), darkMat);
      leg.position.set(x, 0.48, 0);
      player.add(leg);
      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.4), steelMat);
      boot.position.set(x, 0.15, 0.06);
      player.add(boot);
    }

    // Arms with Gauntlets
    for (const x of [-0.49, 0.49]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.65, 0.23), armorMat);
      arm.position.set(x, 1.37, 0);
      player.add(arm);
      const gauntlet = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.23, 0.28), steelMat);
      gauntlet.position.set(x, 1.06, 0);
      player.add(gauntlet);
    }

    // MU 3D Nexus Energy Ring (Rotating Aura at feet)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x5ac9ff });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 8, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.04;
    player.add(ring);

    // MU Dark Knight Greatsword
    const sword = new THREE.Group();
    sword.position.set(0.57, 1.05, 0.03);
    player.add(sword);

    const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.5, 0.1), goldMat);
    hilt.position.y = -0.22;
    sword.add(hilt);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.0, 0.045), steelMat);
    blade.position.y = 0.48;
    sword.add(blade);

    const crossguard = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.13), goldMat);
    crossguard.position.y = 0.02;
    sword.add(crossguard);
    sword.rotation.z = -0.3;

    // Shield with Procedural Cyber Hylian Crest Texture
    const shieldGeo = new THREE.BoxGeometry(0.12, 0.95, 0.72);
    const shieldTex = createShieldTexture();
    const shieldMat = new THREE.MeshStandardMaterial({
      map: shieldTex,
      roughness: 0.35,
      metalness: 0.65
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.set(-0.7, 1.2, 0.2);
    shieldMesh.rotation.set(Math.PI / 2, 0, Math.PI / 6);
    player.add(shieldMesh);

    scene.add(player);

    // ENEMIES SPAWNER (Includes MU 3D Nexus Goblins & Fallen Warriors)
    const enemiesList: {
      id: string;
      group: THREE.Group;
      boundingBox: THREE.Box3;
      type: string;
      hp: number;
      maxHp: number;
      name: string;
      speed: number;
      dmg: number;
      weakness: string;
    }[] = [];

    const spawnEnemy = (type: string, x: number, z: number) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      let hpVal = 40;
      let nameVal = 'Enemigo';
      let speedVal = 0.04;
      let dmgVal = 10;
      let weaknessVal = 'Espadazos';

      if (type === 'mu_goblin') {
        hpVal = 60;
        nameVal = 'Goblin de Lorencia (MU)';
        speedVal = 0.055;
        dmgVal = 12;
        weaknessVal = 'Twisting Slash / Fuego';

        const skinM = new THREE.MeshStandardMaterial({ color: 0x607b45, roughness: 0.7 });
        const bodyM = new THREE.Mesh(new THREE.SphereGeometry(0.37, 14, 12), skinM);
        bodyM.position.y = 0.8;
        group.add(bodyM);

        const darkM = new THREE.MeshStandardMaterial({ color: 0x131a26, roughness: 0.5 });
        const torsoM = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.42, 0.4), darkM);
        torsoM.position.y = 0.43;
        group.add(torsoM);

        const hornMat = new THREE.MeshStandardMaterial({ color: 0xc4b78b });
        for (const side of [-1, 1]) {
          const horn = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 8), hornMat);
          horn.position.set(side * 0.22, 1.17, 0);
          group.add(horn);
        }

        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff3434 });
        const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
        e1.position.set(-0.13, 0.89, 0.32);
        const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
        e2.position.set(0.13, 0.89, 0.32);
        group.add(e1);
        group.add(e2);
      } else if (type === 'mu_warrior') {
        hpVal = 75;
        nameVal = 'Guerrero Caído (MU)';
        speedVal = 0.048;
        dmgVal = 16;
        weaknessVal = 'Espadazos Críticos';

        const skinM = new THREE.MeshStandardMaterial({ color: 0x806044, roughness: 0.6 });
        const bodyM = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 12), skinM);
        bodyM.position.y = 0.88;
        group.add(bodyM);

        const steelM = new THREE.MeshStandardMaterial({ color: 0x303b50, metalness: 0.7, roughness: 0.3 });
        const armorM = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.45), steelM);
        armorM.position.y = 0.48;
        group.add(armorM);

        const crestM = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.35), steelM);
        crestM.position.set(0, 1.25, 0);
        group.add(crestM);

        const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2222 });
        const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
        e1.position.set(-0.15, 0.92, 0.36);
        const e2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
        e2.position.set(0.15, 0.92, 0.36);
        group.add(e1);
        group.add(e2);
      } else if (type === 'sombra') {
        hpVal = 35;
        nameVal = 'Sombra Errante';
        speedVal = 0.05;
        dmgVal = 8;
        weaknessVal = 'Luz / Filo Sagrado';
        const geo = new THREE.CylinderGeometry(0.4, 0.6, 1.6, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x4f46e5,
          roughness: 0.4,
          emissive: 0x3730a3,
          emissiveIntensity: 0.5
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 0.8;
        group.add(mesh);
      } else if (type === 'drone') {
        hpVal = 45;
        nameVal = 'Dron Centinela Sheikah';
        speedVal = 0.06;
        dmgVal = 12;
        weaknessVal = 'Sobrecarga Eléctrica';
        const geo = new THREE.SphereGeometry(0.6, 12, 12);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          emissive: 0x0284c7,
          emissiveIntensity: 0.8
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 2.0;
        group.add(mesh);
      } else if (type === 'stalker') {
        hpVal = 80;
        nameVal = 'Caza-Sleeves del Vacío';
        speedVal = 0.07;
        dmgVal = 18;
        weaknessVal = 'Bombas de Nanobots';
        const geo = new THREE.ConeGeometry(0.7, 2.0, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          emissive: 0x7e22ce,
          emissiveIntensity: 0.6
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 1.0;
        group.add(mesh);
      } else if (type === 'gohma') {
        hpVal = 300;
        nameVal = 'Reina Gohma Bio-Mecánica (BOSS)';
        speedVal = 0.03;
        dmgVal = 35;
        weaknessVal = 'Vulnerabilidad Ocular';

        const bodyG = new THREE.SphereGeometry(2.5, 16, 16);
        const bodyM = new THREE.MeshStandardMaterial({
          color: 0x991b1b,
          roughness: 0.3,
          emissive: 0xef4444,
          emissiveIntensity: 0.4
        });
        const bossBody = new THREE.Mesh(bodyG, bodyM);
        bossBody.position.y = 2.5;
        group.add(bossBody);

        const eyeG = new THREE.SphereGeometry(1.2, 16, 16);
        const eyeM = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          emissive: 0xeab308,
          emissiveIntensity: 0.95
        });
        const eye = new THREE.Mesh(eyeG, eyeM);
        eye.position.set(0, 2.8, 1.8);
        group.add(eye);
      } else if (type === 'torlan_droide') {
        hpVal = 120;
        nameVal = 'Droide de Asalto Torlan';
        speedVal = 0.06;
        dmgVal = 24;
        weaknessVal = 'Corte Melee Crítico';
        const dMat = new THREE.MeshStandardMaterial({ color: 0x8799a6, metalness: 0.85, roughness: 0.25 });
        const dBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.7), dMat);
        dBody.position.y = 0.6;
        group.add(dBody);
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.15, 0.1), new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
        eye.position.set(0, 0.9, 0.36);
        group.add(eye);
      } else if (type === 'torlan_centinela') {
        hpVal = 160;
        nameVal = 'Centinela Mecánico Torlan';
        speedVal = 0.055;
        dmgVal = 30;
        weaknessVal = 'Twisting Slash / Fuego';
        const cMat = new THREE.MeshStandardMaterial({ color: 0x3aafbf, metalness: 0.8, emissive: 0x083344, emissiveIntensity: 0.6 });
        const cBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.6, 8), cMat);
        cBody.position.y = 0.8;
        group.add(cBody);
      } else if (type === 'torlan_titan') {
        hpVal = 280;
        nameVal = 'Titán Blindado de Torlan';
        speedVal = 0.04;
        dmgVal = 45;
        weaknessVal = 'Dominio de Sombras / Lifesteal';
        const tMat = new THREE.MeshStandardMaterial({ color: 0x6e3030, metalness: 0.7, roughness: 0.4 });
        const tBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 1.2), tMat);
        tBody.position.y = 1.1;
        group.add(tBody);
      }

      scene.add(group);
      const enemyBoundingBox = new THREE.Box3().setFromObject(group);
      enemiesList.push({
        id: `${type}_${Math.random().toString(36).substring(2, 7)}`,
        group,
        boundingBox: enemyBoundingBox,
        type,
        hp: hpVal,
        maxHp: hpVal,
        name: nameVal,
        speed: speedVal,
        dmg: dmgVal,
        weakness: weaknessVal
      });
    };

    // Initial enemies in world (Zelda + Solo Leveling + MU Online Goblins & Warriors + Torlan Drones!)
    spawnEnemy('mu_goblin', -8, -6);
    spawnEnemy('mu_goblin', 8, -8);
    spawnEnemy('mu_warrior', -14, -18);
    spawnEnemy('mu_warrior', 10, -28);
    spawnEnemy('sombra', -10, -15);
    spawnEnemy('sombra', 12, -22);
    spawnEnemy('drone', -18, -28);
    spawnEnemy('stalker', 0, -38);
    spawnEnemy('gohma', 0, -65);
    spawnEnemy('torlan_droide', -32, 12);
    spawnEnemy('torlan_centinela', -42, -15);
    spawnEnemy('torlan_titan', -55, 0);

    // Initial 3D shadow companion meshes
    const initialShadowMeshes = INITIAL_SHADOW_SOLDIERS.map((soldier, idx) => {
      const g = create3DShadowSoldier(soldier);
      g.position.set(idx === 0 ? -2.2 : 2.2, 0, 2.5);
      scene.add(g);
      return {
        id: soldier.id,
        group: g,
        soldierData: soldier,
        attackTimer: 0
      };
    });

    // Initial tutorial vortex
    const initialVortexGroup = create3DFallenVortex(fallenShadowsRef.current[0]);
    scene.add(initialVortexGroup);
    const initialVortexMeshes = [{ id: fallenShadowsRef.current[0].id, group: initialVortexGroup }];

    // Initial tutorial drop (Joya de la Bendición with Golden Beam of Light)
    const initialLootMesh = create3DLootDrop({
      id: 'tutorial_bless',
      item: LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless')!,
      position: { x: 3.5, y: 0.05, z: -6.0 },
      rarity: 'legendary',
      beamHeight: 8.5,
      beamColor: 0xfbbf24,
      hexColor: '#fbbf24',
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000,
      isJewel: true
    });
    scene.add(initialLootMesh.group);
    const initialLootMeshes = [initialLootMesh];

    // ==============================================================
    // ⚛️ NEXX KONI v9.2: SANCTUARY SACRED GEOMETRY FLOOR RINGS (3-6-9-5-∞)
    // ==============================================================
    const sanctuaryFloorGroup = new THREE.Group();
    sanctuaryFloorGroup.position.set(0, 0.03, 0);

    const ringRadii = [4.5, 8.5, 13.0, 18.0];
    ringRadii.forEach((rad, i) => {
      const ringGeo = new THREE.RingGeometry(rad - 0.08, rad + 0.08, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xf59e0b : 0x06b6d4,
        side: THREE.DoubleSide
      });
      const ringM = new THREE.Mesh(ringGeo, ringMat);
      ringM.rotation.x = -Math.PI / 2;
      sanctuaryFloorGroup.add(ringM);
    });

    for (let r = 0; r < 12; r++) {
      const angle = (r / 12) * Math.PI * 2;
      const rayGeo = new THREE.PlaneGeometry(0.12, 13.5);
      const rayMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.4 });
      const rayM = new THREE.Mesh(rayGeo, rayMat);
      rayM.rotation.x = -Math.PI / 2;
      rayM.rotation.z = angle;
      rayM.position.set(Math.cos(angle) * 9, 0, Math.sin(angle) * 9);
      sanctuaryFloorGroup.add(rayM);
    }
    scene.add(sanctuaryFloorGroup);

    // ==============================================================
    // ⚛️ FLOATING TESSERACT / HYPERCUBE & GOLDEN SCARAB & MANUAL
    // ==============================================================
    const tesseractGroup = new THREE.Group();
    tesseractGroup.position.set(0, 5.5, -4);
    const outerBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.4, 2.4, 2.4)),
      new THREE.LineBasicMaterial({ color: 0x06b6d4 })
    );
    const innerBox = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 1.2, 1.2)),
      new THREE.LineBasicMaterial({ color: 0xf59e0b })
    );
    tesseractGroup.add(outerBox);
    tesseractGroup.add(innerBox);
    scene.add(tesseractGroup);

    // Floating Sacred Book: Manual Nexx Koni
    const manualBookGroup = new THREE.Group();
    manualBookGroup.position.set(3.2, 2.2, -3);
    const bookCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.9, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.6, roughness: 0.3 })
    );
    const bookTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.74, 0.94, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
    );
    manualBookGroup.add(bookCover);
    manualBookGroup.add(bookTrim);
    scene.add(manualBookGroup);

    // Floating Golden Scarab: El Escarabajo Dorado
    const scarabGroup = new THREE.Group();
    scarabGroup.position.set(-3.2, 2.5, -3);
    const scarabBody = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.25 })
    );
    const wingLeft = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.7),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    wingLeft.position.set(-0.35, 0.1, 0);
    wingLeft.rotation.z = Math.PI / 4;
    const wingRight = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.7),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
    );
    wingRight.position.set(0.35, 0.1, 0);
    wingRight.rotation.z = -Math.PI / 4;
    scarabGroup.add(scarabBody);
    scarabGroup.add(wingLeft);
    scarabGroup.add(wingRight);
    scene.add(scarabGroup);

    // ==============================================================
    // 🐺 PAQUETE DE LOS 3 LOBOS COMPANIONS IN 3D
    // ==============================================================
    const create3DWolf = (colorHex: number, trimHex: number, scale: number = 1.0) => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.55 * scale, 0.5 * scale, 1.1 * scale),
        new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 })
      );
      body.position.y = 0.55 * scale;
      g.add(body);
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.4 * scale, 0.38 * scale, 0.45 * scale),
        new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 })
      );
      head.position.set(0, 0.85 * scale, 0.6 * scale);
      g.add(head);
      const snout = new THREE.Mesh(
        new THREE.BoxGeometry(0.22 * scale, 0.18 * scale, 0.3 * scale),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
      );
      snout.position.set(0, 0.78 * scale, 0.88 * scale);
      g.add(snout);
      for (const ex of [-0.14 * scale, 0.14 * scale]) {
        const ear = new THREE.Mesh(
          new THREE.ConeGeometry(0.08 * scale, 0.22 * scale, 4),
          new THREE.MeshStandardMaterial({ color: trimHex })
        );
        ear.position.set(ex, 1.12 * scale, 0.55 * scale);
        g.add(ear);
      }
      for (const eyeX of [-0.1 * scale, 0.1 * scale]) {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.04 * scale, 8, 8),
          new THREE.MeshBasicMaterial({ color: trimHex })
        );
        eye.position.set(eyeX, 0.88 * scale, 0.82 * scale);
        g.add(eye);
      }
      const collar = new THREE.Mesh(
        new THREE.TorusGeometry(0.25 * scale, 0.04 * scale, 6, 16),
        new THREE.MeshStandardMaterial({ color: trimHex, metalness: 0.8, roughness: 0.2 })
      );
      collar.position.set(0, 0.75 * scale, 0.45 * scale);
      collar.rotation.x = Math.PI / 4;
      g.add(collar);
      for (const lx of [-0.2 * scale, 0.2 * scale]) {
        for (const lz of [-0.35 * scale, 0.35 * scale]) {
          const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.14 * scale, 0.5 * scale, 0.16 * scale),
            new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 })
          );
          leg.position.set(lx, 0.25 * scale, lz);
          g.add(leg);
        }
      }
      const tail = new THREE.Mesh(
        new THREE.BoxGeometry(0.12 * scale, 0.12 * scale, 0.5 * scale),
        new THREE.MeshStandardMaterial({ color: trimHex })
      );
      tail.position.set(0, 0.65 * scale, -0.65 * scale);
      tail.rotation.x = -Math.PI / 5;
      g.add(tail);
      return g;
    };

    const wolfShieldMesh = create3DWolf(0xf1f5f9, 0x38bdf8, 1.05);
    const wolfAlphaMesh = create3DWolf(0xfef08a, 0xf59e0b, 1.25);
    const wolfOracleMesh = create3DWolf(0x581c87, 0xd946ef, 1.05);
    wolfShieldMesh.position.set(-2.8, 0, 1.8);
    wolfAlphaMesh.position.set(2.8, 0, 1.8);
    wolfOracleMesh.position.set(0, 0, 3.2);
    scene.add(wolfShieldMesh);
    scene.add(wolfAlphaMesh);
    scene.add(wolfOracleMesh);

    // Track keyboard controls
    const keys: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys[k] = true;
      if (k === ' ' || k === 'e') {
        if (activeNearbyLootRef.current) {
          handleCollectLoot(activeNearbyLootRef.current.id);
        } else {
          handlePlayerAttack();
        }
      }
      if (k === 'r' || k === 't') performMUTwistingSlash();
      if (k === 'v') handleTriggerNexusVortex();
      if (k === 'n') setIsNexusModalOpen((p) => !p);
      if (k === 'm') handleToggleMount();
      if (k === 'p') handleTravelTorlan();
      if (k === 'w') setIsWorldModalOpen((p) => !p);
      if (k === 'k') setIsManualModalOpen((p) => !p);
      if (k === 'o') setActiveMenuTab((p) => (p === 'r18' ? null : 'r18'));
      if (k === 'tab') {
        e.preventDefault();
        toggleZTarget();
      }
      if (k === '1') useQuickPotion('health_potion');
      if (k === '2') useQuickPotion('mana_potion');
      if (k === '3') detonateBomb();
      if (k === '4') handleUseBotellaDeKlein();
      if (k === 'j') handleSkillForja();
      if (k === 'x') handleSkillVerifica();
      if (k === 'z') handleSkillAcelera();
      if (k === 'q') handleSkillMaterializa();
      if (k === 'f') {
        if (activeNearbyLootRef.current) {
          handleCollectLoot(activeNearbyLootRef.current.id);
        } else {
          performSoloLevelingShadowSkill();
        }
      }
      if (k === 's') setActiveMenuTab((p) => (p === 'system' ? null : 'system'));
      if (k === 'c') setActiveMenuTab((p) => (p === 'class' ? null : 'class'));
      if (k === 'b') setActiveMenuTab((p) => (p === 'bestiary' ? null : 'bestiary'));
      if (k === 'i') setActiveMenuTab((p) => (p === 'inventory' ? null : 'inventory'));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    gameRef.current = {
      scene,
      camera,
      renderer,
      player,
      swordMesh: sword,
      shieldMesh,
      monarchDomainMesh,
      enemies: enemiesList,
      shadowSoldierMeshes: initialShadowMeshes,
      vortexMeshes: initialVortexMeshes,
      lootMeshes: initialLootMeshes,
      particles,
      keys,
      joystickVec: { x: 0, y: 0 },
      isSprinting: false,
      cameraYaw: 0,
      cameraPitch: 0.35,
      isRolling: false,
      rollTimer: 0,
      rollVec: new THREE.Vector3(0, 0, -1),
      isAttacking: false,
      isBlocking: false,
      targetEnemyId: null,
      wolfShieldMesh,
      wolfAlphaMesh,
      wolfOracleMesh,
      tesseractGroup,
      manualBookGroup,
      scarabGroup,
      wingLeft,
      wingRight
    };

    // Expose globals for r18-addon.js and external integration
    (window as any).THREE = THREE;
    (window as any).sc = scene;
    (window as any).P = { g: player, speed: 7.5 };
    (window as any).MP = [
      ["Lorencia", 1, 0x223528, 0x14201a, [["Goblin de Lorencia", 1, 0x5a7a40, 1.0], ["Guerrero Caído", 3, 0x6e5038, 1.1]]],
      ["Noria", 15, 0x1c382b, 0x0f241a, [["Duende de Bosque", 18, 0x428258, 1.1]]],
      ["Devias", 30, 0x3d4f66, 0x222c3a, [["Yeti Ártico", 35, 0xd4e2ef, 1.6]]],
      ["Dungeon", 45, 0x2d2222, 0x181010, [["Esqueleto Guerrero", 50, 0xa39c94, 1.2]]],
      ["Atlans", 60, 0x143444, 0x091c26, [["Hydra Marina", 65, 0x2e8296, 1.7]]],
      ["Lost Tower", 75, 0x382218, 0x1f110a, [["Sombra Maldita", 80, 0x4a3224, 1.3]]],
      ["Tarkan", 90, 0x473822, 0x261d10, [["Mutante del Desierto", 95, 0x9e804f, 1.5]]],
      ["Icarus", 105, 0x242844, 0x101326, [["Fénix del Vacío", 120, 0x4879b8, 2.0]]],
      ["Cañón Torlan", 100, 0x9c5836, 0x371b25, [["Droide de asalto", 105, 0x8799a6, 1.2], ["Centinela mecánico", 115, 0x3aafbf, 1.5], ["Titán Blindado", 130, 0x6e3030, 2.0]]]
    ];
    (window as any).build = (idx: number) => {
      handleTravelTorlan();
    };
    (window as any).S = { r18Map: 0 };

    const handleSkinEvent = (e: any) => {
      if (e.detail) {
        handleSelectR18Skin(e.detail);
      }
    };
    const handleMountEvent = (e: any) => {
      if (e.detail && e.detail.mounted !== r18MountedRef.current) {
        handleToggleMount();
      }
    };
    const handleTorlanEvent = () => {
      handleTravelTorlan();
    };

    window.addEventListener('mu3d:r18-skin', handleSkinEvent);
    window.addEventListener('mu3d:r18-mount', handleMountEvent);
    window.addEventListener('mu3d:r18-travel-torlan', handleTorlanEvent);

    // GAME LOOP
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const time = now * 0.001;

      // Animate floating particles
      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += Math.sin(time + pos[i - 1]) * 0.02;
        if (pos[i] > 18) pos[i] = 0.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Rotate MU Energy Ring around feet
      ring.rotation.z += delta * 1.5;

      // PLAYER MOVEMENT LOGIC
      const joyX = gameRef.current?.joystickVec?.x || 0;
      const joyY = gameRef.current?.joystickVec?.y || 0;
      const keyZ = (keys['w'] ? -1 : 0) + (keys['s'] ? 1 : 0);
      const keyX = (keys['a'] ? -1 : 0) + (keys['d'] ? 1 : 0);

      const rawInputX = joyX + keyX;
      const rawInputZ = joyY + keyZ;
      const inputLen = Math.sqrt(rawInputX * rawInputX + rawInputZ * rawInputZ);

      const camYaw = gameRef.current?.cameraYaw || 0;
      const fwdX = -Math.sin(camYaw);
      const fwdZ = -Math.cos(camYaw);
      const rightX = Math.cos(camYaw);
      const rightZ = -Math.sin(camYaw);

      // Distance accumulator for Daily Quest
      const lastPos = lastPlayerPosRef.current;
      const movedDistance = player.position.distanceTo(lastPos);
      if (movedDistance > 0.02) {
        distanceAccumulatorRef.current += movedDistance;
        if (distanceAccumulatorRef.current >= 8) {
          const added = Math.round(distanceAccumulatorRef.current);
          setDailyQuest((prev) => {
            const nextDist = Math.min(prev.distanceMeters.target, prev.distanceMeters.current + added);
            const isCompletedNow =
              nextDist >= prev.distanceMeters.target &&
              prev.swordSwings.current >= prev.swordSwings.target &&
              prev.monstersKilled.current >= prev.monstersKilled.target &&
              prev.shadowsExtracted.current >= prev.shadowsExtracted.target;
            return {
              ...prev,
              distanceMeters: { ...prev.distanceMeters, current: nextDist },
              isCompleted: isCompletedNow
            };
          });
          distanceAccumulatorRef.current = 0;
        }
      }
      lastPos.copy(player.position);

      // Dodge Roll state (acrobatic dash)
      if (gameRef.current?.isRolling && gameRef.current.rollTimer > 0) {
        gameRef.current.rollTimer -= delta;
        const rollSpeed = 16.5;
        player.position.x += gameRef.current.rollVec.x * rollSpeed * delta;
        player.position.z += gameRef.current.rollVec.z * rollSpeed * delta;
        body.rotation.x += delta * 18;
        if (gameRef.current.rollTimer <= 0) {
          gameRef.current.isRolling = false;
          body.rotation.x = 0;
        }
      } else if (inputLen > 0.06) {
        const normInputX = rawInputX / (inputLen > 1 ? inputLen : 1);
        const normInputZ = rawInputZ / (inputLen > 1 ? inputLen : 1);

        const worldMoveX = fwdX * (-normInputZ) + rightX * normInputX;
        const worldMoveZ = fwdZ * (-normInputZ) + rightZ * normInputX;

        const isRun = keys['shift'] || gameRef.current?.isSprinting || inputLen > 0.85;
        const baseSpeed = isRun ? 12.5 : 7.5;
        const speed = calculateMovementSpeed(baseSpeed, r18MountedRef.current, systemAttrs.agility);

        player.position.x += worldMoveX * speed * delta;
        player.position.z += worldMoveZ * speed * delta;

        if (!gameRef.current?.targetEnemyId) {
          const targetAngle = Math.atan2(worldMoveX, worldMoveZ);
          player.rotation.y = targetAngle;
        }

        body.position.y = (r18MountedRef.current ? 1.95 : 1.35) + Math.sin(time * (r18MountedRef.current ? 16 : 12)) * 0.08;
      }

      // Z-Targeting alignment
      if (gameRef.current?.targetEnemyId) {
        const target = enemiesList.find((e) => e.id === gameRef.current?.targetEnemyId);
        if (target && target.hp > 0) {
          player.lookAt(target.group.position.x, player.position.y, target.group.position.z);
          const enemyDir = new THREE.Vector3()
            .subVectors(target.group.position, player.position)
            .normalize();
          const targetYaw = Math.atan2(-enemyDir.x, -enemyDir.z) + Math.PI;
          gameRef.current.cameraYaw = THREE.MathUtils.lerp(
            gameRef.current.cameraYaw,
            targetYaw,
            0.05
          );
        } else {
          gameRef.current.targetEnemyId = null;
          setIsZTargeting(false);
          setTargetEnemyName(null);
        }
      }

      // Attack sword swing animation
      if (gameRef.current?.isAttacking) {
        sword.rotation.x = Math.sin(time * 25) * 1.5;
        sword.rotation.y = Math.cos(time * 25) * 0.8;
      } else {
        sword.rotation.set(0.5, 0, -0.3);
      }

      // Shield block posture
      if (gameRef.current?.isBlocking) {
        shieldMesh.position.set(0, 1.3, 0.7);
        shieldMesh.rotation.set(0, 0, 0);
      } else {
        shieldMesh.position.set(-0.7, 1.2, 0.2);
        shieldMesh.rotation.set(Math.PI / 2, 0, Math.PI / 6);
      }

      // Monarch Domain Ground Visual
      if (monarchDomainActiveRef.current) {
        monarchDomainMesh.visible = true;
        monarchDomainMesh.position.set(player.position.x, 0.04, player.position.z);
        (monarchDomainMesh.material as THREE.MeshBasicMaterial).opacity =
          0.4 + Math.sin(time * 4) * 0.15;
      } else {
        monarchDomainMesh.visible = false;
      }

      // Update Enemies AI & THREE.Box3 Collision Manager
      const playerBox = new THREE.Box3().setFromObject(player);

      enemiesList.forEach((enemy) => {
        if (enemy.hp <= 0) return;

        const distToPlayer = enemy.group.position.distanceTo(player.position);

        if (enemy.type === 'drone' || enemy.type === 'keese') {
          enemy.group.position.y = 2.0 + Math.sin(time * 4 + enemy.group.position.x) * 0.4;
        }

        if (distToPlayer < 24 && distToPlayer > 1.8) {
          const dir = new THREE.Vector3()
            .subVectors(player.position, enemy.group.position)
            .normalize();
          enemy.group.position.x += dir.x * enemy.speed;
          enemy.group.position.z += dir.z * enemy.speed;
          enemy.group.lookAt(player.position.x, enemy.group.position.y, player.position.z);
        }

        // Update enemy bounding box with THREE.Box3
        enemy.boundingBox.setFromObject(enemy.group);

        // Precise THREE.Box3 Collision Manager: Prevent models from passing through each other
        if (playerBox.intersectsBox(enemy.boundingBox)) {
          const separationVec = new THREE.Vector3().subVectors(player.position, enemy.group.position);
          separationVec.y = 0; // Keep horizontal physics
          const dist = separationVec.length();
          const minAllowedDist = enemy.type === 'gohma' || enemy.type === 'torlan_titan' ? 2.8 : 1.7;

          if (dist < minAllowedDist) {
            if (dist === 0) separationVec.set(0, 0, 1);
            separationVec.normalize();
            const pushDist = (minAllowedDist - dist) * 0.5;

            // Push player and enemy apart to avoid mesh clipping/overlapping
            player.position.addScaledVector(separationVec, pushDist);
            enemy.group.position.addScaledVector(separationVec, -pushDist);

            // Re-sync bounding boxes
            playerBox.setFromObject(player);
            enemy.boundingBox.setFromObject(enemy.group);
          }
        }

        if (distToPlayer <= 2.2) {
          if (Math.sin(time * 2) > 0.96) {
            handlePlayerDamaged(enemy.dmg);
          }
        }
      });

      // UPDATE SHADOW SOLDIER COMPANIONS (Solo Leveling 3D AI Escort)
      if (gameRef.current) {
        const { shadowSoldierMeshes } = gameRef.current;
        const isSummoned = shadowsSummonedRef.current;
        const isDomain = monarchDomainActiveRef.current;

        shadowSoldierMeshes.forEach((soldierMesh, idx) => {
          if (!isSummoned) {
            soldierMesh.group.visible = false;
            return;
          }
          soldierMesh.group.visible = true;

          let nearestEnemy: typeof enemiesList[0] | null = null;
          let nearestDist = 16.0;

          enemiesList.forEach((en) => {
            if (en.hp > 0) {
              const d = en.group.position.distanceTo(soldierMesh.group.position);
              if (d < nearestDist) {
                nearestDist = d;
                nearestEnemy = en;
              }
            }
          });

          if (nearestEnemy) {
            const targetPos = (nearestEnemy as typeof enemiesList[0]).group.position;
            const dir = new THREE.Vector3().subVectors(targetPos, soldierMesh.group.position).normalize();
            soldierMesh.group.position.x += dir.x * 0.11;
            soldierMesh.group.position.z += dir.z * 0.11;
            soldierMesh.group.lookAt(targetPos.x, soldierMesh.group.position.y, targetPos.z);

            if (nearestDist <= 2.5) {
              soldierMesh.attackTimer = (soldierMesh.attackTimer || 0) + delta;
              if (soldierMesh.attackTimer > 1.1) {
                soldierMesh.attackTimer = 0;
                audioSystem.playSwordSlash();
                const bonus = isDomain ? 1.5 : 1.0;
                const dealtDmg = Math.round(soldierMesh.soldierData.atk * bonus);
                (nearestEnemy as typeof enemiesList[0]).hp -= dealtDmg;
                audioSystem.playHit();
                setCombatAlert(
                  `👥 ¡${soldierMesh.soldierData.name} atacó con furia sombría! (-${dealtDmg} HP)`
                );

                if ((nearestEnemy as typeof enemiesList[0]).hp <= 0) {
                  soldierMesh.soldierData.kills += 1;
                  handleEnemyDefeated(nearestEnemy as typeof enemiesList[0]);
                }
              }
            }
          } else {
            const row = Math.floor(idx / 2) + 1;
            const side = idx % 2 === 0 ? -1 : 1;
            const offsetX = side * (1.8 + row * 0.6);
            const offsetZ = row * 2.0;

            const targetPos = new THREE.Vector3(
              player.position.x + Math.cos(player.rotation.y) * offsetX - Math.sin(player.rotation.y) * offsetZ,
              0,
              player.position.z + Math.sin(player.rotation.y) * offsetX + Math.cos(player.rotation.y) * offsetZ
            );

            soldierMesh.group.position.lerp(targetPos, 0.08);
            soldierMesh.group.rotation.y = THREE.MathUtils.lerp(
              soldierMesh.group.rotation.y,
              player.rotation.y,
              0.1
            );
          }
        });

        // ⚛️ Animate Floating Tesseract, Manual Book, and Golden Scarab
        const { tesseractGroup, manualBookGroup, scarabGroup, wingLeft, wingRight, wolfShieldMesh, wolfAlphaMesh, wolfOracleMesh } = gameRef.current;
        if (tesseractGroup) {
          tesseractGroup.rotation.x += delta * 0.8;
          tesseractGroup.rotation.y += delta * 1.1;
        }
        if (manualBookGroup) {
          manualBookGroup.position.y = 2.2 + Math.sin(time * 2.2) * 0.14;
          manualBookGroup.rotation.y += delta * 0.9;
        }
        if (scarabGroup) {
          scarabGroup.position.y = 2.5 + Math.sin(time * 3.2) * 0.18;
          scarabGroup.rotation.y += delta * 0.6;
          if (wingLeft && wingRight) {
            wingLeft.rotation.z = Math.PI / 4 + Math.sin(time * 22) * 0.35;
            wingRight.rotation.z = -Math.PI / 4 - Math.sin(time * 22) * 0.35;
          }
        }

        // 🐺 Animate the 3 Wolf Companions (Paquete de los 3 Lobos)
        if (wolfShieldMesh && wolfAlphaMesh && wolfOracleMesh && wolfPackActive) {
          const pAngle = player.rotation.y;
          const leftTarget = new THREE.Vector3(
            player.position.x + Math.cos(pAngle) * (-2.4) - Math.sin(pAngle) * 1.6,
            0,
            player.position.z + Math.sin(pAngle) * (-2.4) + Math.cos(pAngle) * 1.6
          );
          const rightTarget = new THREE.Vector3(
            player.position.x + Math.cos(pAngle) * 2.4 - Math.sin(pAngle) * 1.6,
            0,
            player.position.z + Math.sin(pAngle) * 2.4 + Math.cos(pAngle) * 1.6
          );
          const rearTarget = new THREE.Vector3(
            player.position.x - Math.sin(pAngle) * 3.2,
            0,
            player.position.z + Math.cos(pAngle) * 3.2
          );

          wolfShieldMesh.position.lerp(leftTarget, 0.08);
          wolfAlphaMesh.position.lerp(rightTarget, 0.08);
          wolfOracleMesh.position.lerp(rearTarget, 0.07);

          wolfShieldMesh.rotation.y = THREE.MathUtils.lerp(wolfShieldMesh.rotation.y, pAngle, 0.1);
          wolfAlphaMesh.rotation.y = THREE.MathUtils.lerp(wolfAlphaMesh.rotation.y, pAngle, 0.1);
          wolfOracleMesh.rotation.y = THREE.MathUtils.lerp(wolfOracleMesh.rotation.y, pAngle, 0.1);
        }

        const { vortexMeshes, lootMeshes } = gameRef.current;
        vortexMeshes.forEach((vm) => {
          vm.group.rotation.y += delta * 1.5;
        });

        // Animate 3D World Loot Drops (Light Beams, Floating Crystals & Proximity)
        let closestLoot: WorldLootDrop | null = null;
        let minLootDist = 3.6;
        lootMeshes.forEach((lm) => {
          const timeOffset = (lm.dropData.createdAt % 1000) * 0.01;
          lm.beamMesh.rotation.y += delta * 0.8;
          lm.coreBeamMesh.rotation.y -= delta * 1.2;
          lm.itemMesh.rotation.y += delta * 2.5;
          lm.itemMesh.position.y = 0.85 + Math.sin(time * 3 + timeOffset) * 0.16;
          lm.auraRing.rotation.z += delta * 0.9;
          const ringPulse = 1.0 + Math.sin(time * 4 + timeOffset) * 0.15;
          lm.auraRing.scale.set(ringPulse, ringPulse, ringPulse);

          const d = player.position.distanceTo(lm.group.position);
          if (d < minLootDist) {
            minLootDist = d;
            closestLoot = lm.dropData;
          }
        });

        const nextLootId = closestLoot ? (closestLoot as WorldLootDrop).id : null;
        const currentLootId = activeNearbyLootRef.current ? activeNearbyLootRef.current.id : null;
        if (nextLootId !== currentLootId) {
          activeNearbyLootRef.current = closestLoot;
          setNearbyLoot(closestLoot);
        }

        // Proximity detection for Fallen Shadow extraction
        let closestVortex: FallenShadowVortex | null = null;
        let minVortexDist = 5.5;
        fallenShadowsRef.current.forEach((vx) => {
          const vxPos = new THREE.Vector3(vx.position.x, 0, vx.position.z);
          const d = player.position.distanceTo(vxPos);
          if (d < minVortexDist) {
            minVortexDist = d;
            closestVortex = vx;
          }
        });
        setActiveVortexNearPlayer(closestVortex);

        // Track target or nearest enemy for MU 3D Nexus Target Panel
        let hudEnemy: typeof enemiesList[0] | null = null;
        let minEnemyDist = 28.0;

        if (gameRef.current?.targetEnemyId) {
          hudEnemy = enemiesList.find((e) => e.id === gameRef.current?.targetEnemyId && e.hp > 0) || null;
        }

        if (!hudEnemy) {
          enemiesList.forEach((e) => {
            if (e.hp > 0) {
              const d = player.position.distanceTo(e.group.position);
              if (d < minEnemyDist) {
                minEnemyDist = d;
                hudEnemy = e;
              }
            }
          });
        }

        if (hudEnemy) {
          const d = player.position.distanceTo((hudEnemy as typeof enemiesList[0]).group.position);
          setSelectedEnemyForHud({
            name: (hudEnemy as typeof enemiesList[0]).name,
            hp: (hudEnemy as typeof enemiesList[0]).hp,
            maxHp: (hudEnemy as typeof enemiesList[0]).maxHp,
            dist: d,
            weakness: (hudEnemy as typeof enemiesList[0]).weakness
          });
        } else {
          setSelectedEnemyForHud(null);
        }
      }

      // Camera orbital third-person follow (Expansive View + Zoom Support)
      const camDistance = cameraZoomRef.current;
      const camPitch = gameRef.current?.cameraPitch ?? 0.35;
      const currentCamYaw = gameRef.current?.cameraYaw ?? 0;

      const camOffsetX = Math.sin(currentCamYaw) * Math.cos(camPitch) * camDistance;
      const camOffsetY = Math.sin(camPitch) * camDistance + 2.0;
      const camOffsetZ = Math.cos(currentCamYaw) * Math.cos(camPitch) * camDistance;

      const cameraTargetPos = new THREE.Vector3(
        player.position.x + camOffsetX,
        player.position.y + camOffsetY,
        player.position.z + camOffsetZ
      );

      // Apply camera shake from Ultra VFX
      if (vfxRef.current) {
        cameraTargetPos.add(vfxRef.current.shakeOffset);
      }

      camera.position.lerp(cameraTargetPos, 0.15);
      camera.lookAt(player.position.x, player.position.y + 1.2, player.position.z);

      // Update Ultra VFX manager
      vfxRef.current?.update(delta);

      // Sector exploration triggers
      if (player.position.z < -40 && currentSector !== 'Templo Deku (Cámara del Boss)') {
        setCurrentSector('Templo Deku (Cámara del Boss)');
        setDiscoveredSectors((prev) => new Set([...prev, 'TempleDeku']));
      } else if (player.position.x > 38 && currentSector !== 'Puente Dimensional Gate') {
        setCurrentSector('Puente Dimensional Gate');
        setDiscoveredSectors((prev) => new Set([...prev, 'GateLink']));
      } else if (player.position.z > 35 && currentSector !== 'Llanura de Hyrule Neón') {
        setCurrentSector('Llanura de Hyrule Neón');
        setDiscoveredSectors((prev) => new Set([...prev, 'HyrulePlain']));
      } else if (player.position.x < -28 && currentSector !== 'Cañón Torlan (R18)') {
        setCurrentSector('Cañón Torlan (R18)');
        setDiscoveredSectors((prev) => new Set([...prev, 'TorlanCanyon']));
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse wheel zoom
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setCameraZoom((prev) => Math.max(6.5, Math.min(26.0, prev + (e.deltaY > 0 ? 1.5 : -1.5))));
    };
    container.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const isMobile = isTouch || (width < 1024 && width < height);
      const isLandscape = width > height;
      const isPanoramic = isMobile && isLandscape;

      if (isPanoramic) {
        camera.fov = 76; // Ultra-wide cinematic panoramic perspective for cell landscape
      } else if (isMobile && !isLandscape) {
        camera.fov = 65; // Mobile portrait
      } else {
        camera.fov = 68; // Normal PC desktop
      }

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mu3d:r18-skin', handleSkinEvent);
      window.removeEventListener('mu3d:r18-mount', handleMountEvent);
      window.removeEventListener('mu3d:r18-travel-torlan', handleTorlanEvent);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Screen Touch Drag for Camera Rotation (Mobile 3D look-around)
  const handleScreenTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (touch.clientX - rect.left) / rect.width;
    const yRatio = (touch.clientY - rect.top) / rect.height;

    if (xRatio > 0.38 || yRatio < 0.6) {
      cameraTouchRef.current = {
        id: touch.identifier,
        lastX: touch.clientX,
        lastY: touch.clientY
      };
    }
  };

  const handleScreenTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cameraTouchRef.current || !gameRef.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === cameraTouchRef.current.id) {
        const dx = touch.clientX - cameraTouchRef.current.lastX;
        const dy = touch.clientY - cameraTouchRef.current.lastY;
        gameRef.current.cameraYaw -= dx * 0.007;
        gameRef.current.cameraPitch = Math.max(
          0.1,
          Math.min(1.15, gameRef.current.cameraPitch + dy * 0.005)
        );
        cameraTouchRef.current.lastX = touch.clientX;
        cameraTouchRef.current.lastY = touch.clientY;
        break;
      }
    }
  };

  const handleScreenTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cameraTouchRef.current) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === cameraTouchRef.current.id) {
        cameraTouchRef.current = null;
        break;
      }
    }
  };

  // Virtual Joystick Handlers for Mobile Movement
  const handleJoystickTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    audioSystem.unlock();
    const touch = e.changedTouches[0];
    if (!touch) return;
    const target = e.currentTarget.getBoundingClientRect();
    const centerX = target.left + target.width / 2;
    const centerY = target.top + target.height / 2;
    joystickTouchIdRef.current = touch.identifier;
    joystickOriginRef.current = { x: centerX, y: centerY };
    setJoystickActive(true);
    updateJoystickPos(touch.clientX, touch.clientY, centerX, centerY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (joystickTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        updateJoystickPos(
          touch.clientX,
          touch.clientY,
          joystickOriginRef.current.x,
          joystickOriginRef.current.y
        );
        break;
      }
    }
  };

  const updateJoystickPos = (
    clientX: number,
    clientY: number,
    centerX: number,
    centerY: number
  ) => {
    const maxRadius = 40;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setJoystickKnob({ x: knobX, y: knobY });

    const normX = knobX / maxRadius;
    const normY = knobY / maxRadius;

    if (gameRef.current) {
      gameRef.current.joystickVec = { x: normX, y: normY };
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (joystickTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchIdRef.current) {
        joystickTouchIdRef.current = null;
        setJoystickActive(false);
        setJoystickKnob({ x: 0, y: 0 });
        if (gameRef.current) {
          gameRef.current.joystickVec = { x: 0, y: 0 };
        }
        break;
      }
    }
  };

  // Center Camera Behind Player
  const centerCameraBehindPlayer = () => {
    if (!gameRef.current) return;
    gameRef.current.cameraYaw = gameRef.current.player.rotation.y + Math.PI;
    gameRef.current.cameraPitch = 0.35;
    setCombatAlert('📷 Cámara centrada detrás del jugador.');
  };

  // Acrobatic Dodge Roll
  const handlePlayerRoll = () => {
    if (!gameRef.current || gameRef.current.isRolling) return;
    audioSystem.playSwordSlash();

    let rollDir = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      gameRef.current.player.rotation.y
    );
    const joyX = gameRef.current.joystickVec?.x || 0;
    const joyY = gameRef.current.joystickVec?.y || 0;
    if (Math.abs(joyX) > 0.15 || Math.abs(joyY) > 0.15) {
      const camYaw = gameRef.current.cameraYaw || 0;
      const fwdX = -Math.sin(camYaw);
      const fwdZ = -Math.cos(camYaw);
      const rightX = Math.cos(camYaw);
      const rightZ = -Math.sin(camYaw);
      rollDir = new THREE.Vector3(
        fwdX * (-joyY) + rightX * joyX,
        0,
        fwdZ * (-joyY) + rightZ * joyX
      ).normalize();
    }

    gameRef.current.isRolling = true;
    gameRef.current.rollTimer = 0.32;
    gameRef.current.rollVec = rollDir;
    setCombatAlert('🌀 ¡Esquive acrobático rodando!');
  };

  // 🌀 Nexus Omega N_Ω Vortex Skill: Sello de Operadores Internos (T ∘ O ∘ F |Ψ_Ω⟩)
  const handleTriggerNexusVortex = () => {
    if (mana < 25) {
      setCombatAlert('❌ Maná insuficiente para Vórtice Nexus Ω (requiere 25 MP).');
      return;
    }
    setMana((prev) => Math.max(0, prev - 25));
    audioSystem.playNexusOmegaChord();

    if (!gameRef.current) return;
    const playerPos = gameRef.current.player.position;

    // Trigger Ultra 3-Ring Resonant Vortex VFX
    vfxRef.current?.triggerNexusOmegaVortex(
      playerPos,
      nexusResult.auraColorHex,
      nexusResult.vortexPullRadius
    );

    // Pull enemies inward and deal resonant harmonic burst damage
    let hitCount = 0;
    gameRef.current.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      const dist = enemy.group.position.distanceTo(playerPos);
      if (dist < nexusResult.vortexPullRadius) {
        // Inward vortex pull (curl pull towards central invariant point)
        const pullDir = new THREE.Vector3().subVectors(playerPos, enemy.group.position).normalize();
        enemy.group.position.addScaledVector(pullDir, Math.min(dist * 0.7, 4.5));

        const arch = ARCHETYPES.find((a) => a.id === currentArchetype);
        const archBonus = arch ? arch.bonusAtk : 0;
        const baseDmg = 42 + archBonus;
        const totalDmg = Math.round(
          calculateCombatDamage(baseDmg * nexusResult.damageMultiplier, true)
        );

        enemy.hp -= totalDmg;
        hitCount++;
        audioSystem.playHit();
        vfxRef.current?.spawnHitSparks(enemy.group.position, true);

        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
        }
      }
    });

    setCombatAlert(
      `🌀 [VÓRTICE NEXUS N_Ω] ¡Singularidad de Operadores (T∘O∘F) activa! Daño x${nexusResult.damageMultiplier.toFixed(2)} (${hitCount} enemigos absorbidos).`
    );
  };

  // MU 3D Nexus Skill: Twisting Slash (Ciclón Espiral de Acero)
  const performMUTwistingSlash = () => {
    if (mana < 20) {
      setCombatAlert('❌ Maná insuficiente para Twisting Slash (requiere 20 MP).');
      return;
    }
    setMana((prev) => prev - 20);
    audioSystem.playTwistingSlash();

    if (!gameRef.current) return;
    const playerPos = gameRef.current.player.position;

    // Trigger Ultra Twisting Slash Cyclone & Camera Shake
    vfxRef.current?.triggerTwistingSlashCyclone(playerPos);

    // Spin player 360 degrees
    let spins = 0;
    const spinInterval = setInterval(() => {
      if (gameRef.current) {
        gameRef.current.player.rotation.y += Math.PI / 2;
      }
      spins++;
      if (spins >= 8) {
        clearInterval(spinInterval);
      }
    }, 35);

    // Hit enemies in 6.5m radius
    let hitCount = 0;
    gameRef.current.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      const dist = enemy.group.position.distanceTo(playerPos);
      if (dist < 6.5) {
        const arch = ARCHETYPES.find((a) => a.id === currentArchetype);
        const archBonus = arch ? arch.bonusAtk : 0;
        const dmg = calculateCombatDamage(36 + archBonus, true);
        enemy.hp -= dmg;
        hitCount++;
        audioSystem.playHit();
        vfxRef.current?.spawnHitSparks(enemy.group.position, true);

        const kbDir = new THREE.Vector3().subVectors(enemy.group.position, playerPos).normalize();
        enemy.group.position.addScaledVector(kbDir, 2.2);

        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
        }
      }
    });

    setCombatAlert(
      hitCount > 0
        ? `🌪️ [TWISTING SLASH] ¡Ciclón de Acero de Dark Knight desatado! Golpeaste a ${hitCount} enemigos.`
        : '🌪️ [TWISTING SLASH] ¡Ciclón de Acero de Dark Knight desatado en 360 grados!'
    );
  };

  // Player combat functions
  const handlePlayerAttack = () => {
    if (!gameRef.current) return;
    audioSystem.playSwordSlash();
    gameRef.current.isAttacking = true;
    setTimeout(() => {
      if (gameRef.current) gameRef.current.isAttacking = false;
    }, 280);

    const playerPos = gameRef.current.player.position;
    // Trigger Ultra Slash Arc Ribbon
    vfxRef.current?.triggerSlashArc(playerPos, gameRef.current.player.rotation.y);

    // Track sword swing for Daily Quest
    setDailyQuest((prev) => {
      const nextSwings = Math.min(prev.swordSwings.target, prev.swordSwings.current + 1);
      const isCompletedNow =
        nextSwings >= prev.swordSwings.target &&
        prev.distanceMeters.current >= prev.distanceMeters.target &&
        prev.monstersKilled.current >= prev.monstersKilled.target &&
        prev.shadowsExtracted.current >= prev.shadowsExtracted.target;
      return {
        ...prev,
        swordSwings: { ...prev.swordSwings, current: nextSwings },
        isCompleted: isCompletedNow
      };
    });

    const strBonus = systemAttrs.strength * 2;
    const arch = ARCHETYPES.find((a) => a.id === currentArchetype);
    const archBonus = arch ? arch.bonusAtk : 0;
    const baseDamage = equippedWeapon?.stats?.atk ? 20 + equippedWeapon.stats.atk + strBonus + archBonus : 20 + strBonus + archBonus;

    gameRef.current.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      const dist = enemy.group.position.distanceTo(playerPos);
      if (dist < 4.2) {
        const skinBuff = r18SkinDataRef.current;
        const skinAtkMult = (1.0 + (skinBuff?.attack || 0)) * nexusResult.damageMultiplier;
        const skinCritChance = 0.28 + (skinBuff?.crit || 0) + nexusResult.critRateBonus;
        const isCrit = Math.random() < skinCritChance;
        const dmg = Math.round(calculateCombatDamage(baseDamage * skinAtkMult, isCrit));
        enemy.hp -= dmg;
        audioSystem.playHit();
        vfxRef.current?.spawnHitSparks(enemy.group.position, isCrit);

        if (skinBuff?.lifesteal && skinBuff.lifesteal > 0) {
          const lifestealHealed = Math.max(1, Math.round(dmg * skinBuff.lifesteal));
          setHp((prev) => Math.min(maxHp, prev + lifestealHealed));
        }

        setCombatAlert(`⚔️ ¡Golpeaste a ${enemy.name} infligiendo -${dmg} daño!`);

        const kbDir = new THREE.Vector3().subVectors(enemy.group.position, playerPos).normalize();
        enemy.group.position.addScaledVector(kbDir, 1.2);

        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
        }
      }
    });
  };

  const handleEnemyDefeated = (enemy: {
    id: string;
    group: THREE.Group;
    type: string;
    name: string;
  }) => {
    enemy.group.visible = false;
    audioSystem.playHit();

    const updatedKills = {
      ...killStats,
      [enemy.type]: (killStats[enemy.type] || 0) + 1
    };
    setKillStats(updatedKills);

    const xpGained = enemy.type === 'gohma' ? 250 : enemy.type === 'stalker' || enemy.type === 'mu_warrior' ? 60 : 25;
    const rupeeGained = enemy.type === 'gohma' ? 100 : 20;
    
    const prevCalc = calculateLevelAndXp(totalXp);
    const nextTotalXp = totalXp + xpGained;
    const nextCalc = calculateLevelAndXp(nextTotalXp);
    setTotalXp(nextTotalXp);
    setRupees((prev) => prev + rupeeGained);

    if (nextCalc.level > prevCalc.level) {
      audioSystem.playSystemChime();
      audioSystem.playFanfare();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.2 } });
      setSystemAttrs((prev) => ({
        ...prev,
        availablePoints: prev.availablePoints + 3
      }));
      setCombatAlert(
        `⭐ [¡SUBIDA DE NIVEL!] Has alcanzado el Nivel ${nextCalc.level}. ¡Recibiste +3 Puntos de Estado del Sistema!`
      );
    } else {
      setCombatAlert(`🌟 ¡Derrotaste a ${enemy.name}! (+${xpGained} XP, +${rupeeGained} Rupias)`);
    }

    // Spawn Fallen Shadow Vortex on the battlefield for Solo Leveling extraction
    const rankData = determineEnemyShadowRank(enemy.type);
    const newVortex: FallenShadowVortex = {
      id: `vortex_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      enemyType: enemy.type,
      enemyName: enemy.name,
      position: {
        x: enemy.group.position.x,
        y: 0.1,
        z: enemy.group.position.z
      },
      expiresAt: Date.now() + 120000,
      attemptsRemaining: 3,
      rank: rankData.rank,
      manaCost: rankData.manaCost,
      icon: rankData.icon,
      color: rankData.color
    };

    setFallenShadows((prev) => [...prev, newVortex]);

    // Track monster killed for Daily Quest
    setDailyQuest((prev) => {
      const nextKilled = Math.min(prev.monstersKilled.target, prev.monstersKilled.current + 1);
      const isCompletedNow =
        prev.swordSwings.current >= prev.swordSwings.target &&
        prev.distanceMeters.current >= prev.distanceMeters.target &&
        nextKilled >= prev.monstersKilled.target &&
        prev.shadowsExtracted.current >= prev.shadowsExtracted.target;
      return {
        ...prev,
        monstersKilled: { ...prev.monstersKilled, current: nextKilled },
        isCompleted: isCompletedNow
      };
    });

    checkAchievementsProgress(updatedKills);

    // Roll legendary / rare loot drop (MU Light Beams & Legendary World Drops)
    const drop = rollLootDrop(enemy.type, {
      x: enemy.group.position.x,
      y: 0.05,
      z: enemy.group.position.z
    });
    if (drop) {
      setWorldLootDrops((prev) => [...prev, drop]);
      if (drop.rarity === 'legendary' || drop.isJewel) {
        audioSystem.playJewelDropSound();
        audioSystem.playLegendaryDropFanfare();
        setLegendaryBanner({
          title: `¡HA CAÍDO ${drop.item.name.toUpperCase()}!`,
          item: drop.item
        });
        setTimeout(() => setLegendaryBanner(null), 5500);
        setCombatAlert(`💎 ¡DROP LEGENDARIO! ${enemy.name} ha soltado [${drop.item.name}] con un haz de luz celestial.`);
      } else {
        setCombatAlert(`✨ ¡${enemy.name} ha soltado [${drop.item.name}]!`);
      }
    }
  };

  // LOOT DROP PICKUP HANDLER (MU & Solo Leveling)
  const handleCollectLoot = (dropId?: string) => {
    const target = dropId
      ? worldLootDrops.find((d) => d.id === dropId)
      : nearbyLoot;
    if (!target) return;

    if (target.item.type === 'zen') {
      const amount = target.zenAmount || 150;
      setRupees((prev) => prev + amount);
      audioSystem.playItemPickupSound();
      setCombatAlert(`💰 ¡Recogiste ${target.item.name}! (+${amount} Zen de Lorencia)`);
    } else {
      let added = false;
      const nextSlots = [...backpackSlots];
      
      const existingIdx = nextSlots.findIndex(
        (s) => s && s.id === target.item.id && s.count < s.maxStack
      );
      if (existingIdx >= 0 && nextSlots[existingIdx]) {
        nextSlots[existingIdx] = {
          ...nextSlots[existingIdx]!,
          count: nextSlots[existingIdx]!.count + 1
        };
        added = true;
      } else {
        const emptyIdx = nextSlots.findIndex((s) => s === null);
        if (emptyIdx >= 0) {
          nextSlots[emptyIdx] = { ...target.item, count: 1 };
          added = true;
        }
      }

      if (!added) {
        setCombatAlert('⚠️ ¡Mochila llena! Libera espacio para recoger este objeto.');
        return;
      }

      setBackpackSlots(nextSlots);
      audioSystem.playItemPickupSound();

      if (target.rarity === 'legendary' || target.isJewel) {
        audioSystem.playJewelDropSound();
        confetti({ particleCount: 85, spread: 75, origin: { y: 0.25 } });
        setLegendaryBanner({ title: `¡NUEVO TESORO LEGENDARIO!`, item: target.item });
        setTimeout(() => setLegendaryBanner(null), 5500);
        setCombatAlert(`⭐ ¡TESORO LEGENDARIO OBTENIDO! [${target.item.name}] añadido a tu mochila.`);
      } else {
        setCombatAlert(`📦 ¡Obtuviste [${target.item.name}] (${target.rarity.toUpperCase()})!`);
      }
    }

    setWorldLootDrops((prev) => prev.filter((d) => d.id !== target.id));
    if (activeNearbyLootRef.current?.id === target.id) {
      activeNearbyLootRef.current = null;
      setNearbyLoot(null);
    }
    checkAchievementsProgress();
  };

  const handlePlayerDamaged = (rawDmg: number) => {
    const isBlocking = gameRef.current?.isBlocking;
    const arch = ARCHETYPES.find((a) => a.id === currentArchetype);
    const archDef = arch ? arch.bonusDef : 0;
    const def = (equippedShield?.stats?.def || 0) + Math.round(systemAttrs.vitality * 0.5) + archDef;
    const actualDmg = isBlocking
      ? Math.max(1, Math.round(rawDmg * 0.2 - def * 0.1))
      : Math.max(2, rawDmg - Math.round(def * 0.3));

    setHp((prev) => {
      const nextHp = Math.max(0, prev - actualDmg);
      if (nextHp === 0) {
        setCombatAlert('⚠️ ¡Has caído en combate! Presiona Reaparecer en el menú.');
      }
      return nextHp;
    });

    if (isBlocking) {
      setCombatAlert(`🛡️ ¡Bloqueaste con armadura pesada y escudo! Daño reducido a -${actualDmg} HP.`);
    } else {
      audioSystem.playHit();
      setCombatAlert(`💥 ¡Recibiste daño! -${actualDmg} HP.`);
    }
  };

  // Solo Leveling Shadow Extraction Attempt ("¡SURGE!" / "ARISE")
  const handleAttemptExtraction = (vortex: FallenShadowVortex) => {
    if (mana < vortex.manaCost) {
      setCombatAlert(
        `❌ Maná insuficiente para extraer sombra (requiere ${vortex.manaCost} MP).`
      );
      return;
    }

    const { level } = calculateLevelAndXp(totalXp);
    const maxCapacity = calculateShadowCapacity(systemAttrs.intelligence, level);

    if (shadowSoldiers.length >= maxCapacity) {
      setCombatAlert(
        `⚠️ Capacidad de sombras al límite (${shadowSoldiers.length}/${maxCapacity}). Aumenta INT en el Sistema o libera sombras.`
      );
      return;
    }

    setMana((prev) => prev - vortex.manaCost);
    audioSystem.playAriseChant();

    const currentAttempt = 4 - vortex.attemptsRemaining;
    const chance = calculateExtractionChance(
      level,
      systemAttrs.intelligence,
      systemAttrs.perception,
      vortex.rank,
      currentAttempt
    );

    const roll = Math.random();

    if (roll <= chance) {
      audioSystem.playExtractionSuccess();
      confetti({ particleCount: 110, spread: 80, origin: { y: 0.3 } });

      const defaultName =
        vortex.enemyType === 'gohma'
          ? 'Tarrasque Gohma de las Sombras'
          : vortex.enemyType === 'stalker'
          ? 'Asesino Espectral Rango S'
          : vortex.enemyType === 'mu_warrior'
          ? 'Caballero Caído de Lorencia (MU)'
          : vortex.enemyType === 'mu_goblin'
          ? 'Goblin Sombrío de Lorencia (MU)'
          : vortex.enemyType === 'drone'
          ? 'Dron Sheikah Sombrío'
          : 'Soldado de la Sombra';

      const newSoldier: ShadowSoldier = {
        id: `shadow_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: defaultName,
        originalEnemyType: vortex.enemyType,
        rank: vortex.rank,
        level: Math.max(1, level),
        hp: 75 + level * 15,
        maxHp: 75 + level * 15,
        atk: 24 + Math.round(systemAttrs.strength * 0.6),
        def: 18 + Math.round(systemAttrs.vitality * 0.5),
        kills: 0,
        icon: vortex.icon,
        extractedAt: currentSector,
        specialSkill: vortex.rank === 'commander' ? 'Furia del Monarca' : 'Tajo Espectral',
        color: vortex.color
      };

      setShadowSoldiers((prev) => [...prev, newSoldier]);
      setFallenShadows((prev) => prev.filter((v) => v.id !== vortex.id));
      setActiveVortexNearPlayer(null);

      setDailyQuest((prev) => {
        const nextExtracted = Math.min(prev.shadowsExtracted.target, prev.shadowsExtracted.current + 1);
        const isCompletedNow =
          prev.swordSwings.current >= prev.swordSwings.target &&
          prev.distanceMeters.current >= prev.distanceMeters.target &&
          prev.monstersKilled.current >= prev.monstersKilled.target &&
          nextExtracted >= prev.shadowsExtracted.target;
        return {
          ...prev,
          shadowsExtracted: { ...prev.shadowsExtracted, current: nextExtracted },
          isCompleted: isCompletedNow
        };
      });

      setCombatAlert(
        `🌌 ¡ARISE! "¡SURGE!" Has extraído con éxito la sombra de ${vortex.enemyName}. Ha jurado lealtad eterna al Monarca.`
      );
    } else {
      audioSystem.playExtractionFailed();
      const remaining = vortex.attemptsRemaining - 1;

      if (remaining <= 0) {
        setFallenShadows((prev) => prev.filter((v) => v.id !== vortex.id));
        setActiveVortexNearPlayer(null);
        setCombatAlert(
          `❌ La sombra de ${vortex.enemyName} no pudo soportar el maná del Monarca y se ha disipado en la nada.`
        );
      } else {
        setFallenShadows((prev) =>
          prev.map((v) => (v.id === vortex.id ? { ...v, attemptsRemaining: remaining } : v))
        );
        setCombatAlert(
          `⚠️ La sombra de ${vortex.enemyName} se resiste. Quedan ${remaining}/3 intentos de extracción.`
        );
      }
    }
  };

  // Solo Leveling Quick Shadow Burst Skill
  const performSoloLevelingShadowSkill = () => {
    if (mana < 30) {
      setCombatAlert('❌ Maná insuficiente para activar la Habilidad de Sombras (requiere 30 MP).');
      return;
    }
    setMana((prev) => prev - 30);
    audioSystem.playAriseChant();
    setCombatAlert('🌌 ¡ARISE! Manto de Sombras desatado en 360 grados.');

    if (!gameRef.current) return;
    const playerPos = gameRef.current.player.position;

    gameRef.current.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if (enemy.group.position.distanceTo(playerPos) < 14) {
        enemy.hp -= 75;
        audioSystem.playHit();
        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
        }
      }
    });
  };

  // Toggle Army Summon
  const handleToggleSummonArmy = () => {
    audioSystem.playSystemChime();
    setShadowsSummoned((prev) => {
      const next = !prev;
      setCombatAlert(
        next
          ? '🌌 ¡SURJAN! El Ejército de las Sombras emerge al campo de batalla.'
          : '🌑 Las sombras se refugian en tu silueta. Regeneración y velocidad aumentadas.'
      );
      return next;
    });
  };

  // Activate Monarch Domain
  const handleActivateMonarchDomain = () => {
    if (mana < 45) {
      setCombatAlert('❌ Maná insuficiente para Dominio del Monarca (requiere 45 MP).');
      return;
    }
    setMana((prev) => prev - 45);
    audioSystem.playAriseChant();
    setMonarchDomainActive(true);
    setCombatAlert(
      '👑 [DOMINIO DEL MONARCA] ¡El suelo se ha teñido de negro abisal! El daño de tus tropas aumenta +50%.'
    );
    setTimeout(() => {
      setMonarchDomainActive(false);
      setCombatAlert('👑 El Dominio del Monarca se ha disipado.');
    }, 18000);
  };

  // Stat Point Allocation in Solo Leveling System
  const handleAddStatPoint = (
    stat: keyof Pick<SystemAttributes, 'strength' | 'vitality' | 'agility' | 'intelligence' | 'perception'>
  ) => {
    if (systemAttrs.availablePoints <= 0) return;
    audioSystem.playStatPointUp();
    setSystemAttrs((prev) => ({
      ...prev,
      [stat]: prev[stat] + 1,
      availablePoints: prev.availablePoints - 1
    }));

    if (stat === 'vitality') {
      setHp((p) => p + 10);
    }
    if (stat === 'intelligence') {
      setMana((p) => p + 8);
    }

    setCombatAlert(
      `⭐ [SISTEMA] Has aumentado tu ${stat.toUpperCase()} a ${systemAttrs[stat] + 1}!`
    );
  };

  // Claim Daily Quest Reward
  const handleClaimDailyQuest = () => {
    if (!dailyQuest.isCompleted || dailyQuest.rewardClaimed) return;
    audioSystem.playFanfare();
    confetti({ particleCount: 100, spread: 75, origin: { y: 0.25 } });

    setSystemAttrs((prev) => ({
      ...prev,
      availablePoints: prev.availablePoints + dailyQuest.rewards.statPoints
    }));
    setRupees((prev) => prev + dailyQuest.rewards.rupees);
    setTotalXp((prev) => prev + dailyQuest.rewards.xp);

    setBackpackSlots((prev) => {
      const copy = [...prev];
      const emptyIdx = copy.findIndex((s) => s === null);
      if (emptyIdx !== -1) {
        copy[emptyIdx] = {
          id: 'rasaka_fang',
          name: 'Daga Colmillo de Rasaka',
          type: 'weapon',
          icon: '🗡️',
          rarity: 'legendary',
          description: 'Arma legendaria extraída de la primera Mazmorra Instantánea del Sistema. Causa parálisis y hemorragia.',
          count: 1,
          maxStack: 1,
          stats: { atk: 35 }
        };
      }
      return copy;
    });

    setDailyQuest((prev) => ({
      ...prev,
      rewardClaimed: true
    }));

    setCombatAlert(
      `🎁 [SISTEMA] ¡Misión Diaria completada! Recibiste +3 Puntos de Estado, +150 Rupias y la legendaria Daga Colmillo de Rasaka.`
    );
  };

  // Rename Shadow Soldier
  const handleRenameShadow = (id: string, newName: string) => {
    audioSystem.playSystemChime();
    setShadowSoldiers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
    );
    setCombatAlert(`✏️ Soldado de sombra renombrado a: ${newName}`);
  };

  // Release Shadow Soldier
  const handleReleaseShadow = (id: string) => {
    audioSystem.playExtractionFailed();
    const target = shadowSoldiers.find((s) => s.id === id);
    setShadowSoldiers((prev) => prev.filter((s) => s.id !== id));
    setCombatAlert(
      `🌑 Has liberado la sombra de ${target?.name || 'soldado'} de tu ejército.`
    );
  };

  // Switch Archetype
  const handleSelectArchetype = (arch: PlayerArchetype) => {
    setCurrentArchetype(arch);
    audioSystem.playSystemChime();
    const config = ARCHETYPES.find((a) => a.id === arch);
    setCombatAlert(`⚔️ ¡Clase activada: ${config?.name}! Bonificación aplicada.`);
    setActiveMenuTab(null);
  };

  // Consumables Quick Use
  const useQuickPotion = (itemId: string) => {
    const slotIdx = backpackSlots.findIndex((s) => s?.id === itemId);
    if (slotIdx === -1) {
      setCombatAlert(`❌ No tienes pociones de este tipo en la mochila.`);
      return;
    }
    const item = backpackSlots[slotIdx];
    if (!item) return;

    if (itemId === 'health_potion') {
      setHp((prev) => Math.min(maxHp, prev + 50));
      audioSystem.playHeal();
      setCombatAlert('🧪 ¡Bebiste Elixir Carmesí! Restauraste +50 HP.');
    } else if (itemId === 'mana_potion') {
      setMana((prev) => Math.min(maxMana, prev + 60));
      audioSystem.playHeal();
      setCombatAlert('💧 ¡Bebiste Elixir Índigo! Restauraste +60 Maná.');
    }

    setBackpackSlots((prev) => {
      const copy = [...prev];
      if (item.count > 1) {
        copy[slotIdx] = { ...item, count: item.count - 1 };
      } else {
        copy[slotIdx] = null;
      }
      return copy;
    });
  };

  const detonateBomb = () => {
    const slotIdx = backpackSlots.findIndex((s) => s?.id === 'nanobomb');
    if (slotIdx === -1) {
      setCombatAlert('❌ No tienes Bombas de Nanobots en tu inventario.');
      return;
    }
    const item = backpackSlots[slotIdx];
    if (!item) return;

    audioSystem.playBombExplode();
    setCombatAlert('💣 ¡BOMBA DETONADA! Onda expansiva de plasma generada (-75 daño AoE).');

    if (gameRef.current) {
      const playerPos = gameRef.current.player.position;
      gameRef.current.enemies.forEach((enemy) => {
        if (enemy.hp <= 0) return;
        const dist = enemy.group.position.distanceTo(playerPos);
        if (dist < 12.0) {
          enemy.hp -= 75;
          if (enemy.hp <= 0) {
            handleEnemyDefeated(enemy);
          }
        }
      });
    }

    setBackpackSlots((prev) => {
      const copy = [...prev];
      if (item.count > 1) {
        copy[slotIdx] = { ...item, count: item.count - 1 };
      } else {
        copy[slotIdx] = null;
      }
      return copy;
    });
  };

  // Toggle Z-Targeting (Zelda lock-on)
  const toggleZTarget = () => {
    if (!gameRef.current) return;
    if (gameRef.current.targetEnemyId) {
      gameRef.current.targetEnemyId = null;
      setIsZTargeting(false);
      setTargetEnemyName(null);
      setCombatAlert('🎯 Z-Targeting desactivado.');
      return;
    }

    const playerPos = gameRef.current.player.position;
    let closestEnemy: typeof gameRef.current.enemies[0] | null = null;
    let minDistance = 30;

    gameRef.current.enemies.forEach((enemy) => {
      if (enemy.hp > 0) {
        const d = enemy.group.position.distanceTo(playerPos);
        if (d < minDistance) {
          minDistance = d;
          closestEnemy = enemy;
        }
      }
    });

    if (closestEnemy) {
      const enemyObj = closestEnemy as { id: string; name: string };
      gameRef.current.targetEnemyId = enemyObj.id;
      setIsZTargeting(true);
      setTargetEnemyName(enemyObj.name);
      setCombatAlert(`🎯 ¡Objetivo fijado: ${enemyObj.name}!`);
    } else {
      centerCameraBehindPlayer();
      setCombatAlert('🎯 Sin objetivos cercanos: Cámara reajustada.');
    }
  };

  // Tap-to-Equip & Drag-and-Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

    setBackpackSlots((prev) => {
      const copy = [...prev];
      const dragged = copy[draggedItemIndex];
      const target = copy[targetIndex];
      copy[targetIndex] = dragged;
      copy[draggedItemIndex] = target;
      return copy;
    });
    setDraggedItemIndex(null);
  };

  const handleDropOnEquip = (e: React.DragEvent, equipType: 'weapon' | 'shield' | 'relic') => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    const item = backpackSlots[draggedItemIndex];
    if (!item) return;

    if (item.type !== equipType) {
      setCombatAlert(`⚠️ Este objeto no se puede equipar en la ranura de ${equipType}.`);
      return;
    }

    equipItemFromBackpack(item, draggedItemIndex, equipType);
    setDraggedItemIndex(null);
  };

  const equipItemFromBackpack = (
    item: InventoryItem,
    backpackIndex: number,
    equipType: 'weapon' | 'shield' | 'relic'
  ) => {
    let currentEquipped: InventoryItem | null = null;
    if (equipType === 'weapon') {
      currentEquipped = equippedWeapon;
      setEquippedWeapon(item);
    } else if (equipType === 'shield') {
      currentEquipped = equippedShield;
      setEquippedShield(item);
    } else if (equipType === 'relic') {
      currentEquipped = equippedRelic;
      setEquippedRelic(item);
    }

    setBackpackSlots((prev) => {
      const copy = [...prev];
      copy[backpackIndex] = currentEquipped;
      return copy;
    });

    setSelectedItem(null);
    setCombatAlert(`⚔️ ¡Equipaste ${item.name}!`);
    setTimeout(() => checkAchievementsProgress(), 100);
  };

  const unequipItem = (equipType: 'weapon' | 'shield' | 'relic') => {
    let itemToUnequip: InventoryItem | null = null;
    if (equipType === 'weapon') {
      itemToUnequip = equippedWeapon;
      setEquippedWeapon(null);
    } else if (equipType === 'shield') {
      itemToUnequip = equippedShield;
      setEquippedShield(null);
    } else if (equipType === 'relic') {
      itemToUnequip = equippedRelic;
      setEquippedRelic(null);
    }

    if (!itemToUnequip) return;

    const emptyIndex = backpackSlots.findIndex((s) => s === null);
    if (emptyIndex !== -1) {
      setBackpackSlots((prev) => {
        const copy = [...prev];
        copy[emptyIndex] = itemToUnequip;
        return copy;
      });
      setCombatAlert(`🎒 Desequipaste ${itemToUnequip.name}.`);
    } else {
      setCombatAlert(`❌ Mochila llena. No se puede desequipar.`);
    }
    setSelectedItem(null);
  };

  const filteredBestiary = BESTIARY_DATA.filter((entry) => {
    const matchesCategory = bestiaryFilter === 'all' || entry.category === bestiaryFilter;
    const matchesSearch =
      entry.name.toLowerCase().includes(bestiarySearch.toLowerCase()) ||
      entry.lore.toLowerCase().includes(bestiarySearch.toLowerCase()) ||
      entry.weakness.toLowerCase().includes(bestiarySearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredAchievements = achievements.filter((ach) => {
    if (achievementFilter === 'all') return true;
    return ach.category === achievementFilter;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const { level, currentXp, nextLevelXp } = calculateLevelAndXp(totalXp);
  const activeArchConfig = ARCHETYPES.find((a) => a.id === currentArchetype) || ARCHETYPES[0];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none touch-none"
      onTouchStart={handleScreenTouchStart}
      onTouchMove={handleScreenTouchMove}
      onTouchEnd={handleScreenTouchEnd}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-crosshair z-0" />

      {/* CINEMATIC WIDESCREEN LETTERBOX BARS (2.39:1 ASPECT RATIO) */}
      {isCinematicView && (
        <>
          <div className="fixed top-0 inset-x-0 h-10 sm:h-14 bg-black/95 z-20 pointer-events-none transition-all duration-300 border-b border-amber-500/20 shadow-2xl" />
          <div className="fixed bottom-0 inset-x-0 h-10 sm:h-14 bg-black/95 z-20 pointer-events-none transition-all duration-300 border-t border-amber-500/20 shadow-2xl" />
        </>
      )}

      {/* TOP FLOATING NOTIFICATION BANNER (LOGROS DEL HÉROE) */}
      {unlockedBanner && (
        <div
          onClick={() => setActiveMenuTab('achievements')}
          className="absolute top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 sm:px-6 sm:py-3.5 bg-gradient-to-r from-emerald-950/95 via-amber-950/90 to-slate-950/95 border-2 border-amber-400 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.35)] backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300 animate-bounce max-w-[92vw]"
        >
          <div className="text-3xl sm:text-4xl filter drop-shadow">{unlockedBanner.icon}</div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 font-cinzel">
                ¡Logro Desbloqueado!
              </span>
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
            </div>
            <h4 className="text-sm sm:text-base font-black text-white font-cinzel truncate">
              {unlockedBanner.title}
            </h4>
            <p className="text-[10px] sm:text-xs text-emerald-200 truncate">{unlockedBanner.description}</p>
          </div>
        </div>
      )}

      {/* TOP FLOATING NOTIFICATION: LEGENDARY LOOT DROP BANNER (MU & SOLO LEVELING) */}
      {legendaryBanner && (
        <div
          onClick={() => setActiveMenuTab('inventory')}
          className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-amber-950/95 via-yellow-950/90 to-purple-950/95 border-2 border-amber-300 rounded-2xl shadow-[0_0_35px_rgba(251,191,36,0.6)] backdrop-blur-md cursor-pointer hover:scale-105 transition-all duration-300 animate-in fade-in slide-in-from-top-4 max-w-[94vw]"
        >
          <div className="text-3xl sm:text-4xl filter drop-shadow animate-pulse">{legendaryBanner.item.icon}</div>
          <div className="truncate">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 font-cinzel">
                {legendaryBanner.title}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin shrink-0" />
            </div>
            <h4 className="text-sm sm:text-base font-black text-amber-100 font-cinzel truncate">
              {legendaryBanner.item.name}
            </h4>
            <p className="text-[10px] sm:text-xs text-amber-200/90 truncate">
              {legendaryBanner.item.description}
            </p>
          </div>
        </div>
      )}

      {/* MOBILE PORTRAIT ORIENTATION NOTICE */}
      {viewportMode.isMobile && !viewportMode.isLandscape && showRotatePrompt && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-3.5 py-2 bg-gradient-to-r from-amber-950/95 via-slate-950/95 to-slate-950/95 border-2 border-amber-400/80 rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-md max-w-[92vw] pointer-events-auto animate-bounce">
          <div className="text-xl sm:text-2xl animate-spin" style={{ animationDuration: '4s' }}>🔄</div>
          <div className="text-left">
            <div className="text-[11px] sm:text-xs font-black text-amber-300 font-cinzel leading-tight">
              Voltea tu teléfono a horizontal
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-300 leading-tight">
              Se activará la Vista Panorámica Ultra 76° (en PC es normal).
            </div>
          </div>
          <button
            onClick={() => setShowRotatePrompt(false)}
            className="ml-1 p-1 text-slate-400 hover:text-white text-xs rounded-lg bg-slate-800"
            title="Cerrar aviso"
          >
            ✕
          </button>
        </div>
      )}

      {/* TOP HUD: NEXX KONI v9.2 SCI-FI INTERFACE MATCHING REFERENCE DESIGN */}
      <header className="absolute top-0 inset-x-0 z-30 p-2 sm:p-3 pointer-events-none flex flex-wrap items-start justify-between gap-2">
        {/* Left: Angled Cyber Vitality Frame (VIDA 100/100 & MP) */}
        <div className="pointer-events-auto flex items-start gap-2 sm:gap-3 bg-slate-950/85 p-2 sm:p-2.5 rounded-2xl border-2 border-cyan-500/50 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.35)]">
          <div
            onClick={() => setActiveMenuTab('class')}
            className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-slate-950 flex items-center justify-center border-2 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)] shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            title="Cambiar Arquetipo / Clase"
          >
            <span className="text-2xl sm:text-3xl">{activeArchConfig.icon}</span>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full border border-slate-900 shadow">
              Nv.{level}
            </span>
          </div>

          <div className="space-y-1 w-36 sm:w-48">
            {/* VIDA Header & Value */}
            <div className="flex items-center justify-between font-black font-rajdhani leading-none tracking-wider text-cyan-300">
              <span className="text-xs sm:text-sm uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] flex items-center gap-1">
                VIDA
              </span>
              <span className="text-xs sm:text-sm font-mono text-white drop-shadow">
                {hp}/{maxHp}
              </span>
            </div>

            {/* Glowing Turquoise/Cyan Health Bar */}
            <div className="w-full h-2 sm:h-2.5 bg-slate-900 rounded-full overflow-hidden border border-cyan-400/60 p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-300 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                style={{ width: `${(hp / maxHp) * 100}%` }}
              />
            </div>

            {/* Sub-gauge: Hearts & Mana Bar */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-cyan-200">
                <Heart className="w-3 h-3 text-cyan-400 fill-cyan-400 animate-pulse" />
                <span>{hp}/{maxHp}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-mono text-sky-300">
                <Droplets className="w-2.5 h-2.5 text-sky-400 fill-sky-400" />
                <span>{mana}/{maxMana}</span>
              </div>
            </div>

            {/* Mana Bar */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-sky-500/40">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-indigo-400 transition-all duration-300 rounded-full"
                style={{ width: `${(mana / maxMana) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: NEXX KONI v9.2 Header & 9.5 Hz Oscilloscope Box */}
        <div className="pointer-events-auto flex flex-col items-center gap-1 max-w-[92vw]">
          {/* Main Title Badge */}
          <div className="flex flex-col items-center">
            <h1 className="text-base sm:text-xl md:text-2xl font-black font-cinzel tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-cyan-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] uppercase">
              NEXX KONI v9.2
            </h1>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-cyan-300 uppercase opacity-90">
              MODO: MUNDO ABIERTO — HUD ACTIVO
            </span>
          </div>

          {/* Chamfered Frequency 9.5 Hz Box with Animated ECG Wave */}
          <div className="bg-slate-950/90 px-3 py-1.5 rounded-2xl border-2 border-purple-500/60 backdrop-blur-xl shadow-[0_0_25px_rgba(168,85,247,0.4)] flex flex-col items-center min-w-[200px] sm:min-w-[260px]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black font-rajdhani tracking-wider text-purple-200">
              <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>FRECUENCIA <strong className="text-cyan-300">9.5 Hz</strong></span>
            </div>

            {/* Sacred 3-6-9-5 Harmonic String */}
            <div className="text-[10px] font-mono font-black tracking-[0.3em] text-amber-300 py-0.5">
              - 3 - 6 - 9 - 5 -
            </div>

            {/* Live SVG Oscilloscope ECG Wave */}
            <svg viewBox="0 0 200 20" className="w-44 sm:w-56 h-4 text-cyan-400 filter drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,10 25,10 32,10 37,2 42,18 47,5 52,14 57,10 95,10 102,10 107,3 112,17 117,10 155,10 162,10 167,4 172,16 177,10 200,10"
                className="animate-pulse"
              />
            </svg>
          </div>
        </div>

        {/* Right: Concentric Minimap Radar & Quick Navigation */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          {/* Concentric Radar Box */}
          <div className="bg-slate-950/90 p-2 rounded-2xl border-2 border-purple-500/50 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] flex flex-col items-center w-28 sm:w-32">
            <div className="text-[9px] font-black font-mono tracking-widest text-purple-300 uppercase">
              MINIMAPA
            </div>

            {/* Concentric Circle Radar */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-purple-500/40 bg-slate-900/90 flex items-center justify-center my-1 overflow-hidden">
              {/* Range rings */}
              <div className="absolute inset-2 rounded-full border border-purple-400/30" />
              <div className="absolute inset-5 rounded-full border border-purple-400/30" />
              {/* Crosshair axes */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-purple-500/30" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-purple-500/30" />

              {/* North Marker */}
              <span className="absolute top-0.5 text-[8px] font-black font-mono text-cyan-300">N</span>
              <span className="absolute top-3 text-[7px] font-mono text-slate-400">3</span>
              <span className="absolute top-6 text-[7px] font-mono text-slate-400">6</span>
              <span className="absolute bottom-1 text-[7px] font-mono text-slate-400">9</span>

              {/* Center Player Beacon */}
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_rgba(34,211,238,1)] animate-ping" />
              <div className="w-1.5 h-1.5 rounded-full bg-white z-10" />
            </div>

            <span className="text-[8px] font-black font-mono text-purple-300 tracking-wider">
              ANILLOS 3-6-9
            </span>

            {/* Sector & Currencies */}
            <div className="text-[8px] font-mono text-slate-300 text-center truncate w-full mt-0.5">
              NV.{level} · {currentWorldId === 'tundra_cristal' ? 'TUNDRA' : currentWorldId === 'desierto_dorado' ? 'DESIERTO' : 'YERMO'}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-amber-300 mt-0.5">
              <span>💎 5</span>
              <span>🪙 {rupees}z</span>
            </div>
          </div>

          {/* Quick Menu Nav Buttons Row */}
          <div className="flex items-center gap-1 max-w-[55vw] sm:max-w-none overflow-x-auto no-scrollbar py-0.5">
            {/* World Selector Button */}
            <button
              onClick={() => setIsWorldModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r from-sky-950 to-slate-900 border border-cyan-400/60 text-cyan-300 hover:brightness-110 active:scale-95 text-[10px] font-black font-mono shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              title="Selección de Mundos Habitables (Tecla W)"
            >
              <span>🌍</span>
              <span className="hidden sm:inline">MUNDOS</span>
            </button>

            {/* Manual Nexx Koni Button */}
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r from-amber-950 to-slate-900 border border-amber-400/60 text-amber-300 hover:brightness-110 active:scale-95 text-[10px] font-black font-mono shadow-[0_0_12px_rgba(251,191,36,0.4)]"
              title="Manual Nexx Koni v9.2 (Tecla K)"
            >
              <span>📖</span>
              <span className="hidden sm:inline">MANUAL</span>
            </button>

            {/* Class Selection Button */}
            <button
              onClick={() => setActiveMenuTab((p) => (p === 'class' ? null : 'class'))}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/90 border border-purple-400/60 text-purple-300 hover:brightness-110 active:scale-95 text-[10px] font-black font-mono shadow"
              title="Selección de Personajes (5 Pedestales)"
            >
              <span>⚔️</span>
              <span className="hidden sm:inline">CLASE</span>
            </button>

            {/* Matriz Omega Button */}
            <button
              onClick={() => setIsNexusModalOpen((p) => !p)}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-900/90 border border-fuchsia-400/60 text-fuchsia-300 hover:brightness-110 active:scale-95 text-[10px] font-black font-mono shadow"
              title="Matriz Nexus N_Ω (Tecla N)"
            >
              <span>🌀</span>
              <span className="hidden md:inline">Ω</span>
            </button>

            {/* Sistema Holográfico Button */}
            <button
              onClick={() => {
                audioSystem.playSystemChime();
                setActiveMenuTab((p) => (p === 'system' ? null : 'system'));
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r from-cyan-950 to-blue-950 border border-cyan-400 text-cyan-200 active:scale-95 text-[10px] font-black font-mono shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              title="Sistema Solo Leveling"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span className="hidden md:inline">SISTEMA</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled((p) => !p)}
              className="p-1 sm:p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 active:scale-95"
              title={soundEnabled ? 'Silenciar Sonido' : 'Activar Sonido'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MU 3D NEXUS R21 TARGET PANEL (Top Right) */}
      <div className="absolute top-16 sm:top-20 right-2 sm:right-4 z-20 pointer-events-none w-52 sm:w-64 p-2.5 sm:p-3 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span className="truncate">{selectedEnemyForHud ? selectedEnemyForHud.name : 'Campo de Entrenamiento'}</span>
          <span className="text-[10px] font-mono text-amber-400">
            {selectedEnemyForHud ? `${Math.ceil(selectedEnemyForHud.hp)}/${selectedEnemyForHud.maxHp}` : 'MU 3D R21'}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-1.5 border border-rose-950">
          <div
            className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-150 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]"
            style={{
              width: selectedEnemyForHud
                ? `${Math.max(0, Math.min(100, (selectedEnemyForHud.hp / selectedEnemyForHud.maxHp) * 100))}%`
                : '0%'
            }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1">
          <span>{selectedEnemyForHud ? selectedEnemyForHud.weakness : 'Fija un monstruo'}</span>
          <span className="text-cyan-400">{selectedEnemyForHud ? `${Math.round(selectedEnemyForHud.dist)}m` : 'NEXUS'}</span>
        </div>
      </div>

      {/* COMBAT ALERT NOTIFICATION */}
      {combatAlert && (
        <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-3.5 py-1.5 bg-slate-950/85 border border-amber-500/40 rounded-full text-[11px] sm:text-xs text-amber-200 backdrop-blur-md shadow-md text-center max-w-[90vw] truncate">
          {combatAlert}
        </div>
      )}

      {/* SHADOW EXTRACTION INTERACTIVE PROMPT (ARISE) */}
      {!activeMenuTab && !isNexusModalOpen && (
        <ShadowExtractionPrompt
          vortex={activeVortexNearPlayer}
          playerMana={mana}
          playerLevel={level}
          intelligence={systemAttrs.intelligence}
          perception={systemAttrs.perception}
          onAttemptExtraction={handleAttemptExtraction}
          onDismiss={() => setActiveVortexNearPlayer(null)}
        />
      )}

      {/* INTERACTIVE NEARBY LOOT PICKUP PROMPT (MU & SOLO LEVELING) */}
      {!activeMenuTab && !isNexusModalOpen && nearbyLoot && (
        <div
          className={`fixed ${
            activeVortexNearPlayer ? 'bottom-52 sm:bottom-56' : 'bottom-24 sm:bottom-28'
          } left-1/2 -translate-x-1/2 z-[60] w-[92%] sm:w-auto sm:min-w-[380px] max-w-lg select-none animate-in slide-in-from-bottom-6 duration-200 pointer-events-auto`}
        >
          <div
            onClick={() => handleCollectLoot(nearbyLoot.id)}
            className={`p-3 sm:p-4 rounded-2xl border-2 backdrop-blur-xl shadow-2xl cursor-pointer hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-between gap-3 ${
              nearbyLoot.rarity === 'legendary'
                ? 'bg-amber-950/90 border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.6)]'
                : nearbyLoot.rarity === 'epic'
                ? 'bg-purple-950/90 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                : 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-950/80 border border-white/20 flex items-center justify-center text-2xl sm:text-3xl shrink-0 shadow-inner">
                {nearbyLoot.item.icon}
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 border border-white/20 text-amber-300 font-mono">
                    {nearbyLoot.rarity.toUpperCase()}
                  </span>
                  {nearbyLoot.isJewel && (
                    <span className="text-[9px] sm:text-[10px] font-bold text-cyan-300">
                      💎 JOYA MÍSTICA
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-black text-white font-cinzel truncate mt-0.5">
                  {nearbyLoot.item.name}
                </h4>
                <p className="text-[10px] text-slate-300 truncate">
                  {nearbyLoot.item.type === 'zen'
                    ? `+${nearbyLoot.zenAmount || 150} Zen de Lorencia`
                    : nearbyLoot.item.stats?.atk
                    ? `+${nearbyLoot.item.stats.atk} ATK · ${nearbyLoot.item.description}`
                    : nearbyLoot.item.description}
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCollectLoot(nearbyLoot.id);
              }}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black font-cinzel text-xs sm:text-sm shadow-[0_0_15px_rgba(251,191,36,0.8)] hover:brightness-110 active:scale-95 shrink-0 flex items-center gap-1"
            >
              <span>RECOGER</span>
              <span className="hidden sm:inline text-[10px] font-mono opacity-80">[F]</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 🐺 PAQUETE DE LOS 3 LOBOS (MID-LEFT CYBER WIDGET - IMAGE 3)     */}
      {/* ============================================================== */}
      <div className="fixed left-2 sm:left-4 top-28 sm:top-36 z-20 pointer-events-auto">
        <div
          onClick={handleToggleWolfPack}
          className="bg-slate-950/90 p-2 sm:p-2.5 rounded-2xl border-2 border-amber-400/70 backdrop-blur-xl shadow-[0_0_25px_rgba(251,191,36,0.35)] cursor-pointer hover:border-amber-300 transition-all group"
          title="Alternar Modo de Combate de la Manada de Lobos (Flanco / Ataque / Guardia)"
        >
          {/* Header Badge */}
          <div className="flex items-center justify-between gap-2 border-b border-amber-500/40 pb-1 mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-black font-cinzel tracking-wider text-amber-300 uppercase">
              PAQUETE DE LOS 3 LOBOS
            </span>
            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
              {wolfPackMode.toUpperCase()}
            </span>
          </div>

          {/* 3 Wolf Companion Portraits */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wolf 1: Lobo Blanco Escudo */}
            <div className="relative flex flex-col items-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border-2 border-cyan-400/80 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_10px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform">
                🛡️
              </div>
              <span className="text-[7px] font-mono text-cyan-200 mt-0.5">ESCUDO</span>
            </div>

            {/* Wolf 2: Lobo Blanco Alfa Hub */}
            <div className="relative flex flex-col items-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border-2 border-amber-400/80 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_10px_rgba(251,191,36,0.5)] group-hover:scale-105 transition-transform">
                🐺
              </div>
              <span className="text-[7px] font-mono text-amber-200 mt-0.5">ALFA</span>
            </div>

            {/* Wolf 3: Lobo Púrpura Oráculo */}
            <div className="relative flex flex-col items-center">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900 border-2 border-purple-400/80 flex items-center justify-center text-lg sm:text-xl shadow-[0_0_10px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
                🔮
              </div>
              <span className="text-[7px] font-mono text-purple-200 mt-0.5">ORÁCULO</span>
            </div>
          </div>

          {/* Bottom Active Badge */}
          <div className="mt-1.5 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[8px] font-mono">
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ACTIVO
            </span>
            <span className="text-amber-300 font-black">3/3</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MOBILE CONTROLS & NEXX KONI v9.2 BOTTOM ACTION BAR (IMAGE 3)   */}
      {/* ============================================================== */}
      <footer className="absolute bottom-2 sm:bottom-4 inset-x-2 sm:inset-x-4 z-20 pointer-events-none flex flex-col sm:flex-row items-center sm:items-end justify-between gap-2">
        {/* LEFT POD: JOYSTICK (Mobile) & QUICK POTIONS */}
        <div className="pointer-events-auto flex items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
          {/* Quick Consumables */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1 sm:p-1.5 rounded-2xl border-2 border-slate-800/90 backdrop-blur-md shadow-xl">
            <button
              onClick={() => useQuickPotion('health_potion')}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-rose-500/50 flex flex-col items-center justify-center text-xs sm:text-sm active:scale-90"
              title="Restaurar Salud (HP)"
            >
              <span>🧪</span>
              <span className="absolute -top-1 -right-1 bg-rose-600 text-[8px] font-black text-white px-1 rounded-full">
                {backpackSlots.find((s) => s?.id === 'health_potion')?.count || 0}
              </span>
            </button>

            <button
              onClick={() => useQuickPotion('mana_potion')}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-sky-500/50 flex flex-col items-center justify-center text-xs sm:text-sm active:scale-90"
              title="Restaurar Maná (MP)"
            >
              <span>💧</span>
              <span className="absolute -top-1 -right-1 bg-sky-600 text-[8px] font-black text-white px-1 rounded-full">
                {backpackSlots.find((s) => s?.id === 'mana_potion')?.count || 0}
              </span>
            </button>

            <button
              onClick={() => setIsSprinting((p) => !p)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border flex flex-col items-center justify-center text-xs active:scale-90 ${
                isSprinting ? 'bg-amber-500 text-slate-950 border-white' : 'bg-slate-900 text-amber-400 border-amber-500/40'
              }`}
              title="Alternar Correr / Caminar"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Touch Joystick (Always available for mobile touch control) */}
          <div
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-500/50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center touch-none select-none sm:hidden"
            onTouchStart={handleJoystickTouchStart}
            onTouchMove={handleJoystickTouchMove}
            onTouchEnd={handleJoystickTouchEnd}
            onTouchCancel={handleJoystickTouchEnd}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/20 pointer-events-none" />
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center pointer-events-none transition-transform duration-75 border-2 shadow-xl ${
                joystickActive ? 'bg-emerald-400 border-white scale-110' : 'bg-emerald-600 border-emerald-300'
              }`}
              style={{ transform: `translate(${joystickKnob.x}px, ${joystickKnob.y}px)` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CENTER DOCK: NEXX KONI v9.2 3-CLUSTER ACTION DOCK (IMAGE 3)    */}
        {/* ============================================================== */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto max-w-[96vw] no-scrollbar py-1">
          {/* CLUSTER 1: ESPADA, ESCUDO, MANUAL NEXX KONI (Gold Chamfer) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 p-1 sm:p-1.5 rounded-2xl border-2 border-amber-500/60 backdrop-blur-xl shadow-[0_0_20px_rgba(251,191,36,0.35)] shrink-0">
            {/* Espada Primary Attack */}
            <button
              onClick={handlePlayerAttack}
              className="flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-amber-600 to-amber-950 border border-amber-300 text-amber-200 active:scale-95 hover:brightness-110 transition-all shadow-[0_0_12px_rgba(245,158,11,0.5)] group"
              title="Atacar con Espada (Clic o Espacio)"
            >
              <span className="text-xl sm:text-2xl group-active:rotate-45 transition-transform">🗡️</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5">ESPADA</span>
            </button>

            {/* Escudo Block */}
            <button
              onMouseDown={() => { if (gameRef.current) gameRef.current.isBlocking = true; }}
              onMouseUp={() => { if (gameRef.current) gameRef.current.isBlocking = false; }}
              onTouchStart={(e) => { e.stopPropagation(); if (gameRef.current) gameRef.current.isBlocking = true; }}
              onTouchEnd={(e) => { e.stopPropagation(); if (gameRef.current) gameRef.current.isBlocking = false; }}
              className="flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-blue-900 to-slate-950 border border-blue-400 text-blue-200 active:scale-95 hover:brightness-110 transition-all shadow"
              title="Bloquear con Escudo (Mantener Clic)"
            >
              <span className="text-xl sm:text-2xl">🛡️</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5">ESCUDO</span>
            </button>

            {/* Manual Nexx Koni Book */}
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-indigo-950 to-slate-950 border border-amber-400/70 text-amber-300 active:scale-95 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              title="Abrir Manual Nexx Koni v9.2 (Tecla K)"
            >
              <span className="text-xl sm:text-2xl animate-pulse">📖</span>
              <span className="text-[7px] sm:text-[8px] font-black font-cinzel uppercase tracking-tighter mt-0.5 text-center leading-tight">
                MANUAL<br/>NEXX KONI
              </span>
            </button>
          </div>

          {/* CLUSTER 2: 4 QUANTUM ABILITIES [FORJA, VERIFICA, ACELERA, MATERIALIZA] (Cyan/Hexagonal) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 p-1 sm:p-1.5 rounded-2xl border-2 border-cyan-400/80 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] shrink-0">
            {/* Forja [J] */}
            <button
              onClick={handleSkillForja}
              className={`flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl border text-cyan-200 active:scale-95 transition-all shadow ${
                activeSkillBuffs.forja
                  ? 'bg-amber-500 border-white text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse'
                  : 'bg-gradient-to-b from-cyan-950 to-slate-950 border-cyan-400/60 hover:brightness-110'
              }`}
              title="Habilidad: Forja (+30 ATK y Furia Ígnea) [Tecla J]"
            >
              <span className="text-xl sm:text-2xl">🔨</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5">FORJA</span>
              <span className="text-[7px] font-mono text-cyan-300 opacity-75">[J]</span>
            </button>

            {/* Verifica [X] */}
            <button
              onClick={handleSkillVerifica}
              className={`flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl border text-cyan-200 active:scale-95 transition-all shadow ${
                activeSkillBuffs.verifica
                  ? 'bg-emerald-500 border-white text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.9)] animate-pulse'
                  : 'bg-gradient-to-b from-cyan-950 to-slate-950 border-cyan-400/60 hover:brightness-110'
              }`}
              title="Habilidad: Verifica (+20 DEF y Escaneo de Debilidades) [Tecla X]"
            >
              <span className="text-xl sm:text-2xl">☑️</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5">VERIFICA</span>
              <span className="text-[7px] font-mono text-cyan-300 opacity-75">[X]</span>
            </button>

            {/* Acelera [Z] */}
            <button
              onClick={handleSkillAcelera}
              className={`flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl border text-cyan-200 active:scale-95 transition-all shadow ${
                activeSkillBuffs.acelera
                  ? 'bg-cyan-400 border-white text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.9)] animate-pulse'
                  : 'bg-gradient-to-b from-cyan-950 to-slate-950 border-cyan-400/60 hover:brightness-110'
              }`}
              title="Habilidad: Acelera (+60% Velocidad Cuántica) [Tecla Z]"
            >
              <span className="text-xl sm:text-2xl">⚡</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5">ACELERA</span>
              <span className="text-[7px] font-mono text-cyan-300 opacity-75">[Z]</span>
            </button>

            {/* Materializa [Q] */}
            <button
              onClick={handleSkillMaterializa}
              className={`flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl border text-cyan-200 active:scale-95 transition-all shadow ${
                activeSkillBuffs.materializa
                  ? 'bg-fuchsia-500 border-white text-slate-950 shadow-[0_0_20px_rgba(217,70,239,0.9)] animate-pulse'
                  : 'bg-gradient-to-b from-purple-950 to-slate-950 border-purple-400/60 hover:brightness-110'
              }`}
              title="Habilidad: Materializa (Regenera HP/MP y Condensa Materia) [Tecla Q]"
            >
              <span className="text-xl sm:text-2xl">🔮</span>
              <span className="text-[7px] sm:text-[8px] font-black font-cinzel uppercase tracking-tighter mt-0.5 text-center leading-tight">MATERIALIZA</span>
              <span className="text-[7px] font-mono text-purple-300 opacity-75">[Q]</span>
            </button>
          </div>

          {/* CLUSTER 3: CICLÓN, VÓRTICE Ω, BOTELLA DE KLEIN (Purple/Gold Chamfer) */}
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-950/90 p-1 sm:p-1.5 rounded-2xl border-2 border-purple-500/70 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.35)] shrink-0">
            {/* Ciclón (Twisting Slash MU) */}
            <button
              onClick={performMUTwistingSlash}
              className="flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-300 text-amber-200 active:scale-95 hover:brightness-110 transition-all shadow"
              title="Ciclón: Twisting Slash MU [Tecla R]"
            >
              <span className="text-xl sm:text-2xl">🌪️</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5">CICLÓN</span>
              <span className="text-[7px] font-mono text-amber-300 opacity-75">[R]</span>
            </button>

            {/* Vórtice Nexus N_Ω */}
            <button
              onClick={handleTriggerNexusVortex}
              className="flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-fuchsia-700 via-purple-900 to-slate-950 border border-fuchsia-300 text-fuchsia-200 active:scale-95 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)]"
              title="Vórtice Nexus Omega [Tecla V]"
            >
              <span className="text-xl sm:text-2xl animate-spin">🌀</span>
              <span className="text-[8px] sm:text-[9px] font-black font-cinzel uppercase tracking-tighter mt-0.5 text-center leading-tight">VÓRTICE Ω</span>
              <span className="text-[7px] font-mono text-fuchsia-300 opacity-75">[V]</span>
            </button>

            {/* Botella de Klein */}
            <button
              onClick={handleUseBotellaDeKlein}
              className="flex flex-col items-center justify-center w-12 h-14 sm:w-16 sm:h-18 rounded-xl bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950 border border-cyan-300 text-cyan-200 active:scale-95 hover:brightness-110 transition-all shadow-[0_0_18px_rgba(6,182,212,0.6)]"
              title="Botella de Klein: Topología 4D de Maná Infinito [Tecla 4]"
            >
              <span className="text-xl sm:text-2xl animate-bounce">🧪</span>
              <span className="text-[7px] sm:text-[8px] font-black font-cinzel uppercase tracking-tighter mt-0.5 text-center leading-tight">
                BOTELLA<br/>DE KLEIN
              </span>
              <span className="text-[7px] font-mono text-cyan-300 opacity-75">[4]</span>
            </button>
          </div>
        </div>

        {/* RIGHT POD: TARGET LOCK & CAMERA RESET */}
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={toggleZTarget}
            className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl border flex flex-col items-center justify-center text-xs active:scale-90 shadow-md ${
              isZTargeting
                ? 'bg-amber-500 text-slate-950 border-white shadow-[0_0_15px_rgba(251,191,36,0.8)]'
                : 'bg-slate-900/90 text-amber-300 border-amber-500/40'
            }`}
            title="Fijar Blanco Z-Targeting"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <button
            onClick={centerCameraBehindPlayer}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 flex flex-col items-center justify-center text-xs active:scale-90 shadow"
            title="Reajustar Cámara Detrás del Héroe"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
          </button>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* ARCHETYPE / CLASS SELECTOR MODAL (MU / SOLO / ZELDA)           */}
      {/* ============================================================== */}
      <ArchetypeSelectorModal
        isOpen={activeMenuTab === 'class'}
        onClose={() => setActiveMenuTab(null)}
        currentArchetype={currentArchetype}
        onSelectArchetype={handleSelectArchetype}
      />

      {/* ============================================================== */}
      {/* SOLO LEVELING HOLOGRAPHIC SYSTEM MODAL                          */}
      {/* ============================================================== */}
      <SystemHologramModal
        isOpen={activeMenuTab === 'system'}
        onClose={() => setActiveMenuTab(null)}
        attributes={systemAttrs}
        onAddStatPoint={handleAddStatPoint}
        dailyQuest={dailyQuest}
        onClaimDailyQuest={handleClaimDailyQuest}
        shadowSoldiers={shadowSoldiers}
        onRenameShadow={handleRenameShadow}
        onReleaseShadow={handleReleaseShadow}
        shadowsSummoned={shadowsSummoned}
        onToggleSummonArmy={handleToggleSummonArmy}
        onActivateMonarchDomain={handleActivateMonarchDomain}
        monarchDomainActive={monarchDomainActive}
        skills={systemSkills}
        playerLevel={level}
        currentHp={hp}
        maxHp={maxHp}
        currentMana={mana}
        maxMana={maxMana}
        onCheatFinishDaily={() => {
          setDailyQuest((prev) => ({
            ...prev,
            swordSwings: { current: prev.swordSwings.target, target: prev.swordSwings.target },
            distanceMeters: { current: prev.distanceMeters.target, target: prev.distanceMeters.target },
            monstersKilled: { current: prev.monstersKilled.target, target: prev.monstersKilled.target },
            shadowsExtracted: { current: prev.shadowsExtracted.target, target: prev.shadowsExtracted.target },
            isCompleted: true
          }));
          audioSystem.playSystemChime();
          setCombatAlert('⚡ ¡Misión Diaria completada con comandos de prueba!');
        }}
      />

      {/* ============================================================== */}
      {/* 🌀 NEXUS OMEGA N_Ω MATRIX MODAL (T ∘ O ∘ F |Ψ_Ω⟩)               */}
      {/* ============================================================== */}
      <NexusOmegaModal
        isOpen={isNexusModalOpen}
        onClose={() => setIsNexusModalOpen(false)}
        stateVector={computeNexusStateVector(
          hp,
          maxHp,
          mana,
          maxMana,
          shadowSoldiers.length,
          calculateShadowCapacity(systemAttrs.intelligence, level),
          5
        )}
        onTriggerVortex={handleTriggerNexusVortex}
        onApplyResonance={(res) => setNexusResult(res)}
        currentResult={nexusResult}
        onPlayFrequency={(freq) => audioSystem.playQuantumFrequency(freq)}
        onPlayUvaFrequency={() => audioSystem.playUvaFrequency9_5Hz()}
      />

      {/* ============================================================== */}
      {/* MODAL 1: INVENTARIO DE OBJETOS                                  */}
      {/* ============================================================== */}
      {activeMenuTab === 'inventory' && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/60 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-sm sm:text-base">
                <Backpack className="w-5 h-5" />
                <span>Inventario Cuántico (16 Ranuras)</span>
              </div>
              <button
                onClick={() => setActiveMenuTab(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 py-3 flex-1">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-cinzel">
                  Ranuras Activas de Equipamiento
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnEquip(e, 'weapon')}
                    onClick={() =>
                      equippedWeapon &&
                      setSelectedItem({ item: equippedWeapon, source: 'equipment', equipType: 'weapon' })
                    }
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center min-h-[90px] cursor-pointer transition-all ${
                      equippedWeapon
                        ? 'bg-amber-500/10 border-amber-500/60 hover:bg-amber-500/20 shadow'
                        : 'bg-slate-950 border-dashed border-slate-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{equippedWeapon?.icon || '⚔️'}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-200 truncate max-w-full text-center">
                      {equippedWeapon?.name || 'Arma Vacía'}
                    </span>
                    <span className="text-[9px] text-amber-400 font-mono">
                      {equippedWeapon?.stats?.atk ? `+${equippedWeapon.stats.atk} ATK` : 'RANURA ARMA'}
                    </span>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnEquip(e, 'shield')}
                    onClick={() =>
                      equippedShield &&
                      setSelectedItem({ item: equippedShield, source: 'equipment', equipType: 'shield' })
                    }
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center min-h-[90px] cursor-pointer transition-all ${
                      equippedShield
                        ? 'bg-blue-500/10 border-blue-500/60 hover:bg-blue-500/20 shadow'
                        : 'bg-slate-950 border-dashed border-slate-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{equippedShield?.icon || '🛡️'}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-200 truncate max-w-full text-center">
                      {equippedShield?.name || 'Escudo Vacío'}
                    </span>
                    <span className="text-[9px] text-blue-400 font-mono">
                      {equippedShield?.stats?.def ? `+${equippedShield.stats.def} DEF` : 'RANURA ESCUDO'}
                    </span>
                  </div>

                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnEquip(e, 'relic')}
                    onClick={() =>
                      equippedRelic &&
                      setSelectedItem({ item: equippedRelic, source: 'equipment', equipType: 'relic' })
                    }
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center min-h-[90px] cursor-pointer transition-all ${
                      equippedRelic
                        ? 'bg-purple-500/10 border-purple-500/60 hover:bg-purple-500/20 shadow'
                        : 'bg-slate-950 border-dashed border-slate-700'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{equippedRelic?.icon || '🔮'}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-200 truncate max-w-full text-center">
                      {equippedRelic?.name || 'Reliquia Vacía'}
                    </span>
                    <span className="text-[9px] text-purple-400 font-mono">
                      {equippedRelic ? 'ACTIVA' : 'RANURA RELIQUIA'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-cinzel">
                  Mochila (16 Casillas Cuánticas)
                </h3>
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {backpackSlots.map((item, idx) => (
                    <div
                      key={idx}
                      draggable={!!item}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, idx)}
                      onClick={() =>
                        item &&
                        setSelectedItem({
                          item,
                          source: 'backpack',
                          slotIndex: idx,
                          equipType:
                            item.type === 'weapon'
                              ? 'weapon'
                              : item.type === 'shield'
                              ? 'shield'
                              : item.type === 'relic'
                              ? 'relic'
                              : undefined
                        })
                      }
                      className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center p-1.5 cursor-pointer transition-all ${
                        item
                          ? 'bg-slate-950 border-slate-700 hover:border-amber-400 hover:bg-slate-800'
                          : 'bg-slate-950/40 border-slate-800/80'
                      }`}
                    >
                      {item ? (
                        <>
                          <span className="text-xl sm:text-2xl">{item.icon}</span>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 truncate max-w-full text-center mt-1">
                            {item.name}
                          </span>
                          {item.count > 1 && (
                            <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1 rounded-full">
                              x{item.count}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[9px] text-slate-600 font-mono">{idx + 1}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedItem && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedItem.item.icon}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{selectedItem.item.name}</h4>
                        <span className="text-[10px] uppercase font-mono text-amber-400">
                          Tipo: {selectedItem.item.type}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedItem.item.description}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    {selectedItem.source === 'backpack' && selectedItem.equipType && (
                      <button
                        onClick={() =>
                          selectedItem.slotIndex !== undefined &&
                          equipItemFromBackpack(
                            selectedItem.item,
                            selectedItem.slotIndex,
                            selectedItem.equipType!
                          )
                        }
                        className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 active:scale-95 transition-all shadow"
                      >
                        ⚡ Equipar en Ranura de {selectedItem.equipType.toUpperCase()}
                      </button>
                    )}

                    {selectedItem.source === 'backpack' && selectedItem.item.type === 'potion' && (
                      <button
                        onClick={() => {
                          useQuickPotion(selectedItem.item.id);
                          setSelectedItem(null);
                        }}
                        className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 active:scale-95 transition-all shadow"
                      >
                        🧪 Consumir Ahora
                      </button>
                    )}

                    {selectedItem.source === 'backpack' && selectedItem.item.type === 'bomb' && (
                      <button
                        onClick={() => {
                          detonateBomb();
                          setSelectedItem(null);
                        }}
                        className="flex-1 py-2 rounded-xl bg-rose-500 text-slate-950 font-bold text-xs hover:bg-rose-400 active:scale-95 transition-all shadow"
                      >
                        💣 Detonar Bomba
                      </button>
                    )}

                    {selectedItem.source === 'equipment' && (
                      <button
                        onClick={() => unequipItem(selectedItem.equipType!)}
                        className="flex-1 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500 font-bold text-xs hover:bg-rose-500/30 active:scale-95 transition-all"
                      >
                        Desequipar a Mochila
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: BESTIARIO DE MONSTRUOS Y JEFES                         */}
      {/* ============================================================== */}
      {activeMenuTab === 'bestiary' && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-cyan-500/60 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-cinzel font-bold text-sm sm:text-base">
                <BookOpen className="w-5 h-5" />
                <span>Enciclopedia y Bestiario de Criaturas</span>
              </div>
              <button
                onClick={() => setActiveMenuTab(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 py-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'normal', 'elite', 'boss'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBestiaryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-cinzel transition-all capitalize whitespace-nowrap ${
                      bestiaryFilter === cat
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'Todos' : cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar monstruo..."
                  value={bestiarySearch}
                  onChange={(e) => setBestiarySearch(e.target.value)}
                  className="w-full sm:w-56 pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {filteredBestiary.map((enemy) => {
                const kills = killStats[enemy.id] || 0;
                return (
                  <div
                    key={enemy.id}
                    className="p-3 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-inner shrink-0"
                        style={{
                          backgroundColor: `${enemy.color}20`,
                          borderColor: enemy.color
                        }}
                      >
                        {enemy.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm font-cinzel">{enemy.name}</h4>
                          <span
                            className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded uppercase"
                            style={{
                              backgroundColor: `${enemy.color}30`,
                              color: enemy.color
                            }}
                          >
                            {enemy.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{enemy.subtitle}</p>
                        <p className="text-xs text-slate-300 mt-1.5">{enemy.lore}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] font-mono text-slate-400">
                          <span>📍 {enemy.location}</span>
                          <span>⚔️ Daño: {enemy.baseDmg}</span>
                          <span>❤️ HP: {enemy.baseHp}</span>
                          <span className="text-amber-400">⚡ Debilidad: {enemy.weakness}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right sm:self-center shrink-0 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">Bajas registradas:</div>
                      <div className="text-lg font-bold font-mono text-cyan-400">{kills}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: LOGROS DEL HÉROE                                       */}
      {/* ============================================================== */}
      {activeMenuTab === 'achievements' && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-emerald-500/60 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-cinzel font-bold text-sm sm:text-base">
                <Trophy className="w-5 h-5" />
                <span>Logros Épicos ({unlockedCount}/{achievements.length})</span>
              </div>
              <button
                onClick={() => setActiveMenuTab(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 py-3 overflow-x-auto">
              {(['all', 'combat', 'exploration', 'equipment', 'story'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setAchievementFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-cinzel transition-all capitalize whitespace-nowrap ${
                    achievementFilter === cat
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {filteredAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                    ach.unlocked
                      ? 'bg-emerald-950/20 border-emerald-500/50'
                      : 'bg-slate-950/60 border-slate-800 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm font-cinzel">{ach.title}</h4>
                        {ach.unlocked && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                            COMPLETADO
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      {ach.progress} / {ach.maxProgress}
                    </div>
                    <div className="w-20 sm:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-400"
                        style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: CONSOLA DE TRUCOS Y TESTING RÁPIDO                    */}
      {/* ============================================================== */}
      {activeMenuTab === 'cheats' && (
        <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border-2 border-slate-700 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-cinzel font-bold text-sm sm:text-base">
                <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Consola de Pruebas Rápidas</span>
              </div>
              <button
                onClick={() => setActiveMenuTab(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-400 my-2.5">
              Accesos rápidos para probar logros, extracción de sombras y el sistema de MU 3D Nexus / Solo Leveling.
            </p>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => {
                  const updated = { ...killStats, sombra: 52 };
                  setKillStats(updated);
                  checkAchievementsProgress(updated);
                  setCombatAlert('👑 ¡Cheat ejecutado: 52 bajas registradas!');
                }}
                className="p-2.5 sm:p-3 bg-amber-500/20 border border-amber-400 text-amber-300 font-bold rounded-xl text-xs hover:bg-amber-500/30 text-left active:scale-95"
              >
                🗡️ Logro 50 Bajas
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  Desbloquea Leyenda del Abismo
                </span>
              </button>

              <button
                onClick={() => {
                  const allSectors = new Set([
                    'KokiriVillage',
                    'TempleDeku',
                    'GateLink',
                    'HyrulePlain',
                    'LonLonBioNet'
                  ]);
                  setDiscoveredSectors(allSectors);
                  setTimeout(() => checkAchievementsProgress(), 50);
                  setCombatAlert('🗺️ ¡Cheat ejecutado: Todos los sectores descubiertos!');
                }}
                className="p-2.5 sm:p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-bold rounded-xl text-xs hover:bg-emerald-500/30 text-left active:scale-95"
              >
                🗺️ Descubrir Niveles
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  Desbloquea Cartógrafo
                </span>
              </button>

              <button
                onClick={() => {
                  setTotalXp((p) => p + 1500);
                  setTimeout(() => checkAchievementsProgress(), 50);
                  setCombatAlert('🌌 ¡Cheat ejecutado: Nivel aumentado!');
                }}
                className="p-2.5 sm:p-3 bg-purple-500/20 border border-purple-400 text-purple-300 font-bold rounded-xl text-xs hover:bg-purple-500/30 text-left active:scale-95"
              >
                ⚡ Subir a Nivel 10
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  Desbloquea Monarca Sombras
                </span>
              </button>

              <button
                onClick={() => {
                  setHp(maxHp);
                  setMana(maxMana);
                  audioSystem.playHeal();
                  setCombatAlert('💚 ¡Salud y Maná restaurados al máximo!');
                }}
                className="p-2.5 sm:p-3 bg-rose-500/20 border border-rose-400 text-rose-300 font-bold rounded-xl text-xs hover:bg-rose-500/30 text-left active:scale-95"
              >
                💖 Curar y Restaurar
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  Restaura HP y Maná al 100%
                </span>
              </button>

              <button
                onClick={() => {
                  setDailyQuest((prev) => ({
                    ...prev,
                    swordSwings: { current: prev.swordSwings.target, target: prev.swordSwings.target },
                    distanceMeters: { current: prev.distanceMeters.target, target: prev.distanceMeters.target },
                    monstersKilled: { current: prev.monstersKilled.target, target: prev.monstersKilled.target },
                    shadowsExtracted: { current: prev.shadowsExtracted.target, target: prev.shadowsExtracted.target },
                    isCompleted: true
                  }));
                  audioSystem.playSystemChime();
                  setCombatAlert('🎁 ¡Misión Diaria completada para reclamar!');
                }}
                className="p-2.5 sm:p-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-bold rounded-xl text-xs hover:bg-cyan-500/30 text-left active:scale-95 col-span-2"
              >
                🎁 Completar Misión Diaria del Sistema
                <span className="block text-[9px] text-slate-400 mt-0.5">
                  Permite reclamar recompensas de Cazador de inmediato
                </span>
              </button>

              <button
                onClick={() => {
                  if (!gameRef.current) return;
                  const pos = gameRef.current.player.position;
                  const blessItem = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless')!;
                  const drop: WorldLootDrop = {
                    id: `drop_bless_${Date.now()}`,
                    item: blessItem,
                    position: { x: pos.x + 2.5, y: 0.05, z: pos.z - 2.5 },
                    rarity: 'legendary',
                    beamHeight: 8.5,
                    beamColor: 0xfbbf24,
                    hexColor: '#fbbf24',
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 300000,
                    isJewel: true
                  };
                  setWorldLootDrops((prev) => [...prev, drop]);
                  audioSystem.playJewelDropSound();
                  setLegendaryBanner({ title: '¡HA CAÍDO JOYA DE LA BENDICIÓN!', item: blessItem });
                  setTimeout(() => setLegendaryBanner(null), 5500);
                  setCombatAlert('💎 ¡Drop forzado: Joya de la Bendición (MU) invocada!');
                }}
                className="p-2.5 sm:p-3 bg-amber-500/20 border border-amber-300 text-amber-200 font-bold rounded-xl text-xs hover:bg-amber-500/30 text-left active:scale-95"
              >
                💎 Drop: Joya Bendición
                <span className="block text-[9px] text-amber-300/80 mt-0.5">
                  Haz de luz dorado y campanilleo MU
                </span>
              </button>

              <button
                onClick={() => {
                  if (!gameRef.current) return;
                  const pos = gameRef.current.player.position;
                  const soulItem = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_soul')!;
                  const drop: WorldLootDrop = {
                    id: `drop_soul_${Date.now()}`,
                    item: soulItem,
                    position: { x: pos.x - 2.5, y: 0.05, z: pos.z - 2.5 },
                    rarity: 'legendary',
                    beamHeight: 8.5,
                    beamColor: 0x38bdf8,
                    hexColor: '#38bdf8',
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 300000,
                    isJewel: true
                  };
                  setWorldLootDrops((prev) => [...prev, drop]);
                  audioSystem.playJewelDropSound();
                  setLegendaryBanner({ title: '¡HA CAÍDO JOYA DEL ALMA!', item: soulItem });
                  setTimeout(() => setLegendaryBanner(null), 5500);
                  setCombatAlert('🔮 ¡Drop forzado: Joya del Alma (MU) invocada!');
                }}
                className="p-2.5 sm:p-3 bg-sky-500/20 border border-sky-300 text-sky-200 font-bold rounded-xl text-xs hover:bg-sky-500/30 text-left active:scale-95"
              >
                🔮 Drop: Joya del Alma
                <span className="block text-[9px] text-sky-300/80 mt-0.5">
                  Gema del Alma de Kundun
                </span>
              </button>

              <button
                onClick={() => {
                  if (!gameRef.current) return;
                  const pos = gameRef.current.player.position;
                  const dragonItem = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'dragon_blade')!;
                  const drop: WorldLootDrop = {
                    id: `drop_dragon_${Date.now()}`,
                    item: dragonItem,
                    position: { x: pos.x, y: 0.05, z: pos.z - 3.5 },
                    rarity: 'legendary',
                    beamHeight: 9.0,
                    beamColor: 0xef4444,
                    hexColor: '#ef4444',
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 300000,
                    isJewel: false
                  };
                  setWorldLootDrops((prev) => [...prev, drop]);
                  audioSystem.playLegendaryDropFanfare();
                  setLegendaryBanner({ title: '¡HA CAÍDO ESPADA DRAGÓN CARMESÍ!', item: dragonItem });
                  setTimeout(() => setLegendaryBanner(null), 5500);
                  setCombatAlert('🔥 ¡Drop forzado: Espada Dragón Carmesí (+48 ATK)!');
                }}
                className="p-2.5 sm:p-3 bg-red-500/20 border border-red-400 text-red-200 font-bold rounded-xl text-xs hover:bg-red-500/30 text-left active:scale-95"
              >
                🔥 Drop: Espada Dragón
                <span className="block text-[9px] text-red-300/80 mt-0.5">
                  Arma Mítica (+48 ATK, +12 DEF)
                </span>
              </button>

              <button
                onClick={() => {
                  if (!gameRef.current) return;
                  const pos = gameRef.current.player.position;
                  const rasakaItem = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'rasaka_fang')!;
                  const drop: WorldLootDrop = {
                    id: `drop_rasaka_${Date.now()}`,
                    item: rasakaItem,
                    position: { x: pos.x + 3.0, y: 0.05, z: pos.z },
                    rarity: 'legendary',
                    beamHeight: 8.0,
                    beamColor: 0xa855f7,
                    hexColor: '#a855f7',
                    createdAt: Date.now(),
                    expiresAt: Date.now() + 300000,
                    isJewel: false
                  };
                  setWorldLootDrops((prev) => [...prev, drop]);
                  audioSystem.playLegendaryDropFanfare();
                  setLegendaryBanner({ title: '¡HAN CAÍDO DAGAS DE RASAKA!', item: rasakaItem });
                  setTimeout(() => setLegendaryBanner(null), 5500);
                  setCombatAlert('🗡️ ¡Drop forzado: Dagas de Rasaka (Solo Leveling)!');
                }}
                className="p-2.5 sm:p-3 bg-purple-500/20 border border-purple-400 text-purple-200 font-bold rounded-xl text-xs hover:bg-purple-500/30 text-left active:scale-95"
              >
                🗡️ Drop: Dagas de Rasaka
                <span className="block text-[9px] text-purple-300/80 mt-0.5">
                  Solo Leveling (+38 ATK, +15 SPD)
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MU 3D NEXUS R18 INTEGRATION PANEL MODAL */}
      {activeMenuTab === 'r18' && (
        <R18PanelModal
          currentSkinId={currentR18Skin}
          isMounted={isMounted}
          onSelectSkin={handleSelectR18Skin}
          onToggleMount={handleToggleMount}
          onTravelTorlan={handleTravelTorlan}
          onClose={() => setActiveMenuTab(null)}
        />
      )}

      {/* NEX KONI v9.2 — SELECCIÓN DE MUNDOS HABITABLES MODAL */}
      <WorldSelectorModal
        isOpen={isWorldModalOpen}
        onClose={() => setIsWorldModalOpen(false)}
        currentWorldId={currentWorldId}
        onSelectWorld={handleSelectWorld}
      />

      {/* MANUAL NEXX KONI v9.2 — CÓDICE CUÁNTICO MODAL */}
      <ManualNexxKoniModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onPlayUvaFrequency={() => audioSystem.playUvaFrequency9_5Hz()}
      />
    </div>
  );
}
