import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BESTIARY_DATA,
  INITIAL_ACHIEVEMENTS,
  INITIAL_INVENTORY_ITEMS,
  evaluateAchievements,
  calculateCombatDamage,
  calculateLevelAndXp,
  formatNumber,
  calculateShadowCapacity,
  calculateExtractionChance,
  determineEnemyShadowRank,
  R18_SKINS,
  calculateMovementSpeed,
  LEGENDARY_LOOT_CATALOG,
  getRarityVisuals,
  rollLootDrop,
  computeNexusStateVector,
  evaluateOperatorChain,
  calculateNexusOmegaResonance,
  DEFAULT_NEXUS_LAYERS,
  CodigoUniversalCuantico,
  ESTADOS_CUANTICOS_BASE,
  YO_SOY,
  NODOS_ENEADA_NEXUS
} from './logic.ts';

test('Bestiary data contains essential enemy archetypes and bosses', () => {
  assert.ok(BESTIARY_DATA.length >= 8);
  const gohma = BESTIARY_DATA.find((e) => e.id === 'gohma');
  assert.ok(gohma);
  assert.equal(gohma.baseHp, 300);
  assert.equal(gohma.category, 'boss');

  const ganon = BESTIARY_DATA.find((e) => e.id === 'ganon');
  assert.ok(ganon);
  assert.equal(ganon.category, 'boss');

  const stalker = BESTIARY_DATA.find((e) => e.id === 'stalker');
  assert.ok(stalker);
  assert.equal(stalker.category, 'elite');
});

test('Initial inventory contains weapons, shields, potions, and relics', () => {
  assert.ok(INITIAL_INVENTORY_ITEMS.length >= 7);
  const weapon = INITIAL_INVENTORY_ITEMS.find((i) => i.type === 'weapon');
  assert.ok(weapon);
  const shield = INITIAL_INVENTORY_ITEMS.find((i) => i.type === 'shield');
  assert.ok(shield);
  const bomb = INITIAL_INVENTORY_ITEMS.find((i) => i.type === 'bomb');
  assert.ok(bomb);
  const relic = INITIAL_INVENTORY_ITEMS.find((i) => i.type === 'relic');
  assert.ok(relic);
});

test('Achievement evaluation for 50 kills unlocks slayer_grandmaster_50', () => {
  const result = evaluateAchievements(INITIAL_ACHIEVEMENTS, {
    hasStarted: true,
    hasSword: true,
    hasShield: false,
    hasRelic: false,
    kills: 50,
    gohmaDefeated: false,
    hyruleUnlocked: false,
    allLevelsDiscovered: false,
    discoveredCount: 1,
    totalKills: 52,
    playerLevel: 4,
    hasEquippedAllSlots: false
  });

  const grandmaster = result.updated.find((a) => a.id === 'slayer_grandmaster_50');
  assert.ok(grandmaster);
  assert.equal(grandmaster.unlocked, true);
  assert.equal(grandmaster.progress, 50);

  const newlyFound = result.newlyUnlocked.find((a) => a.id === 'slayer_grandmaster_50');
  assert.ok(newlyFound);
});

test('Achievement evaluation for discovering all levels unlocks discover_all_levels', () => {
  const result = evaluateAchievements(INITIAL_ACHIEVEMENTS, {
    hasStarted: true,
    hasSword: true,
    hasShield: true,
    hasRelic: true,
    kills: 5,
    gohmaDefeated: false,
    hyruleUnlocked: false,
    allLevelsDiscovered: true,
    discoveredCount: 5,
    totalKills: 5,
    playerLevel: 10,
    hasEquippedAllSlots: true
  });

  const cartographer = result.updated.find((a) => a.id === 'discover_all_levels');
  assert.ok(cartographer);
  assert.equal(cartographer.unlocked, true);

  const monarch = result.updated.find((a) => a.id === 'solo_leveling_monarch');
  assert.ok(monarch);
  assert.equal(monarch.unlocked, true);

  const collector = result.updated.find((a) => a.id === 'aqw_collector');
  assert.ok(collector);
  assert.equal(collector.unlocked, true);
});

test('Combat damage calculation applies variance and critical hit correctly', () => {
  const dmgNormal = calculateCombatDamage(20, false, 1.0);
  assert.ok(dmgNormal >= 18 && dmgNormal <= 24);

  const dmgCrit = calculateCombatDamage(20, true, 1.0);
  assert.ok(dmgCrit >= 30);
});

test('calculateLevelAndXp handles progression smoothly', () => {
  const lvl1 = calculateLevelAndXp(50);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.currentXp, 50);

  const lvlUp = calculateLevelAndXp(120);
  assert.equal(lvlUp.level, 2);
  assert.equal(lvlUp.currentXp, 20);
});

test('formatNumber formats thousands and millions cleanly', () => {
  assert.equal(formatNumber(500), '500');
  assert.equal(formatNumber(1500), '1.5K');
  assert.equal(formatNumber(2000000), '2.0M');
});

test('Solo Leveling shadow capacity scales with INT and player level', () => {
  const capLow = calculateShadowCapacity(10, 1);
  assert.equal(capLow, 3 + 2 + 0); // 5 shadows

  const capHigh = calculateShadowCapacity(25, 6);
  assert.equal(capHigh, 3 + 5 + 3); // 11 shadows
});

test('Solo Leveling extraction chance respects rank and decreases with attempts', () => {
  const att1 = calculateExtractionChance(1, 10, 10, 'soldier', 1);
  const att2 = calculateExtractionChance(1, 10, 10, 'soldier', 2);
  const att3 = calculateExtractionChance(1, 10, 10, 'soldier', 3);

  assert.ok(att1 > att2);
  assert.ok(att2 > att3);
  assert.ok(att1 >= 0.8);

  const bossAtt1 = calculateExtractionChance(1, 10, 10, 'commander', 1);
  assert.ok(bossAtt1 < att1);
});

test('determineEnemyShadowRank accurately maps Gohma to Commander and others to appropriate ranks', () => {
  const gohmaRank = determineEnemyShadowRank('gohma');
  assert.equal(gohmaRank.rank, 'commander');
  assert.equal(gohmaRank.manaCost, 50);

  const stalkerRank = determineEnemyShadowRank('stalker');
  assert.equal(stalkerRank.rank, 'knight');

  const droneRank = determineEnemyShadowRank('drone');
  assert.equal(droneRank.rank, 'elite');

  const sombraRank = determineEnemyShadowRank('sombra');
  assert.equal(sombraRank.rank, 'soldier');
});

test('R18 skins catalog has 6 valid skins with corresponding buffs', () => {
  assert.equal(R18_SKINS.length, 6);
  const venom = R18_SKINS.find(s => s.id === 'venom');
  assert.ok(venom && venom.attack === 0.20);
  const shadow = R18_SKINS.find(s => s.id === 'shadow');
  assert.ok(shadow && shadow.attack === 0.25 && shadow.crit === 0.10);
});

test('calculateMovementSpeed applies 80% mount boost when mounted', () => {
  const normalSpeed = calculateMovementSpeed(10, false, 10);
  const mountedSpeed = calculateMovementSpeed(10, true, 10);
  assert.equal(normalSpeed, 10);
  assert.equal(mountedSpeed, 18);
});

test('LEGENDARY_LOOT_CATALOG contains iconic MU Online and Solo Leveling items', () => {
  const bless = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_bless');
  assert.ok(bless);
  assert.equal(bless.type, 'jewel');
  assert.equal(bless.rarity, 'legendary');

  const soul = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'jewel_soul');
  assert.ok(soul);
  assert.equal(soul.type, 'jewel');

  const dragonBlade = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'dragon_blade');
  assert.ok(dragonBlade);
  assert.equal(dragonBlade.rarity, 'legendary');
  assert.ok(dragonBlade.stats?.atk && dragonBlade.stats.atk >= 40);

  const rasaka = LEGENDARY_LOOT_CATALOG.find((i) => i.id === 'rasaka_fang');
  assert.ok(rasaka);
  assert.equal(rasaka.rarity, 'legendary');
});

test('getRarityVisuals assigns highest light beam and glow to legendary and epic', () => {
  const leg = getRarityVisuals('legendary');
  const epic = getRarityVisuals('epic');
  const rare = getRarityVisuals('rare');
  const common = getRarityVisuals('common');

  assert.ok(leg.beamHeight > epic.beamHeight);
  assert.ok(epic.beamHeight > rare.beamHeight);
  assert.ok(rare.beamHeight > common.beamHeight);
  assert.equal(leg.hexColor, '#fbbf24');
});

test('rollLootDrop returns guaranteed legendary/epic drop for boss enemies', () => {
  const bossDrop = rollLootDrop('gohma', { x: 0, y: 0, z: -10 }, 0.1);
  assert.ok(bossDrop);
  assert.equal(bossDrop.rarity, 'legendary');
  assert.ok(bossDrop.beamHeight >= 8.0);
  assert.ok(bossDrop.expiresAt > Date.now());
});

test('computeNexusStateVector normalizes player vitals and generates magnitude', () => {
  const state = computeNexusStateVector(100, 100, 50, 100, 4, 10, 10);
  assert.equal(state.healthRatio, 1.0);
  assert.equal(state.manaRatio, 0.5);
  assert.equal(state.shadowCoherence, 0.4);
  assert.equal(state.comboMomentum, 0.5);
  assert.ok(state.magnitude > 1.0);
});

test('evaluateOperatorChain applies (T ∘ O ∘ F) transformation chain in sequence', () => {
  const state = computeNexusStateVector(100, 100, 100, 100, 10, 10, 20);
  const transformed = evaluateOperatorChain(state, 1.0, 1.0, 1.0);
  assert.equal(transformed.length, 4);
  // All components must be amplified by the operator composition
  assert.ok(transformed[0] > state.healthRatio);
  assert.ok(transformed[1] > state.manaRatio);
  assert.ok(transformed[2] > state.shadowCoherence);
  assert.ok(transformed[3] > state.comboMomentum);
});

test('calculateNexusOmegaResonance computes normalized matrix N_Omega across layers', () => {
  const state = computeNexusStateVector(80, 100, 60, 100, 5, 10, 8);
  const result = calculateNexusOmegaResonance(DEFAULT_NEXUS_LAYERS, state, { t: 1.2, o: 1.0, f: 0.8 });

  assert.ok(result.totalWeight > 0);
  assert.ok(result.resonanceScore >= 0 && result.resonanceScore <= 150);
  assert.ok(result.damageMultiplier >= 1.0);
  assert.ok(result.cooldownReduction >= 0 && result.cooldownReduction <= 0.40);
  assert.ok(result.critRateBonus >= 0 && result.critRateBonus <= 0.35);
  assert.ok(result.vortexPullRadius >= 6.0);
  assert.equal(result.dominantOperator, 'T'); // t is highest
  assert.equal(result.auraColorHex, '#ec4899');
  assert.ok(result.formulaDescription.includes('N_Ω'));
});

test('CodigoUniversalCuantico initializes fundamental vector Psi_Omega [3, 6, 9, 5]', () => {
  const qc = new CodigoUniversalCuantico();
  assert.deepEqual(qc.omega, [3, 6, 9, 5]);
  assert.equal(qc.base.length, 4);

  const origen = qc.base.find((e) => e.valor === 3);
  assert.ok(origen);
  assert.equal(origen.nombre, 'ORIGEN');
  assert.equal(origen.frecuencia, 369.0);
  assert.equal(origen.maya, 'Ox');

  const totalidad = qc.base.find((e) => e.valor === 9);
  assert.ok(totalidad);
  assert.equal(totalidad.frecuencia, 528.0);
  assert.equal(totalidad.binario, '1001');
});

test('CodigoUniversalCuantico proyectar extracts symbols in target language', () => {
  const qc = new CodigoUniversalCuantico();
  const hebreoMap = qc.proyectar('hebreo');
  assert.ok(hebreoMap['ORIGEN'].includes('ג'));
  assert.ok(hebreoMap['TOTALIDAD'].includes('ט'));

  const freqMap = qc.proyectar('frecuencia');
  assert.ok(freqMap['ORIGEN'].includes('369 Hz'));
  assert.ok(freqMap['CICLO'].includes('432 Hz'));
});

test('CodigoUniversalCuantico transformar converts between symbols without loss', () => {
  const qc = new CodigoUniversalCuantico();
  const mayaFromVal = qc.transformar('valor', 'maya', 6);
  assert.equal(mayaFromVal, 'Wac');

  const freqFromHebrew = qc.transformar('hebreo', 'frecuencia', 'ט');
  assert.equal(freqFromHebrew, '528');

  const binaryFromEg = qc.transformar('egipcio', 'binario', '𓏾');
  assert.equal(binaryFromEg, '11');
});

test('CodigoUniversalCuantico superposicion renders all states simultaneously', () => {
  const qc = new CodigoUniversalCuantico();
  const text = qc.superposicion('completo');
  assert.ok(text.includes('ESTADO ΨΩ'));
  assert.ok(text.includes('ORIGEN'));
  assert.ok(text.includes('TOTALIDAD'));
  assert.ok(text.includes('PRESENCIA'));
});

test('CodigoUniversalCuantico calcularSintonizacionCuantica returns buff modifiers', () => {
  const qc = new CodigoUniversalCuantico();
  const sup = qc.calcularSintonizacionCuantica('superposicion', 3);
  assert.equal(sup.buffAtk, 1.25);
  assert.equal(sup.auraColor, '#a855f7');

  const tot = qc.calcularSintonizacionCuantica('totalidad', 9);
  assert.equal(tot.buffAtk, 1.30);
  assert.equal(tot.auraColor, '#fbbf24');
  assert.equal(tot.frequencyHz, 528.0);
});

test('CodigoUniversalCuantico observar collapses wave function with unified state and 9.5Hz frequency', () => {
  const qc = new CodigoUniversalCuantico();
  const res = qc.observar('Leo en todos los lenguajes del universo');
  assert.equal(res.estadoUnificado, true);
  assert.equal(res.frecuenciaResonante, 9.5);
  assert.equal(res.origen, 3);
  assert.equal(res.ciclo, 6);
  assert.equal(res.totalidad, 9);
  assert.equal(res.presencia, 5);
  assert.ok(res.superposicionTexto.includes('FRECUENCIA UVA 9.5 Hz'));
  assert.ok(res.superposicionTexto.includes('𓏾'));
  assert.ok(res.buffMultipliers.atk >= 1.30);
});

test('YO_SOY implements exact user workflow: observar, proyectar, ciclo, resonar, manifiesto', () => {
  assert.ok(YO_SOY instanceof CodigoUniversalCuantico);

  // 1. Observar
  const obs = YO_SOY.observar('Mi intención aquí');
  assert.equal(obs.estadoUnificado, true);
  assert.equal(obs.frecuenciaResonante, 9.5);

  // 2. Proyectar a maya
  const maya = YO_SOY.proyectar('maya');
  assert.deepEqual(maya.simbolos, ['Ox', 'Wac', 'Bolon', 'Ho']);
  assert.equal(maya['ORIGEN'], 'Ox');
  assert.equal(maya['CICLO'], 'Wac');
  assert.equal(maya['TOTALIDAD'], 'Bolon');
  assert.equal(maya['PRESENCIA'], 'Ho');

  // 3. Recorrer el ciclo
  const c4 = YO_SOY.ciclo(4);
  assert.deepEqual([...c4], ['ORIGEN', 'CICLO', 'TOTALIDAD', 'PRESENCIA']);
  assert.equal(c4.texto, 'ORIGEN → CICLO → TOTALIDAD → PRESENCIA');

  // 4. Ver frecuencias alineadas
  const res = YO_SOY.resonar();
  assert.equal(res.estado, 'ALINEADO');
  assert.equal(res.frecuenciaUva, 9.5);
  assert.deepEqual(res.armonicos, [369.0, 432.0, 528.0, 639.0]);
  assert.equal(res.resonanciaGlobal, 1.0);

  // 5. Leer el manifiesto
  const textoManifiesto = YO_SOY.manifiesto();
  assert.ok(textoManifiesto.includes('MANIFIESTO DEL CÓDIGO UNIVERSAL NEXUS'));
  assert.ok(textoManifiesto.includes('FRECUENCIA DE UNIÓN'));
  assert.ok(textoManifiesto.includes('9.5 Hz'));
});

test('NODOS_ENEADA_NEXUS aligns 9 sacred Egyptian-Hebrew pairs and selloUniversal', () => {
  assert.equal(NODOS_ENEADA_NEXUS.length, 9);

  // Check 1 to 9 pairs
  assert.equal(NODOS_ENEADA_NEXUS[0].parGlifo, '𓊽א');
  assert.equal(NODOS_ENEADA_NEXUS[1].parGlifo, '𓃠ב');
  assert.equal(NODOS_ENEADA_NEXUS[2].parGlifo, '𓄿ג');
  assert.equal(NODOS_ENEADA_NEXUS[3].parGlifo, '𓁹ד');
  assert.equal(NODOS_ENEADA_NEXUS[4].parGlifo, '𓋴ה');
  assert.equal(NODOS_ENEADA_NEXUS[5].parGlifo, '𓇳ו');
  assert.equal(NODOS_ENEADA_NEXUS[6].parGlifo, '𓇏ז');
  assert.equal(NODOS_ENEADA_NEXUS[7].parGlifo, '𓐍ח');
  assert.equal(NODOS_ENEADA_NEXUS[8].parGlifo, '𓇙ט');

  // Verify vortex nodes match 3, 6, 9, 5
  const vortexNodes = NODOS_ENEADA_NEXUS.filter((n) => n.esVorticial);
  assert.equal(vortexNodes.length, 4);
  const vortNums = vortexNodes.map((n) => n.numero).sort();
  assert.deepEqual(vortNums, [3, 5, 6, 9]);

  // Check YO_SOY.selloUniversal()
  const sello = YO_SOY.selloUniversal();
  assert.equal(sello.glifos, '𓊽א 𓃠ב 𓄿ג 𓁹ד 𓋴ה 𓇳ו 𓇏ז 𓐍ח 𓇙ט 💠🔻∞ ·');
  assert.equal(sello.estado, 'ARMONIZADO_TOTAL');
  assert.equal(sello.frecuenciaUva, 9.5);
  assert.deepEqual(sello.vectorPsiOmega, [3, 6, 9, 5]);
});







