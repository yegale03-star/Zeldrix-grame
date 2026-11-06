// Game logic, types, bestiary data, items, and achievements evaluation

export type EnemyCategory = 'normal' | 'elite' | 'boss';

export interface BestiaryEntry {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  location: string;
  baseHp: number;
  baseDmg: number;
  weakness: string;
  category: EnemyCategory;
  lore: string;
  drops: string[];
}

export const BESTIARY_DATA: BestiaryEntry[] = [
  {
    id: 'mu_goblin',
    name: 'Goblin de Lorencia (MU)',
    subtitle: 'Criatura silvestre armada con hacha y cuernos rústicos',
    icon: '👺',
    color: '#607b45',
    location: 'Perímetro de Lorencia y Campo de Entrenamiento',
    baseHp: 60,
    baseDmg: 12,
    weakness: 'Tajo Giratorio (Twisting Slash) / Fuego',
    category: 'normal',
    lore: 'Criaturas agresivas procedentes de los valles de Lorencia en MU Online. Atacan en grupos pero son vulnerables a ataques en área.',
    drops: ['Hacha de Goblin', 'Moneda Zen']
  },
  {
    id: 'mu_warrior',
    name: 'Guerrero Caído (MU)',
    subtitle: 'Soldado blindado maldito reanimado por la oscuridad',
    icon: '🛡️',
    color: '#806044',
    location: 'Ruinas de Devias y Llanura Central',
    baseHp: 75,
    baseDmg: 16,
    weakness: 'Espadazos Críticos / Dominio de Sombras',
    category: 'normal',
    lore: 'Antiguos caballeros caídos en las guerras de Kundun, portadores de espadas pesadas que rondan los campos de batalla.',
    drops: ['Fragmento de Armadura de Acero', 'Poción de Vida Mayor']
  },
  {
    id: 'sombra',
    name: 'Sombra Errante del Abismo',
    subtitle: 'Manifestación residual del vacío dimensional',
    icon: '👤',
    color: '#818cf8',
    location: 'Bosque Mugen y Catacumbas',
    baseHp: 35,
    baseDmg: 8,
    weakness: 'Luz Sagrada / Filo Resonante',
    category: 'normal',
    lore: 'Entidades menores nacidas de las brechas dimensionales. En enjambres pueden superar a guerreros novatos.',
    drops: ['Esencia Oscura', 'Cristal Sombrío']
  },
  {
    id: 'drone',
    name: 'Dron Centinela Sheikah',
    subtitle: 'Autómata de vigilancia autónomo reconfigurado',
    icon: '🛸',
    color: '#38bdf8',
    location: 'Puente Dimensional y Perímetro Deku',
    baseHp: 45,
    baseDmg: 12,
    weakness: 'Sobrecarga Eléctrica / Flechas a Distancia',
    category: 'normal',
    lore: 'Antiguas sondas de inspección infectadas por el código malévolo de la red Hyrule 2050.',
    drops: ['Tornillo Arcaico', 'Batería de Plasma']
  },
  {
    id: 'keese',
    name: 'Keese de Plasma Volador',
    subtitle: 'Murciélago electrificado de alta frecuencia',
    icon: '🦇',
    color: '#f43f5e',
    location: 'Cielos del Bosque Mugen y Cavernas',
    baseHp: 25,
    baseDmg: 14,
    weakness: 'Tiro Rápido con Arco / Ráfagas de Hielo',
    category: 'normal',
    lore: 'Criaturas voladoras bio-modificadas que emiten descargas térmicas al aproximarse a su presa.',
    drops: ['Ala Resonante', 'Núcleo Térmico']
  },
  {
    id: 'stalchild',
    name: 'Stalchild Maldito',
    subtitle: 'Guerrero esqueleto reanimado por nanomaquinaria',
    icon: '💀',
    color: '#e2e8f0',
    location: 'Llanura de Hyrule (Nocturno)',
    baseHp: 50,
    baseDmg: 15,
    weakness: 'Fuego Sagrado / Impacto Contundente',
    category: 'normal',
    lore: 'Soldados caídos en las guerras olvidadas, cuyos restos son activados por pulsos de energía oscura.',
    drops: ['Hueso Reforzado', 'Fragmento de Alma']
  },
  {
    id: 'stalker',
    name: 'Caza-Sleeves del Vacío',
    subtitle: 'Mercenario cibernético clandestino de élite',
    icon: '🥷',
    color: '#a855f7',
    location: 'Entrada al Bosque Perdido y Torres',
    baseHp: 80,
    baseDmg: 18,
    weakness: 'Vulnerable a Bombas de Plasma y Luz',
    category: 'elite',
    lore: 'Asesinos aumentados que se camuflan en la penumbra holográfica para emboscar aventureros.',
    drops: ['Capa de Invisibilidad Dañada', 'Daga Cibernética']
  },
  {
    id: 'lizalfos',
    name: 'Lizalfos Cibernético',
    subtitle: 'Reptil de asalto blindado con placas de titanio',
    icon: '🦎',
    color: '#22c55e',
    location: 'Llanura Central y Murallas',
    baseHp: 110,
    baseDmg: 22,
    weakness: 'Ataques por la Espalda / Flechas de Hielo',
    category: 'elite',
    lore: 'Guerreros reptilianos con reflejos mejorados genéticamente y armamento de corte térmico.',
    drops: ['Escama de Titanio', 'Espuela Afilada']
  },
  {
    id: 'gohma',
    name: 'Reina Gohma Bio-Mecánica',
    subtitle: 'Parásito colosal que corrompe el Árbol Deku',
    icon: '🕷️',
    color: '#ef4444',
    location: 'Cámara Profunda del Templo Deku',
    baseHp: 300,
    baseDmg: 35,
    weakness: 'Vulnerabilidad Ocular cuando el Ojo brilla en Rojo',
    category: 'boss',
    lore: 'La bio-pesadilla arácnida que custodia el corazón del Templo. Sus ojos disparan haces iónicos concentrados.',
    drops: ['Ojo Caroteno Bio-Óptico', 'Capullo Corrupto', 'Contenedor de Corazón (+20 HP)']
  },
  {
    id: 'ganon',
    name: 'Avatar Corrupto de Ganon-IA',
    subtitle: 'El Señor de la Calamidad Cibernética',
    icon: '👹',
    color: '#dc2626',
    location: 'Castillo Flotante de Hyrule Central',
    baseHp: 650,
    baseDmg: 55,
    weakness: 'Trifuerza de la Luz / Flechas Sagradas',
    category: 'boss',
    lore: 'La conciencia malévola definitiva que ha secuestrado la red de Hyrule 2050 para reescribir la realidad.',
    drops: ['Núcleo del Mal Primordial', 'Espada del Tirano']
  }
];

export type ItemType = 'weapon' | 'shield' | 'relic' | 'potion' | 'bomb' | 'material' | 'jewel' | 'zen';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  icon: string;
  rarity: ItemRarity;
  description: string;
  count: number;
  maxStack: number;
  stats?: {
    atk?: number;
    def?: number;
    spd?: number;
    hp?: number;
    mana?: number;
  };
}

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'kokiri_blade',
    name: 'Espada Kokiri de Fotones',
    type: 'weapon',
    icon: '🗡️',
    rarity: 'rare',
    description: 'Arma ancestral forjada con un cristal de corte iónico del Bosque Kokiri.',
    count: 1,
    maxStack: 1,
    stats: { atk: 18, spd: 5 }
  },
  {
    id: 'deku_shield',
    name: 'Escudo de Corteza Sagrada',
    type: 'shield',
    icon: '🛡️',
    rarity: 'common',
    description: 'Escudo ligero tallado de la madera del Gran Árbol Deku con revestimiento de nanopolímeros.',
    count: 1,
    maxStack: 1,
    stats: { def: 12 }
  },
  {
    id: 'health_potion',
    name: 'Elixir Carmesí de Hada',
    type: 'potion',
    icon: '🧪',
    rarity: 'common',
    description: 'Restaura 50 puntos de salud inmediatamente al ser consumido.',
    count: 3,
    maxStack: 10,
    stats: { hp: 50 }
  },
  {
    id: 'mana_potion',
    name: 'Elixir Índigo de Maná',
    type: 'potion',
    icon: '💧',
    rarity: 'common',
    description: 'Restaura 60 puntos de energía y maná para activar habilidades de sombra.',
    count: 2,
    maxStack: 10,
    stats: { mana: 60 }
  },
  {
    id: 'nanobomb',
    name: 'Bomba de Nanobots Deku',
    type: 'bomb',
    icon: '💣',
    rarity: 'rare',
    description: 'Detonador de fragmentación que causa 75 puntos de daño a todos los enemigos cercanos.',
    count: 4,
    maxStack: 8,
    stats: { atk: 75 }
  },
  {
    id: 'triforce_shard',
    name: 'Fragmento de la Trifuerza',
    type: 'relic',
    icon: '🔺',
    rarity: 'legendary',
    description: 'Reliquia dorada que incrementa el poder de ataque en +30% y la resistencia total.',
    count: 1,
    maxStack: 1,
    stats: { atk: 25, def: 20 }
  },
  {
    id: 'deku_seed',
    name: 'Semilla Deku Explosiva',
    type: 'material',
    icon: '🌰',
    rarity: 'common',
    description: 'Semilla compactada con plasma; munición para la resortera o para fabricar bombas.',
    count: 12,
    maxStack: 50
  },
  {
    id: 'sheikah_lens',
    name: 'Lente de la Verdad Sheikah',
    type: 'relic',
    icon: '👁️',
    rarity: 'epic',
    description: 'Dispositivo óptico que revela debilidades secretas de monstruos y caminos invisibles.',
    count: 1,
    maxStack: 1,
    stats: { spd: 10 }
  },
  {
    id: 'manual_nexx_koni',
    name: 'Manual Nexx Koni',
    type: 'relic',
    icon: '📖',
    rarity: 'legendary',
    description: 'Tomo sagrado que contiene los secretos del Vórtice 3-6-9-5, la Frecuencia 9.5 Hz y la Guía de Mundos Habitables.',
    count: 1,
    maxStack: 1,
    stats: { atk: 15, def: 15, spd: 5 }
  },
  {
    id: 'botella_klein',
    name: 'Botella de Klein',
    type: 'potion',
    icon: '🧪',
    rarity: 'legendary',
    description: 'Artefacto topológico cuatridimensional. Restaura el 100% de Vida y Maná y colapsa la función de onda en resonancia armónica de 9.5 Hz.',
    count: 3,
    maxStack: 5,
    stats: { hp: 100, mana: 100 }
  }
];

export type AchievementCategory = 'combat' | 'exploration' | 'equipment' | 'story';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_steps',
    title: 'Despertar del Héroe',
    description: 'Inicia tu travesía en el Bosque Mugen de Zeldrix.',
    icon: '🌱',
    category: 'story',
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    unlockedAt: 'Comenzado'
  },
  {
    id: 'sword_master',
    title: 'Portador de la Hoja',
    description: 'Equipa tu primera espada de fotones.',
    icon: '🗡️',
    category: 'equipment',
    progress: 0,
    maxProgress: 1,
    unlocked: false
  },
  {
    id: 'shield_bearer',
    title: 'Defensa Sagrada',
    description: 'Equipa un escudo para protegerte de los asaltos.',
    icon: '🛡️',
    category: 'equipment',
    progress: 0,
    maxProgress: 1,
    unlocked: false
  },
  {
    id: 'slayer_first',
    title: 'Bautismo de Fuego',
    description: 'Elimina tu primer enemigo en combate abierto.',
    icon: '⚔️',
    category: 'combat',
    progress: 0,
    maxProgress: 1,
    unlocked: false
  },
  {
    id: 'slayer_10',
    title: 'Cazador de Rango E',
    description: 'Derrota a 10 enemigos y perfecciona tus reflejos.',
    icon: '🎯',
    category: 'combat',
    progress: 0,
    maxProgress: 10,
    unlocked: false
  },
  {
    id: 'slayer_grandmaster_50',
    title: 'Leyenda del Abismo (50 Bajas)',
    description: 'Derrota 50 enemigos en combates épicos en el mundo abierto.',
    icon: '👑',
    category: 'combat',
    progress: 0,
    maxProgress: 50,
    unlocked: false
  },
  {
    id: 'discover_all_levels',
    title: 'Cartógrafo Dimensional',
    description: 'Descubre y visita todos los sectores y mazmorras del mundo abierto.',
    icon: '🗺️',
    category: 'exploration',
    progress: 1,
    maxProgress: 5,
    unlocked: false
  },
  {
    id: 'solo_leveling_monarch',
    title: 'Monarca de las Sombras',
    description: 'Alcanza el nivel 10 de personaje y desbloquea el aura de sombra.',
    icon: '🌌',
    category: 'story',
    progress: 1,
    maxProgress: 10,
    unlocked: false
  },
  {
    id: 'aqw_collector',
    title: 'Coleccionista Legendario',
    description: 'Equipa un arma, un escudo y una reliquia simultáneamente.',
    icon: '💎',
    category: 'equipment',
    progress: 0,
    maxProgress: 3,
    unlocked: false
  },
  {
    id: 'gohma_slayer',
    title: 'Terror de la Reina Gohma',
    description: 'Vence a la Reina Gohma en el corazón del Templo Deku.',
    icon: '🕷️',
    category: 'combat',
    progress: 0,
    maxProgress: 1,
    unlocked: false
  },
  {
    id: 'hyrule_gateway',
    title: 'Cruzando el Portal',
    description: 'Desbloquea el acceso a las Llanuras Neón de Hyrule.',
    icon: '🚪',
    category: 'exploration',
    progress: 0,
    maxProgress: 1,
    unlocked: false
  }
];

export interface PlayerProgressionState {
  hasStarted: boolean;
  hasSword: boolean;
  hasShield: boolean;
  hasRelic: boolean;
  kills: number;
  gohmaDefeated: boolean;
  hyruleUnlocked: boolean;
  allLevelsDiscovered: boolean;
  discoveredCount: number;
  totalKills: number;
  playerLevel: number;
  hasEquippedAllSlots: boolean;
}

export function evaluateAchievements(
  achievements: Achievement[],
  state: PlayerProgressionState
): { updated: Achievement[]; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const updated = achievements.map((ach) => {
    if (ach.unlocked) return ach;

    let progress = ach.progress;
    let unlocked = false;

    switch (ach.id) {
      case 'first_steps':
        progress = state.hasStarted ? 1 : 0;
        unlocked = state.hasStarted;
        break;
      case 'sword_master':
        progress = state.hasSword ? 1 : 0;
        unlocked = state.hasSword;
        break;
      case 'shield_bearer':
        progress = state.hasShield ? 1 : 0;
        unlocked = state.hasShield;
        break;
      case 'slayer_first':
        progress = Math.min(1, state.totalKills);
        unlocked = state.totalKills >= 1;
        break;
      case 'slayer_10':
        progress = Math.min(10, state.totalKills);
        unlocked = state.totalKills >= 10;
        break;
      case 'slayer_grandmaster_50':
        progress = Math.min(50, state.totalKills);
        unlocked = state.totalKills >= 50;
        break;
      case 'discover_all_levels':
        progress = Math.min(5, state.discoveredCount);
        unlocked = state.allLevelsDiscovered || state.discoveredCount >= 5;
        break;
      case 'solo_leveling_monarch':
        progress = Math.min(10, state.playerLevel);
        unlocked = state.playerLevel >= 10;
        break;
      case 'aqw_collector':
        const slotsCount = (state.hasSword ? 1 : 0) + (state.hasShield ? 1 : 0) + (state.hasRelic ? 1 : 0);
        progress = slotsCount;
        unlocked = state.hasEquippedAllSlots || slotsCount >= 3;
        break;
      case 'gohma_slayer':
        progress = state.gohmaDefeated ? 1 : 0;
        unlocked = state.gohmaDefeated;
        break;
      case 'hyrule_gateway':
        progress = state.hyruleUnlocked ? 1 : 0;
        unlocked = state.hyruleUnlocked;
        break;
    }

    if (unlocked && !ach.unlocked) {
      const unlockedItem = {
        ...ach,
        progress: ach.maxProgress,
        unlocked: true,
        unlockedAt: new Date().toLocaleTimeString()
      };
      newlyUnlocked.push(unlockedItem);
      return unlockedItem;
    }

    return {
      ...ach,
      progress
    };
  });

  return { updated, newlyUnlocked };
}

export function calculateCombatDamage(
  baseDmg: number,
  isCritical: boolean = false,
  elementalMultiplier: number = 1.0
): number {
  const variance = 0.9 + Math.random() * 0.2; // 90% - 110%
  const critMultiplier = isCritical ? 1.75 : 1.0;
  return Math.round(baseDmg * critMultiplier * elementalMultiplier * variance);
}

export function calculateLevelAndXp(totalXp: number): { level: number; currentXp: number; nextLevelXp: number } {
  // Level progression curve
  let level = 1;
  let xpRequired = 100;
  let remainingXp = totalXp;

  while (remainingXp >= xpRequired) {
    remainingXp -= xpRequired;
    level++;
    xpRequired = Math.round(xpRequired * 1.35);
  }

  return {
    level,
    currentXp: remainingXp,
    nextLevelXp: xpRequired
  };
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

// ==========================================
// SOLO LEVELING SYSTEM & SHADOW EXTRACTION
// ==========================================

export type ShadowRank = 'soldier' | 'elite' | 'knight' | 'commander' | 'marshall';

export interface ShadowSoldier {
  id: string;
  name: string;
  originalEnemyType: string;
  rank: ShadowRank;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  kills: number;
  icon: string;
  extractedAt: string;
  specialSkill: string;
  color: string;
}

export interface FallenShadowVortex {
  id: string;
  enemyType: string;
  enemyName: string;
  position: { x: number; y: number; z: number };
  expiresAt: number; // timestamp in ms
  attemptsRemaining: number; // 3 attempts max
  rank: ShadowRank;
  manaCost: number;
  icon: string;
  color: string;
}

export interface SystemAttributes {
  strength: number;      // STR: increases melee physical damage
  vitality: number;      // VIT: increases max HP and armor defense
  agility: number;       // AGI: increases movement speed and crit rate
  intelligence: number;  // INT: increases max Mana, shadow capacity & skill potency
  perception: number;    // PER: increases shadow extraction success chance and item drops
  availablePoints: number;
  fatigue: number;       // 0 to 100
  title: string;
  hunterRank: string;    // 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'Monarca de las Sombras'
  playerName: string;
}

export interface SystemDailyQuest {
  id: string;
  title: string;
  description: string;
  swordSwings: { current: number; target: number };
  distanceMeters: { current: number; target: number };
  monstersKilled: { current: number; target: number };
  shadowsExtracted: { current: number; target: number };
  isCompleted: boolean;
  rewardClaimed: boolean;
  rewards: {
    statPoints: number;
    rupees: number;
    xp: number;
    lootBox: string;
  };
}

export interface SystemSkill {
  id: string;
  name: string;
  koreanName: string;
  level: number;
  maxLevel: number;
  manaCost: number;
  description: string;
  icon: string;
  type: 'active' | 'passive';
  isUnlocked: boolean;
}

export const INITIAL_SYSTEM_ATTRIBUTES: SystemAttributes = {
  strength: 12,
  vitality: 10,
  agility: 11,
  intelligence: 15,
  perception: 10,
  availablePoints: 5,
  fatigue: 0,
  title: 'Monarca Naciente',
  hunterRank: 'Rango S',
  playerName: 'Sung Jin-Woo'
};

export const INITIAL_SYSTEM_SKILLS: SystemSkill[] = [
  {
    id: 'arise',
    name: 'Extracción de Sombras (ARISE)',
    koreanName: '그림자 추출',
    level: 1,
    maxLevel: 5,
    manaCost: 20,
    description: 'Extrae el maná y la sombra espiritual de un enemigo derrotado diciendo el comando sagrado "¡SURGE!" para integrarlo a tu Ejército.',
    icon: '👤',
    type: 'active',
    isUnlocked: true
  },
  {
    id: 'shadow_storage',
    name: 'Preservación de Sombras',
    koreanName: '그림자 저장',
    level: 2,
    maxLevel: 5,
    manaCost: 0,
    description: 'Permite absorber a tus soldados en tu sombra para regenerar su salud y aumentar tu regeneración de maná pasivo.',
    icon: '🌑',
    type: 'passive',
    isUnlocked: true
  },
  {
    id: 'monarch_domain',
    name: 'Dominio del Monarca',
    koreanName: '군주의 영역',
    level: 1,
    maxLevel: 3,
    manaCost: 45,
    description: 'El suelo se tiñe de ébano abisal en 25m alrededor del Monarca. Las sombras en el área aumentan su ataque y velocidad en un +50%.',
    icon: '👑',
    type: 'active',
    isUnlocked: true
  },
  {
    id: 'shadow_step',
    name: 'Paso Veloz de Sombras',
    koreanName: '그림자 교환',
    level: 1,
    maxLevel: 3,
    manaCost: 15,
    description: 'Movimiento hipersónico envuelto en estelas violetas con invulnerabilidad temporal durante el esquive.',
    icon: '⚡',
    type: 'active',
    isUnlocked: true
  },
  {
    id: 'bloodlust',
    name: 'Sed de Sangre',
    koreanName: '살기',
    level: 1,
    maxLevel: 3,
    manaCost: 25,
    description: 'Emana una tremenda intención asesina que paraliza y reduce la velocidad de ataque de los enemigos cercanos.',
    icon: '👁️',
    type: 'active',
    isUnlocked: true
  }
];

export const INITIAL_SHADOW_SOLDIERS: ShadowSoldier[] = [
  {
    id: 'shadow_igris',
    name: 'Igris el Caballero Rojo',
    originalEnemyType: 'stalker',
    rank: 'caballero' as ShadowRank,
    level: 3,
    hp: 120,
    maxHp: 120,
    atk: 28,
    def: 18,
    kills: 14,
    icon: '⚔️',
    extractedAt: 'Mazmorra de Rango Élite',
    specialSkill: 'Tajo Centella de Dominio',
    color: '#818cf8'
  },
  {
    id: 'shadow_iron',
    name: 'Iron el Blindado',
    originalEnemyType: 'sombra',
    rank: 'soldier' as ShadowRank,
    level: 2,
    hp: 90,
    maxHp: 90,
    atk: 18,
    def: 22,
    kills: 6,
    icon: '🛡️',
    extractedAt: 'Entrada del Bosque',
    specialSkill: 'Grito de Provocación Sombrío',
    color: '#38bdf8'
  }
];

export const INITIAL_DAILY_QUEST: SystemDailyQuest = {
  id: 'daily_training_01',
  title: '[Misión Diaria: Preparación para ser más Fuerte]',
  description: '¡Advertencia del Sistema! Si la misión diaria no es completada antes de medianoche, serás transportado a la Zona de Penalización.',
  swordSwings: { current: 12, target: 40 },
  distanceMeters: { current: 150, target: 500 },
  monstersKilled: { current: 1, target: 5 },
  shadowsExtracted: { current: 0, target: 2 },
  isCompleted: false,
  rewardClaimed: false,
  rewards: {
    statPoints: 3,
    rupees: 150,
    xp: 200,
    lootBox: 'Caja Bendita del Sistema (Rango S)'
  }
};

export function calculateShadowCapacity(intelligence: number, playerLevel: number): number {
  return Math.min(25, 3 + Math.floor(intelligence / 5) + Math.floor(playerLevel / 2));
}

export function calculateExtractionChance(
  playerLevel: number,
  intelligence: number,
  perception: number,
  rank: ShadowRank,
  attempt: number
): number {
  let baseRate = 0.85;
  if (rank === 'elite') baseRate = 0.65;
  if (rank === 'knight') baseRate = 0.45;
  if (rank === 'commander') baseRate = 0.30;
  if (rank === 'marshall') baseRate = 0.15;

  const attemptModifier = attempt === 1 ? 1.0 : attempt === 2 ? 0.85 : 0.70;
  const statBonus = (intelligence + perception) * 0.005;
  const levelBonus = playerLevel * 0.02;

  const totalChance = Math.min(0.95, Math.max(0.12, (baseRate + statBonus + levelBonus) * attemptModifier));
  return Math.round(totalChance * 100) / 100;
}

export function determineEnemyShadowRank(enemyType: string): { rank: ShadowRank; manaCost: number; defaultName: string; icon: string; color: string } {
  if (enemyType === 'gohma') {
    return {
      rank: 'commander',
      manaCost: 50,
      defaultName: 'Tarrasque Gohma de las Sombras',
      icon: '👾',
      color: '#f43f5e'
    };
  }
  if (enemyType === 'stalker') {
    return {
      rank: 'knight',
      manaCost: 30,
      defaultName: 'Asesino Espectral Rango S',
      icon: '🗡️',
      color: '#a855f7'
    };
  }
  if (enemyType === 'drone') {
    return {
      rank: 'elite',
      manaCost: 20,
      defaultName: 'Centinela Sombra Volador',
      icon: '🛸',
      color: '#38bdf8'
    };
  }
  if (enemyType === 'mu_warrior') {
    return {
      rank: 'knight',
      manaCost: 25,
      defaultName: 'Caballero Caído de Lorencia (MU)',
      icon: '🛡️',
      color: '#806044'
    };
  }
  if (enemyType === 'mu_goblin') {
    return {
      rank: 'soldier',
      manaCost: 15,
      defaultName: 'Goblin Sombrío de Lorencia (MU)',
      icon: '👺',
      color: '#607b45'
    };
  }
  return {
    rank: 'soldier',
    manaCost: 15,
    defaultName: 'Soldado de Sombra',
    icon: '👤',
    color: '#818cf8'
  };
}

// ==========================================
// HYBRID CLASS ARCHETYPES (MU / SOLO / ZELDA)
// ==========================================

export type PlayerArchetype =
  | 'nexx_koni'
  | 'golden_scarab'
  | 'wolf_shield'
  | 'wolf_alpha'
  | 'wolf_oracle'
  | 'dark_knight'
  | 'shadow_monarch'
  | 'hero_of_time';

export interface ArchetypeConfig {
  id: PlayerArchetype;
  name: string;
  subname: string;
  lore: string;
  icon: string;
  primaryColor: string;
  bonusAtk: number;
  bonusDef: number;
  bonusSpd: number;
  specialSkillName: string;
  pedestalLabel?: string;
  isNexxKoniHero?: boolean;
}

export const ARCHETYPES: ArchetypeConfig[] = [
  {
    id: 'nexx_koni',
    name: 'NEXX KONI',
    subname: 'Elfa Guerrera del Vórtice Sagrado (v9.2)',
    lore: 'Maestra sagrada del linaje élfico dotada con la Espada de Runas y el Escudo Vórtice 3-6-9. Sintonizada a la Frecuencia Uva 9.5 Hz.',
    icon: '🧝‍♀️',
    primaryColor: '#d946ef',
    bonusAtk: 24,
    bonusDef: 18,
    bonusSpd: 8,
    specialSkillName: 'Corte Vórtice 3-6-9',
    pedestalLabel: 'NEXX KONI',
    isNexxKoniHero: true
  },
  {
    id: 'golden_scarab',
    name: 'EL ESCARABAJO DORADO',
    subname: 'Guardián Celestial de Ra y Khepri',
    lore: 'Entidad áurea alada que levita sobre frecuencias de luz divina. Despliega escudos cuánticos de oro y ráfagas solares.',
    icon: '🪲',
    primaryColor: '#f59e0b',
    bonusAtk: 20,
    bonusDef: 22,
    bonusSpd: 14,
    specialSkillName: 'Destello Solar Cuántico',
    pedestalLabel: 'EL ESCARABAJO DORADO',
    isNexxKoniHero: true
  },
  {
    id: 'wolf_shield',
    name: 'LOBO BLANCO ESCUDO',
    subname: 'Paladín Guardián Albino de la Orden',
    lore: 'Guerrero bípedo blindado con armadura pesada de plata y gran escudo templario. Muralla inamovible de primera línea.',
    icon: '🛡️',
    primaryColor: '#38bdf8',
    bonusAtk: 18,
    bonusDef: 28,
    bonusSpd: 4,
    specialSkillName: 'Baluarte Inamovible',
    pedestalLabel: 'LOBO BLANCO ESCUDO',
    isNexxKoniHero: true
  },
  {
    id: 'wolf_alpha',
    name: 'LOBO BLANCO ALFA HUB',
    subname: 'Rey de las Estepas Celestiales y Líder de Manada',
    lore: 'Cuadrúpedo gigante con diadema y penacho solar áureo. Comanda el Paquete de los 3 Lobos con velocidad y ferocidad ancestral.',
    icon: '🐺',
    primaryColor: '#fbbf24',
    bonusAtk: 26,
    bonusDef: 16,
    bonusSpd: 14,
    specialSkillName: 'Embestida Alfa Solar',
    pedestalLabel: 'LOBO BLANCO ALFA HUB',
    isNexxKoniHero: true
  },
  {
    id: 'wolf_oracle',
    name: 'LOBO PÚRPURA ORÁCULO',
    subname: 'Chamán de las Sombras y el Vacío Astral',
    lore: 'Lobo místico imbuido de llamas etéreas púrpuras, ojos violetas resplandecientes, colgante lunar y runas cósmicas ancestrales.',
    icon: '🔮',
    primaryColor: '#a855f7',
    bonusAtk: 30,
    bonusDef: 12,
    bonusSpd: 10,
    specialSkillName: 'Oráculo del Vacío Púrpura',
    pedestalLabel: 'LOBO PÚRPURA ORÁCULO',
    isNexxKoniHero: true
  },
  {
    id: 'dark_knight',
    name: 'Dark Knight (MU 3D Nexus R21)',
    subname: 'Caballero Pesado de Lorencia',
    lore: 'Guerrero blindado con placas de acero y oro. Domina el Tajo Giratorio (Twisting Slash) de corto alcance y alta defensa.',
    icon: '⚔️',
    primaryColor: '#c89a47',
    bonusAtk: 14,
    bonusDef: 16,
    bonusSpd: 0,
    specialSkillName: 'Twisting Slash (Ciclón MU)'
  },
  {
    id: 'shadow_monarch',
    name: 'Monarca de las Sombras (Solo Leveling)',
    subname: 'Señor Supremo del Vacío',
    lore: 'Nigromante Rango S capaz de extraer ejércitos eternos de sombras y sumergir el campo de batalla en su Dominio.',
    icon: '🌌',
    primaryColor: '#8b5cf6',
    bonusAtk: 18,
    bonusDef: 6,
    bonusSpd: 4,
    specialSkillName: 'Dominio del Monarca'
  },
  {
    id: 'hero_of_time',
    name: 'Héroe del Tiempo (Zelda Cyber)',
    subname: 'Guerrero de la Trifuerza',
    lore: 'Esgrimista ágil con espada y escudo Deku, alta velocidad de rodada acrobática y fijación de blancos Z-Targeting.',
    icon: '🗡️',
    primaryColor: '#10b981',
    bonusAtk: 8,
    bonusDef: 10,
    bonusSpd: 6,
    specialSkillName: 'Corte Sagrado Giratorio'
  }
];

// ==========================================
// NEX KONI v9.2 — SELECCIÓN DE MUNDOS HABITABLES
// ==========================================

export interface HabitableWorld {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  features: string[];
  ambientColor: number;
  fogColor: number;
  skyColor: number;
  groundColor: number;
  sectorName: string;
  previewImage: string;
  cardIndex: number;
}

export const HABITABLE_WORLDS: HabitableWorld[] = [
  {
    id: 'tundra_cristal',
    name: 'TUNDRA DE CRISTAL',
    subtitle: 'Mundo nevado de hielo azul y cristales',
    description: 'Aldeas de cristal • Lobos blancos • Pináculos de cuarzo congelado',
    badge: '❄️ HIELO AZUL',
    features: ['Hielo azul brillante', 'Aldeas de cristal', 'Lobos blancos', 'Ventiscas de plasma'],
    ambientColor: 0x38bdf8,
    fogColor: 0x0c223a,
    skyColor: 0x071526,
    groundColor: 0xdbeafe,
    sectorName: 'Tundra de Cristal · Valle de los Lobos Blancos',
    previewImage: '/assets/aistudio/IMG-20261105-WA0036_bb0fc27f.jpg',
    cardIndex: 0
  },
  {
    id: 'desierto_dorado',
    name: 'DESIERTO DORADO',
    subtitle: 'Mundo desértico dorado • Castillos',
    description: 'Palmeras • Pirámides • Mercado místico bajo el sol primordial',
    badge: '☀️ ARENAS SOLARES',
    features: ['Dunas doradas de Ra', 'Castillo fortaleza', 'Pirámides milenarias', 'Oasis de palmeras'],
    ambientColor: 0xf59e0b,
    fogColor: 0x2d1804,
    skyColor: 0x1c1003,
    groundColor: 0xfef08a,
    sectorName: 'Desierto Dorado · Gran Oasis de las Pirámides',
    previewImage: '/assets/aistudio/IMG-20261105-WA0036_bb0fc27f.jpg',
    cardIndex: 1
  },
  {
    id: 'yermo_volcanico',
    name: 'YERMO VOLCÁNICO PÚRPURA',
    subtitle: 'Mundo volcánico púrpura • Lava roja',
    description: 'Forja legendaria • Volcanes incandescentes • Basalto púrpura',
    badge: '🌋 FUEGO OBSIDIANA',
    features: ['Ríos de magma carmesí', 'Forja de armas celestiales', 'Picos volcánicos', 'Resonancia 528Hz'],
    ambientColor: 0xc026d3,
    fogColor: 0x280620,
    skyColor: 0x190317,
    groundColor: 0x581c87,
    sectorName: 'Yermo Volcánico Púrpura · La Forja Sagrada',
    previewImage: '/assets/aistudio/IMG-20261105-WA0036_bb0fc27f.jpg',
    cardIndex: 2
  }
];

// ==========================================
// MU 3D NEXUS R18 — HYBRID COMBAT EVOLUTION
// ==========================================

export interface R18Skin {
  id: string;
  name: string;
  attack: number;
  defense: number;
  hp: number;
  crit: number;
  lifesteal: number;
  color: number;
  desc: string;
  badge?: string;
}

export const R18_SKINS: R18Skin[] = [
  {
    id: 'venom',
    name: 'Anti Venom Nexus',
    attack: 0.20,
    defense: 0,
    hp: 0,
    crit: 0,
    lifesteal: 0,
    color: 0xff7a1f,
    desc: '+20% daño de habilidad',
    badge: '🔥 FUEGO'
  },
  {
    id: 'shadow',
    name: 'Monarca de las Sombras',
    attack: 0.25,
    defense: 0,
    hp: 0,
    crit: 0.10,
    lifesteal: 0,
    color: 0x713dba,
    desc: '+25% ataque · +10% crítico',
    badge: '🌌 VACÍO'
  },
  {
    id: 'hero',
    name: 'Héroe del Tiempo',
    attack: 0,
    defense: 0.20,
    hp: 0.15,
    crit: 0,
    lifesteal: 0,
    color: 0x24a65a,
    desc: '+20% defensa · +15% vida',
    badge: '🗡️ TRIFUERZA'
  },
  {
    id: 'mecha',
    name: 'Mecha Titán Cibernético',
    attack: 0,
    defense: 0.30,
    hp: 0,
    crit: 0,
    lifesteal: 0,
    color: 0x27d9e8,
    desc: '+30% defensa',
    badge: '🤖 TITÁN'
  },
  {
    id: 'kundun',
    name: 'Señor de Kundun Carmesí',
    attack: 0,
    defense: 0,
    hp: 0,
    crit: 0.35,
    lifesteal: 0,
    color: 0xd93432,
    desc: '+35% daño crítico',
    badge: '👹 KUNDUN'
  },
  {
    id: 'void',
    name: 'Caminante del Vacío',
    attack: 0,
    defense: 0,
    hp: 0,
    crit: 0,
    lifesteal: 0.20,
    color: 0x9b55ff,
    desc: '+20% robo de vida',
    badge: '🩸 DRENAR'
  }
];

export interface R18MountState {
  isMounted: boolean;
  mountName: string;
  speedMultiplier: number;
}

export function calculateMovementSpeed(
  baseSpeed: number,
  isMounted: boolean,
  agility: number = 10
): number {
  const agiMultiplier = 1 + (agility - 10) * 0.015;
  const mountBonus = isMounted ? 1.8 : 1.0;
  return baseSpeed * agiMultiplier * mountBonus;
}

export interface TorlanEnemyArchetype {
  id: string;
  name: string;
  level: number;
  color: number;
  scale: number;
  baseHp: number;
  baseDmg: number;
}

export const TORLAN_MAP_CONFIG = {
  name: 'Cañón Torlan',
  minLevel: 100,
  groundColor: 0x9c5836,
  gridColor: 0x371b25,
  enemies: [
    {
      id: 'torlan_droide',
      name: 'Droide de asalto',
      level: 105,
      color: 0x8799a6,
      scale: 1.2,
      baseHp: 120,
      baseDmg: 24
    },
    {
      id: 'torlan_centinela',
      name: 'Centinela mecánico',
      level: 115,
      color: 0x3aafbf,
      scale: 1.5,
      baseHp: 160,
      baseDmg: 30
    },
    {
      id: 'torlan_titan',
      name: 'Titán Blindado',
      level: 130,
      color: 0x6e3030,
      scale: 2.0,
      baseHp: 280,
      baseDmg: 45
    }
  ]
};

// ==============================================================
// SISTEMA DE LOOT Y DROPS LEGENDARIOS (MU / SOLO LEVELING / ZELDA)
// ==============================================================

export interface WorldLootDrop {
  id: string;
  item: InventoryItem;
  position: { x: number; y: number; z: number };
  rarity: ItemRarity;
  beamHeight: number;
  beamColor: number;
  hexColor: string;
  createdAt: number;
  expiresAt: number;
  isJewel: boolean;
  zenAmount?: number;
}

export const LEGENDARY_LOOT_CATALOG: InventoryItem[] = [
  {
    id: 'jewel_bless',
    name: 'Joya de la Bendición (Jewel of Bless)',
    type: 'jewel',
    icon: '💎',
    rarity: 'legendary',
    description: 'La gema más codiciada de MU Online. Emite un repique celestial al caer y bendice permanentemente el equipo con poder divino.',
    count: 1,
    maxStack: 10,
    stats: { atk: 15, def: 15 }
  },
  {
    id: 'jewel_soul',
    name: 'Joya del Alma (Jewel of Soul)',
    type: 'jewel',
    icon: '🔮',
    rarity: 'legendary',
    description: 'Piedra del alma de Kundun de brillo violeta-cian. Amplifica la probabilidad crítica y absorbe energía cósmica.',
    count: 1,
    maxStack: 10,
    stats: { atk: 20, mana: 40 }
  },
  {
    id: 'dragon_blade',
    name: 'Espada Dragón Carmesí (Dragon Blade)',
    type: 'weapon',
    icon: '🔥',
    rarity: 'legendary',
    description: 'Arma legendaria de Dark Knight forjada en las forjas de Lorencia con escamas de dragón ancestral.',
    count: 1,
    maxStack: 1,
    stats: { atk: 48, def: 12 }
  },
  {
    id: 'rasaka_fang',
    name: 'Dagas Colmillo de Rasaka (Solo Leveling)',
    type: 'weapon',
    icon: '🗡️',
    rarity: 'legendary',
    description: 'Dagas gemelas imbuidas con el veneno paralizante de Rasaka. Permiten tajos supersónicos.',
    count: 1,
    maxStack: 1,
    stats: { atk: 38, spd: 15 }
  },
  {
    id: 'archangel_spear',
    name: 'Lanza Sagrada del Arcángel',
    type: 'weapon',
    icon: '⚡',
    rarity: 'legendary',
    description: 'Reliquia forjada por los Arcángeles para sellar al Señor Oscuro. Desprende un pilar de luz dorada.',
    count: 1,
    maxStack: 1,
    stats: { atk: 52, mana: 25 }
  },
  {
    id: 'hylian_cyber_shield',
    name: 'Escudo Hyliano Cyber 2050',
    type: 'shield',
    icon: '🛡️',
    rarity: 'legendary',
    description: 'Escudo impenetrable con aleación de fotones y el emblema milenario de la Trifuerza.',
    count: 1,
    maxStack: 1,
    stats: { def: 35, hp: 40 }
  },
  {
    id: 'icarus_feather',
    name: 'Pluma de Ícaro (Loch Feather)',
    type: 'relic',
    icon: '🪶',
    rarity: 'epic',
    description: 'Pluma mística indispensable para cruzar el cielo de Ícaro y levitar sobre abismos dimensionales.',
    count: 1,
    maxStack: 1,
    stats: { spd: 25 }
  },
  {
    id: 'zen_pouch_legendary',
    name: 'Cofre de Zen Dorado de Lorencia',
    type: 'zen',
    icon: '💰',
    rarity: 'rare',
    description: 'Contiene una generosa fortuna de monedas Zen doradas de mercaderes de MU.',
    count: 1,
    maxStack: 99
  },
  {
    id: 'elixir_full_restoration',
    name: 'Elixir Sagrado de Restauración Total',
    type: 'potion',
    icon: '🧪',
    rarity: 'epic',
    description: 'Poción suprema que regenera +150 HP y +100 MP al instante.',
    count: 2,
    maxStack: 10,
    stats: { hp: 150, mana: 100 }
  }
];

export function getRarityVisuals(rarity: ItemRarity) {
  switch (rarity) {
    case 'legendary':
      return {
        beamColor: 0xfbbf24, // Radiant gold
        hexColor: '#fbbf24',
        particleColor: 0xffea00,
        beamHeight: 8.5,
        beamRadius: 0.35,
        glowIntensity: 2.5,
        labelBg: 'bg-amber-500/30 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
      };
    case 'epic':
      return {
        beamColor: 0xa855f7, // Astral purple
        hexColor: '#a855f7',
        particleColor: 0xd8b4fe,
        beamHeight: 6.8,
        beamRadius: 0.28,
        glowIntensity: 1.8,
        labelBg: 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.7)]'
      };
    case 'rare':
      return {
        beamColor: 0x38bdf8, // Sky cyan
        hexColor: '#38bdf8',
        particleColor: 0x7dd3fc,
        beamHeight: 5.5,
        beamRadius: 0.22,
        glowIntensity: 1.5,
        labelBg: 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(56,189,248,0.6)]'
      };
    case 'common':
    default:
      return {
        beamColor: 0xe2e8f0, // White silver
        hexColor: '#e2e8f0',
        particleColor: 0xffffff,
        beamHeight: 4.0,
        beamRadius: 0.16,
        glowIntensity: 1.0,
        labelBg: 'bg-slate-700/50 border-slate-500 text-slate-200'
      };
  }
}

/**
 * Generates a loot drop according to enemy category, boss status, and roll chance.
 */
export function rollLootDrop(
  enemyType: string,
  spawnPos: { x: number; y: number; z: number },
  forceSeed?: number
): WorldLootDrop | null {
  const roll = forceSeed !== undefined ? forceSeed : Math.random();

  // Bosses guaranteed drop
  const isBoss = enemyType === 'gohma' || enemyType === 'ganon';
  const isElite = enemyType === 'stalker' || enemyType === 'mu_warrior' || enemyType === 'torlan_titan';

  // Base drop chance: Bosses = 100%, Elite = 75%, Normal = 40%
  const dropChance = isBoss ? 1.0 : isElite ? 0.75 : 0.45;
  if (roll > dropChance && forceSeed === undefined) {
    return null;
  }

  let chosenItem: InventoryItem;
  let zenAmount: number | undefined;

  if (isBoss) {
    // Boss pool: Dragon Blade, Jewel of Bless, Rasaka Fang, Archangel Spear, Hylian Shield
    const bossPool = [
      LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless')!,
      LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'dragon_blade')!,
      LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'rasaka_fang')!,
      LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'archangel_spear')!,
      LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'hylian_cyber_shield')!
    ];
    const idx = Math.floor(Math.random() * bossPool.length);
    chosenItem = { ...bossPool[idx] };
  } else if (isElite) {
    // Elite pool: Jewel of Bless (15%), Jewel of Soul (20%), Icarus Feather (25%), Zen Pouch (40%)
    const subRoll = Math.random();
    if (subRoll < 0.20) {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless')! };
    } else if (subRoll < 0.45) {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_soul')! };
    } else if (subRoll < 0.70) {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'icarus_feather')! };
    } else {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'zen_pouch_legendary')! };
      zenAmount = 180 + Math.floor(Math.random() * 160);
    }
  } else {
    // Normal enemy pool
    const subRoll = Math.random();
    if (subRoll < 0.08) {
      // Rare exciting Jewel of Bless drop from normal mob (Classic MU dopamine moment!)
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless')! };
    } else if (subRoll < 0.16) {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_soul')! };
    } else if (subRoll < 0.45) {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'zen_pouch_legendary')! };
      zenAmount = 40 + Math.floor(Math.random() * 60);
    } else {
      chosenItem = { ...LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'elixir_full_restoration')! };
    }
  }

  const visuals = getRarityVisuals(chosenItem.rarity);
  const isJewel = chosenItem.type === 'jewel';

  return {
    id: `drop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    item: chosenItem,
    position: { ...spawnPos, y: 0.05 },
    rarity: chosenItem.rarity,
    beamHeight: visuals.beamHeight,
    beamColor: visuals.beamColor,
    hexColor: visuals.hexColor,
    createdAt: Date.now(),
    expiresAt: Date.now() + 180000, // 3 minutes before despawn
    isJewel,
    zenAmount
  };
}

// ============================================================================
// 🌀 MATRIZ NEXUS OMEGA N_Ω — SISTEMA DE OPERADORES INTERNOS (T ∘ O ∘ F)
// Formula: N_Ω = (1 / |w|) * Σ_{L=1}^{N} w_L * (T ∘ O ∘ F) |Ψ_Ω⟩
// ============================================================================

export interface NexusStateVector {
  healthRatio: number;     // H ∈ [0, 1]
  manaRatio: number;       // M ∈ [0, 1]
  shadowCoherence: number; // S ∈ [0, 1]
  comboMomentum: number;   // K ∈ [0, 1]
  magnitude: number;
}

export interface NexusLayer {
  index: number;
  name: string;
  symbol: string;
  frequency: number; // Harmonic frequency multiplier (e.g. Golden Ratio phi powers)
  weight: number;    // w_L >= 0
}

export interface NexusOmegaResult {
  stateVector: NexusStateVector;
  totalWeight: number;
  resonanceScore: number;       // 0 to 100+
  damageMultiplier: number;     // 1.0 + bonus
  cooldownReduction: number;    // 0.0 to 0.40
  critRateBonus: number;        // 0.0 to 0.35
  defenseBonus: number;         // Flat defense shield
  vortexPullRadius: number;     // In-game 3D radius (meters)
  dominantOperator: 'T' | 'O' | 'F' | 'HARMONIC';
  auraColorHex: string;
  formulaDescription: string;
}

export const DEFAULT_NEXUS_LAYERS: NexusLayer[] = [
  { index: 1, name: 'Despertar', symbol: '①', frequency: 1.0, weight: 1.0 },
  { index: 2, name: 'Equilibrio', symbol: '②', frequency: 1.618, weight: 1.2 },
  { index: 3, name: 'Integración', symbol: '③', frequency: 2.0, weight: 1.0 },
  { index: 4, name: 'Estructura', symbol: '④', frequency: 2.618, weight: 1.4 },
  { index: 5, name: 'Creación', symbol: '⑤', frequency: 3.1415, weight: 1.5 },
  { index: 6, name: 'Retorno', symbol: '⑥', frequency: 4.236, weight: 1.6 }
];

/**
 * Computes the normalized internal state vector |Ψ_Ω⟩
 */
export function computeNexusStateVector(
  hp: number,
  maxHp: number,
  mana: number,
  maxMana: number,
  shadowCount: number,
  shadowCapacity: number,
  comboStreak: number
): NexusStateVector {
  const h = Math.max(0, Math.min(1, maxHp > 0 ? hp / maxHp : 1));
  const m = Math.max(0, Math.min(1, maxMana > 0 ? mana / maxMana : 1));
  const s = Math.max(0, Math.min(1, shadowCapacity > 0 ? shadowCount / shadowCapacity : 0.5));
  const k = Math.max(0, Math.min(1, comboStreak / 20));

  const magnitude = Math.sqrt(h * h + m * m + s * s + k * k) || 1.0;

  return {
    healthRatio: h,
    manaRatio: m,
    shadowCoherence: s,
    comboMomentum: k,
    magnitude
  };
}

/**
 * Evaluates the operator chain: (T ∘ O ∘ F) |Ψ_Ω⟩
 * F (Fuerza / Fundamento): Anchors central kinetic stability & physical defense
 * O (Orden / Óptica): Harmonizes photonic alignment, mana flux & critical resonance
 * T (Transmutación / Tiempo): Accelerates temporal velocity, cooldowns & vortex circulation
 */
export function evaluateOperatorChain(
  state: NexusStateVector,
  tWeight: number = 1.0,
  oWeight: number = 1.0,
  fWeight: number = 1.0
): [number, number, number, number] {
  // Initial vector components from |Ψ_Ω⟩
  let v0 = state.healthRatio;
  let v1 = state.manaRatio;
  let v2 = state.shadowCoherence;
  let v3 = state.comboMomentum;

  // 1. Operator F (Force / Foundation)
  v0 = v0 * (1 + 0.35 * Math.max(0, fWeight));
  v3 = v3 * (1 + 0.40 * Math.max(0, fWeight));

  // 2. Operator O (Order / Optical)
  v1 = v1 * (1 + 0.40 * Math.max(0, oWeight));
  v2 = v2 * (1 + 0.45 * Math.max(0, oWeight));

  // 3. Operator T (Time / Transmutation)
  v2 = v2 * (1 + 0.30 * Math.max(0, tWeight));
  v3 = v3 * (1 + 0.55 * Math.max(0, tWeight));

  return [v0, v1, v2, v3];
}

/**
 * Calculates the complete Nexus Omega Matrix evaluation:
 * N_Ω = (1 / |w|) * Σ_{L=1}^{N} w_L * (T ∘ O ∘ F) |Ψ_Ω⟩
 */
export function calculateNexusOmegaResonance(
  layers: NexusLayer[],
  state: NexusStateVector,
  operatorWeights: { t: number; o: number; f: number } = { t: 1.0, o: 1.0, f: 1.0 }
): NexusOmegaResult {
  const totalWeight = layers.reduce((acc, layer) => acc + Math.abs(layer.weight), 0);
  const safeWeight = totalWeight > 0.0001 ? totalWeight : 1.0;

  // Evaluate base operator composition (T ∘ O ∘ F) |Ψ_Ω⟩
  const baseTransformed = evaluateOperatorChain(
    state,
    operatorWeights.t,
    operatorWeights.o,
    operatorWeights.f
  );

  // Sum over all layers L=1..N: Σ w_L * frequency_L * transformed
  let sum0 = 0;
  let sum1 = 0;
  let sum2 = 0;
  let sum3 = 0;

  for (const layer of layers) {
    const w = Math.max(0, layer.weight);
    const harmonicScalar = 1.0 + (layer.frequency - 1.0) * 0.15;
    sum0 += w * baseTransformed[0] * harmonicScalar;
    sum1 += w * baseTransformed[1] * harmonicScalar;
    sum2 += w * baseTransformed[2] * harmonicScalar;
    sum3 += w * baseTransformed[3] * harmonicScalar;
  }

  // Multiply by (1 / |w|)
  const nOmegaVector: [number, number, number, number] = [
    sum0 / safeWeight,
    sum1 / safeWeight,
    sum2 / safeWeight,
    sum3 / safeWeight
  ];

  // Resonance score: normalized mean energy percentage
  const avgEnergy = (nOmegaVector[0] + nOmegaVector[1] + nOmegaVector[2] + nOmegaVector[3]) / 4;
  const resonanceScore = Math.min(150, Math.round(avgEnergy * 45));

  // Determine dominant operator
  const tScore = operatorWeights.t;
  const oScore = operatorWeights.o;
  const fScore = operatorWeights.f;

  let dominantOperator: 'T' | 'O' | 'F' | 'HARMONIC' = 'HARMONIC';
  let auraColorHex = '#38bdf8'; // Default Cyan

  if (Math.abs(tScore - oScore) < 0.15 && Math.abs(oScore - fScore) < 0.15) {
    dominantOperator = 'HARMONIC';
    auraColorHex = '#a855f7'; // Prismatic Violet
  } else if (tScore >= oScore && tScore >= fScore) {
    dominantOperator = 'T';
    auraColorHex = '#ec4899'; // Magenta / Temporal
  } else if (oScore >= tScore && oScore >= fScore) {
    dominantOperator = 'O';
    auraColorHex = '#00f0ff'; // Cyan / Photonic
  } else {
    dominantOperator = 'F';
    auraColorHex = '#f59e0b'; // Amber / Kinetic
  }

  // Derive concrete gameplay mechanics:
  const damageMultiplier = 1.0 + Math.min(0.65, (resonanceScore / 100) * 0.35 + (operatorWeights.o * 0.1));
  const cooldownReduction = Math.min(0.40, (resonanceScore / 100) * 0.20 + (operatorWeights.t * 0.1));
  const critRateBonus = Math.min(0.35, (operatorWeights.o * 0.15) + (state.comboMomentum * 0.1));
  const defenseBonus = Math.round(15 + (operatorWeights.f * 20) + (nOmegaVector[0] * 10));
  const vortexPullRadius = 6.0 + Math.min(8.0, (operatorWeights.f * 3.5) + (resonanceScore / 30));

  return {
    stateVector: state,
    totalWeight,
    resonanceScore,
    damageMultiplier,
    cooldownReduction,
    critRateBonus,
    defenseBonus,
    vortexPullRadius,
    dominantOperator,
    auraColorHex,
    formulaDescription: `N_Ω = (1 / |w|) * Σ_{L=1}^{${layers.length}} w_L · (T ∘ O ∘ F) |Ψ_Ω⟩`
  };
}

// ============================================================================
// ⚛️ CÓDIGO UNIVERSAL CUÁNTICO — VECTOR FUNDAMENTAL ΨΩ: [3, 6, 9, 5]
// Sintonización del campo cuántico: Superposición, Proyección, Resonancia, Totalidad
// ============================================================================

export type ModoObservacion = 'superposicion' | 'proyeccion' | 'resonancia' | 'totalidad';

export interface EstadoCuantico {
  valor: number;
  nombre: string;
  hebreo: string;
  egipcio: string;
  maya: string;
  binario: string;
  ingles: string;
  frecuencia: number; // Hz
  descripcion: string;
  simboloEmoji: string;
  activo: boolean;
}

export interface FrecuenciaResonante {
  valor: number;
  unidad: string;
  nombre: string;
  activa: boolean;
}

export const ESTADOS_CUANTICOS_BASE: EstadoCuantico[] = [
  {
    valor: 3,
    nombre: 'ORIGEN',
    hebreo: 'ג',
    egipcio: '𓏾',
    maya: 'Ox',
    binario: '11',
    ingles: 'Source',
    frecuencia: 369.0,
    descripcion: 'La semilla. Todo nace aquí sin perder su esencia.',
    simboloEmoji: '🌱',
    activo: true
  },
  {
    valor: 6,
    nombre: 'CICLO',
    hebreo: 'ו',
    egipcio: '𓿙',
    maya: 'Wac',
    binario: '110',
    ingles: 'Cycle',
    frecuencia: 432.0,
    descripcion: 'Equilibrio. Lo que gira regresa renovado.',
    simboloEmoji: '🔄',
    activo: true
  },
  {
    valor: 9,
    nombre: 'TOTALIDAD',
    hebreo: 'ט',
    egipcio: '𓐁',
    maya: 'Bolon',
    binario: '1001',
    ingles: 'Wholeness',
    frecuencia: 528.0,
    descripcion: 'La completitud. Nada falta. Nada sobra.',
    simboloEmoji: '♾️',
    activo: true
  },
  {
    valor: 5,
    nombre: 'PRESENCIA',
    hebreo: 'ה',
    egipcio: '𓃭',
    maya: 'Ho',
    binario: '101',
    ingles: 'Presence',
    frecuencia: 639.0,
    descripcion: 'Manifestación. Aquí y ahora. Tú en el mundo.',
    simboloEmoji: '🧘',
    activo: true
  }
];

export interface NodoEneadaNexus {
  numero: number;
  egipcio: string;
  hebreo: string;
  parGlifo: string;
  nombre: string;
  significado: string;
  frecuencia?: number;
  esVorticial: boolean;
}

export const NODOS_ENEADA_NEXUS: NodoEneadaNexus[] = [
  { numero: 1, egipcio: '𓊽', hebreo: 'א', parGlifo: '𓊽א', nombre: 'Pilar Primordial (Djed - Alef)', significado: 'Estabilidad cósmica inamovible', esVorticial: false },
  { numero: 2, egipcio: '𓃠', hebreo: 'ב', parGlifo: '𓃠ב', nombre: 'Templo de Bastet (Bet)', significado: 'Receptáculo sagrado y dualidad armónica', esVorticial: false },
  { numero: 3, egipcio: '𓄿', hebreo: 'ג', parGlifo: '𓄿ג', nombre: 'ORIGEN (Gimel)', significado: 'Semilla primordial del vórtice', frecuencia: 369.0, esVorticial: true },
  { numero: 4, egipcio: '𓁹', hebreo: 'ד', parGlifo: '𓁹ד', nombre: 'Ojo de Horus (Dalet)', significado: 'Portal de visión cuántica y apertura', esVorticial: false },
  { numero: 5, egipcio: '𓋴', hebreo: 'ה', parGlifo: '𓋴ה', nombre: 'PRESENCIA (He)', significado: 'El observador consciente aquí y ahora', frecuencia: 639.0, esVorticial: true },
  { numero: 6, egipcio: '𓇳', hebreo: 'ו', parGlifo: '𓇳ו', nombre: 'CICLO (Ra - Vav)', significado: 'Flujo solar y circulación incesante', frecuencia: 432.0, esVorticial: true },
  { numero: 7, egipcio: '𓇏', hebreo: 'ז', parGlifo: '𓇏ז', nombre: 'Espada de Papiro (Zayin)', significado: 'Conexión y discernimiento de vida', esVorticial: false },
  { numero: 8, egipcio: '𓐍', hebreo: 'ח', parGlifo: '𓐍ח', nombre: 'Criba Sagrada (Chet)', significado: 'Filtro de resonancia pura', esVorticial: false },
  { numero: 9, egipcio: '𓇙', hebreo: 'ט', parGlifo: '𓇙ט', nombre: 'TOTALIDAD (Corona - Tet)', significado: 'Integración absoluta del ser', frecuencia: 528.0, esVorticial: true }
];

export interface ProyeccionCuantica {
  simbolos: string[];
  texto: string;
  [key: string]: string | string[];
}

export class CodigoUniversalCuantico {
  readonly omega: [number, number, number, number] = [3, 6, 9, 5];
  readonly frecuenciaUnion: number = 9.5; // Frecuencia Uva 9.5 Hz
  readonly base: EstadoCuantico[];
  readonly frecuencias: FrecuenciaResonante[];
  readonly eneada: NodoEneadaNexus[] = NODOS_ENEADA_NEXUS;
  private _historial: Array<{ tipo: string; detalle: string; timestamp: number }> = [];

  constructor(estados: EstadoCuantico[] = ESTADOS_CUANTICOS_BASE) {
    this.base = estados.map((e) => ({ ...e }));
    this.frecuencias = [
      { valor: 9.5, unidad: 'Hz', nombre: 'Frecuencia Uva', activa: true },
      { valor: 432.0, unidad: 'Hz', nombre: 'Tono Central', activa: true },
      { valor: 528.0, unidad: 'Hz', nombre: 'Sanación', activa: false }
    ];
  }

  selloUniversal() {
    const glifos = '𓊽א 𓃠ב 𓄿ג 𓁹ד 𓋴ה 𓇳ו 𓇏ז 𓐍ח 𓇙ט 💠🔻∞ ·';
    const res = {
      glifos,
      pares: this.eneada.map((n) => n.parGlifo),
      vectorPsiOmega: this.omega,
      nodosEneada: this.eneada,
      frecuenciaUva: this.frecuenciaUnion,
      simbolosCierre: {
        diamante: '💠 Cristal de Lorencia / Resonancia Pura',
        trifuerza: '🔻 Triángulo de Luz / Sello de Hyrule',
        infinito: '∞ Circulación Vorticial Continua',
        puntoCentral: '· Centro Inmóvil Inmutable'
      },
      estado: 'ARMONIZADO_TOTAL'
    };
    this._registrarObservacion('selloUniversal', glifos);
    return res;
  }

  proyectar(lenguajeObjetivo: string): ProyeccionCuantica {
    const lang = lenguajeObjetivo.toLowerCase().trim();
    const mapa: ProyeccionCuantica = {
      simbolos: [],
      texto: ''
    };
    const simbolosLimpios: string[] = [];

    for (const estado of this.base) {
      let simbolo: string;
      if (lang === 'frecuencia') {
        simbolo = `${estado.frecuencia} Hz`;
      } else if (lang === 'maya') {
        simbolo = estado.maya;
      } else if (lang === 'hebreo') {
        simbolo = estado.hebreo;
      } else if (lang === 'egipcio') {
        simbolo = estado.egipcio;
      } else if (lang === 'binario') {
        simbolo = estado.binario;
      } else if (lang === 'ingles' || lang === 'english') {
        simbolo = estado.ingles;
      } else {
        const anyVal = (estado as unknown as Record<string, unknown>)[lang];
        simbolo = typeof anyVal === 'string' ? anyVal : estado.binario;
      }
      mapa[estado.nombre] = simbolo;
      simbolosLimpios.push(simbolo);
    }
    mapa.simbolos = simbolosLimpios;
    mapa.texto = simbolosLimpios.join(', ');
    this._registrarObservacion('proyeccion', lenguajeObjetivo);
    return mapa;
  }

  ciclo(pasos: number = 4): string[] & { texto: string } {
    const secuenciaBase = ['ORIGEN', 'CICLO', 'TOTALIDAD', 'PRESENCIA'];
    const resultado: string[] = [];
    for (let i = 0; i < pasos; i++) {
      resultado.push(secuenciaBase[i % secuenciaBase.length]);
    }
    const res = Object.assign(resultado, {
      texto: resultado.join(' → ')
    });
    this._registrarObservacion('ciclo', res.texto);
    return res;
  }

  resonar() {
    const alineadas = this.base.map((e) => ({
      valor: e.valor,
      nombre: e.nombre,
      frecuencia: e.frecuencia,
      unidad: 'Hz',
      simbolo: e.simboloEmoji,
      activa: true
    }));

    const res = {
      estado: 'ALINEADO',
      frecuenciaUva: this.frecuenciaUnion,
      unidadUva: 'Hz',
      frecuenciasAlineadas: alineadas,
      armonicos: [369.0, 432.0, 528.0, 639.0],
      campoVorticial: 'ESTABLE_INMUTABLE',
      resonanciaGlobal: 1.0,
      mensaje: 'Frecuencias alineadas al punto inmóvil del vórtice. Frecuencia Uva 9.5 Hz en resonancia armónica.'
    };
    this._registrarObservacion('resonar', `Frecuencias [${res.armonicos.join(', ')}] + Uva ${res.frecuenciaUva} Hz`);
    return res;
  }

  manifiesto(): string {
    const texto = `
╔══════════════════════════════════════════════════════════════════════════╗
║   🌀 MANIFIESTO DEL CÓDIGO UNIVERSAL NEXUS · SISTEMA ΨΩ [3-6-9-5]       ║
║   DONDE LA ECUACIÓN GIRA Y LA FORMA RESPIRA                              ║
║   DIMENSIONES: 19 · UNIVERSOS: 50 · NODOS: 22 · GIROS: 6                ║
╚══════════════════════════════════════════════════════════════════════════╝

1. EL VÓRTICE DEL ORIGEN:
   ∇ · F = 0 → El centro no se dispersa. Permanece inmóvil en tu esencia.
   ∇ × F ≠ 0 → Todo lo demás orbita en circulación continua alrededor del centro.

2. EL VECTOR FUNDAMENTAL ΨΩ:
   🌱 [3] ORIGEN     — Semilla primordial (369 Hz) · Hebreo: ג · Egipcio: 𓏾 · Maya: Ox
   🔄 [6] CICLO      — Ritmo y circulación continua (432 Hz) · Hebreo: ו · Egipcio: 𓿙 · Maya: Wac
   ♾️ [9] TOTALIDAD  — Integración absoluta (528 Hz) · Hebreo: ט · Egipcio: 𓐁 · Maya: Bolon
   🧘 [5] PRESENCIA  — El observador aquí y ahora (639 Hz) · Hebreo: ה · Egipcio: 𓃭 · Maya: Ho

3. LA FRECUENCIA DE UNIÓN:
   🍇 Frecuencia Uva (9.5 Hz) — Resonancia armónica unificadora del campo.

4. SUPERPOSICIÓN UNIVERSAL:
   La verdad existe simultáneamente en todos los lenguajes sin división.
   No se cambia la verdad; se ajusta el lente con el que se observa.
    `.trim();
    this._registrarObservacion('manifiesto', 'Lectura de Manifiesto');
    return texto;
  }

  transformar(origen: keyof EstadoCuantico, destino: keyof EstadoCuantico, valor: string | number): string | null {
    for (const estado of this.base) {
      if (String(estado[origen]).toLowerCase() === String(valor).toLowerCase()) {
        const resultado = String(estado[destino]);
        this._registrarObservacion('transformacion', `${String(origen)}→${String(destino)}:${valor}`);
        return resultado;
      }
    }
    return null;
  }

  superposicion(modo: 'completo' | 'simbolos' = 'completo'): string {
    let output = '⚛️ ESTADO ΨΩ — TODAS LAS VOCES SIMULTÁNEAS\n';
    for (const estado of this.base) {
      if (modo === 'simbolos') {
        output += `${estado.simboloEmoji} [${estado.valor}] ${estado.nombre}: ${estado.hebreo} · ${estado.egipcio} · ${estado.maya} · ${estado.ingles}\n`;
      } else {
        output += `${estado.simboloEmoji} [${estado.valor}] ${estado.nombre} (${estado.frecuencia} Hz) | He: ${estado.hebreo} | Eg: ${estado.egipcio} | My: ${estado.maya} | Bin: ${estado.binario} | ${estado.ingles}: "${estado.descripcion}"\n`;
      }
    }
    this._registrarObservacion('superposicion', modo);
    return output;
  }

  observar(intencion: string = "Reconocer la verdad") {
    const superposicionTexto = `
⚛️ ESTADO ΨΩ — TODAS LAS VOCES CANTANDO AL MISMO TIEMPO

🇮🇱 ג  ו  ט  ה
🏛️ 𓏾 𓿙 𓐁 𓃭
🌽 Ox Wac Bolon Ho
⚪⚫ 11 110 1001 101
🇬🇧 Source Cycle Wholeness Presence
💻 ORIGEN → CICLO → TOTALIDAD → PRESENCIA

🟣🍇⚡ FRECUENCIA UVA 9.5 Hz — ACTIVADA EN SUPERPOSICIÓN
    `.trim();

    this._registrarObservacion('observacion', intencion || 'Reconocer la verdad');

    return {
      estadoUnificado: true,
      frecuenciaResonante: this.frecuenciaUnion,
      mensaje: 'No eliges una perspectiva. Reconoces que todas apuntan al mismo centro.',
      origen: 3,
      ciclo: 6,
      totalidad: 9,
      presencia: 5,
      superposicionTexto,
      buffMultipliers: {
        atk: 1.35,
        def: 1.25,
        crit: 0.30,
        speed: 1.25
      }
    };
  }

  calcularSintonizacionCuantica(modo: ModoObservacion, valorEstadoActivo: number = 3) {
    const estado = this.base.find((e) => e.valor === valorEstadoActivo) || this.base[0];
    let buffAtk = 1.0;
    let buffSpd = 1.0;
    let buffDef = 1.0;
    let auraColor = '#38bdf8';

    switch (modo) {
      case 'superposicion':
        buffAtk = 1.25;
        buffSpd = 1.20;
        buffDef = 1.20;
        auraColor = '#a855f7'; // Violeta cuántico
        break;
      case 'proyeccion':
        if (estado.valor === 3) buffAtk = 1.35; // Origen: ataque primigenio
        if (estado.valor === 6) buffSpd = 1.35; // Ciclo: velocidad de giro
        if (estado.valor === 9) buffAtk = 1.20; buffDef = 1.25; // Totalidad
        if (estado.valor === 5) buffDef = 1.35; // Presencia
        auraColor = estado.valor === 3 ? '#10b981' : estado.valor === 6 ? '#06b6d4' : estado.valor === 9 ? '#f59e0b' : '#ec4899';
        break;
      case 'resonancia':
        buffAtk = 1.15;
        buffSpd = 1.15;
        buffDef = 1.15;
        auraColor = '#00f0ff'; // Azul resonancia
        break;
      case 'totalidad':
        buffAtk = 1.30;
        buffSpd = 1.25;
        buffDef = 1.30;
        auraColor = '#fbbf24'; // Oro total
        break;
    }

    return {
      estado,
      modo,
      buffAtk,
      buffSpd,
      buffDef,
      auraColor,
      frequencyHz: estado.frecuencia
    };
  }

  private _registrarObservacion(tipo: string, detalle: string) {
    this._historial.push({ tipo, detalle, timestamp: Date.now() });
    if (this._historial.length > 50) this._historial.shift();
  }

  getHistorial() {
    return [...this._historial];
  }
}

// ⚛️ Instancia Global Universal lista para invocación directa
export const YO_SOY = new CodigoUniversalCuantico();
