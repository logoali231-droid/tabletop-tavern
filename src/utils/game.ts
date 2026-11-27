import {
  achievementsData,
  buildingsData,
  diceSetData,
  gardenHybridsData,
  gardenSeedsData,
  hybridRecipes,
  goldenEffects,
  prestigeUpgradesData,
  studioData,
  upgradesData,
} from '../data/gameData';
import {
  Boost,
  BuildingData,
  BuyAmount,
  DieData,
  GameState,
  GardenPlot,
  GoldenEffect,
  Production,
  ResourceType,
  SeedData,
  StudioUpgradeData,
} from '../types';
import { formatNumber } from './format';

export const SAVE_KEY = 'tabletop-tavern-save-v2';
export const LEGACY_SAVE_KEY = 'tabletopTavernSaveReact';
export const COST_GROWTH = 1.15;
export const ACHIEVEMENT_BONUS = 0.02;
export const SELL_REFUND = 0.5;
export const DICE_ROLL_COST = 10;
/** Rolling with advantage costs this much more, unless the blessing makes it free. */
export const ADVANTAGE_COST_MULT = 2.5;
export const GARDEN_MAX_SLOTS = 9;
export const GARDEN_SPEEDUP_COST = 5;
export const GARDEN_SPEEDUP_SECONDS = 30;
/** Upper bound for one "Max" purchase, so the loop stays cheap. */
const MAX_BULK_BUY = 1000;

export const RESOURCES: { id: ResourceType; label: string; short: string; icon: string }[] = [
  { id: 'players', label: 'Jogadores', short: 'Jogadores', icon: '/icons/players.svg' },
  { id: 'gold', label: 'Ouro', short: 'Ouro', icon: '/icons/gold.svg' },
  { id: 'dice', label: 'Dados', short: 'Dados', icon: '/icons/dice.svg' },
  { id: 'inspiration', label: 'Inspiração', short: 'Inspiração', icon: '/icons/inspiration.svg' },
  { id: 'fate', label: 'Destino', short: 'Destino', icon: '/icons/fate.svg' },
];

export const RESOURCE_IDS: ResourceType[] = RESOURCES.map((resource) => resource.id);

type EarnedKey = 'playersEarned' | 'goldEarned' | 'diceEarned' | 'inspirationEarned' | 'fateEarned';

export interface OfflineReport {
  seconds: number;
  gains: Production;
}

export interface PlotStatus {
  index: number;
  plot: GardenPlot;
  seed: SeedData;
  progress: number;
  mature: boolean;
  secondsLeft: number;
  synergy: boolean;
}

export function createEmptyProduction(): Production {
  return { players: 0, gold: 0, dice: 0, inspiration: 0, fate: 0 };
}

export function createInitialState(): GameState {
  return {
    players: 0, playersEarned: 0,
    gold: 0, goldEarned: 0,
    dice: 0, diceEarned: 0,
    inspiration: 0, inspirationEarned: 0,
    fate: 0, fateEarned: 0,
    clicks: 0, clickMultiplier: 1, globalMultiplier: 1,
    buildings: {}, buildingMultipliers: {},
    upgradesBought: [],
    campaigns: 0, campaignMultiplier: 1, prestigeUpgradesBought: [],
    achievements: [],
    goldenDiceCollected: 0,
    diceRolls: 0,
    playTime: 0,
    lastSeen: Date.now(),
    activeBoosts: [],
    garden: [],
    plotsHarvested: 0,
    hybridSeeds: [],
    diceSet: ['d4'],
    equippedDie: 'd4',
    studioLevels: {},
    soundOn: true,
  };
}

export function hasBlessing(state: GameState, id: string): boolean {
  return state.prestigeUpgradesBought.includes(id);
}

export function addResource(state: GameState, resource: ResourceType, amount: number): void {
  if (!Number.isFinite(amount) || amount === 0) return;
  state[resource] += amount;
  state[`${resource}Earned` as EarnedKey] += amount;
}

export function getCampaignBonus(state: GameState): number {
  const champion = hasBlessing(state, 'championOfFate') ? 1 + state.campaigns * 0.01 : 1;
  return state.campaignMultiplier * champion;
}

export function getFameBonus(state: GameState): number {
  const perAchievement = hasBlessing(state, 'fameBoost') ? ACHIEVEMENT_BONUS * 2 : ACHIEVEMENT_BONUS;
  return 1 + state.achievements.length * perAchievement;
}

export function getBoostProd(state: GameState): number {
  return state.activeBoosts.reduce((product, boost) => product * boost.prodMult, 1);
}

export function getBoostClick(state: GameState): number {
  return state.activeBoosts.reduce((product, boost) => product * boost.clickMult, 1);
}

export function getBoostDurationMult(state: GameState): number {
  return hasBlessing(state, 'goldenWeight') ? 1.5 : 1;
}

export function getStudioLevel(state: GameState, id: string): number {
  return state.studioLevels[id] ?? 0;
}

/** +5% global production per Rascunho Eterno level. */
export function getStudioProd(state: GameState): number {
  return 1 + 0.05 * getStudioLevel(state, 'rascunho');
}

/** +8% click power per Punho Criativo level. */
export function getStudioClick(state: GameState): number {
  return 1 + 0.08 * getStudioLevel(state, 'punho');
}

/** +10% inspiration production per Fluxo de Ideias level. */
export function getStudioInspiration(state: GameState): number {
  return 1 + 0.1 * getStudioLevel(state, 'fluxo');
}

/** +4% golden dice frequency per Sorte Escrita level. */
export function getStudioGolden(state: GameState): number {
  return 1 + 0.04 * getStudioLevel(state, 'sorte');
}

/** +5% trama growth speed per Roteiro Afiado level. */
export function getStudioGrowth(state: GameState): number {
  return 1 + 0.05 * getStudioLevel(state, 'roteiro');
}

export function studioCost(upgrade: StudioUpgradeData, level: number): number {
  return Math.ceil(upgrade.baseCost * Math.pow(upgrade.growth, level));
}

export function getProdMultiplier(state: GameState): number {
  return state.globalMultiplier
    * getCampaignBonus(state)
    * getFameBonus(state)
    * getBoostProd(state)
    * getStudioProd(state);
}

export function getClickMultiplier(state: GameState): number {
  return state.clickMultiplier
    * state.globalMultiplier
    * getCampaignBonus(state)
    * getFameBonus(state)
    * getBoostClick(state);
}

/** Adds a boost, or refreshes the timer when the same one is already running. */
export function applyBoost(state: GameState, boost: Boost): GameState {
  const running = state.activeBoosts.some((entry) => entry.id === boost.id);
  return {
    ...state,
    activeBoosts: running
      ? state.activeBoosts.map((entry) => (
        entry.id === boost.id ? { ...entry, timeLeft: Math.max(entry.timeLeft, boost.timeLeft) } : entry
      ))
      : [...state.activeBoosts, boost],
  };
}

/** Total output of one building type, per second, with every bonus applied. */
export function getBuildingOutput(state: GameState, building: BuildingData): Partial<Production> {
  const count = state.buildings[building.id] ?? 0;
  if (count <= 0) return {};
  const buildingMult = state.buildingMultipliers[building.id] ?? 1;
  const mult = getProdMultiplier(state) * count * buildingMult;
  const output: Partial<Production> = {};
  for (const [resource, amount] of Object.entries(building.yield)) {
    output[resource as ResourceType] = (amount ?? 0) * mult;
  }
  return output;
}

export function getProduction(state: GameState): Production {
  const total = createEmptyProduction();
  for (const building of buildingsData) {
    const output = getBuildingOutput(state, building);
    for (const [resource, amount] of Object.entries(output)) {
      total[resource as ResourceType] += amount ?? 0;
    }
  }
  total.inspiration *= getStudioInspiration(state);
  return total;
}

export function getFingerBonus(state: GameState): number {
  let bonus = 0;
  if (state.upgradesBought.includes('thousandFingers')) bonus += 0.01;
  if (state.upgradesBought.includes('silverFingers')) bonus += 0.05;
  if (state.upgradesBought.includes('godFingers')) bonus += 0.15;
  if (hasBlessing(state, 'fingerGod')) bonus += 0.05;
  return bonus;
}

export function getEquippedDie(state: GameState): DieData {
  return diceSetData.find((die) => die.id === state.equippedDie) ?? diceSetData[0];
}

/** Lowest d20 face that counts as a critical with the equipped die. */
export function getCritMin(state: GameState): number {
  const blessingThreshold = hasBlessing(state, 'critRange') ? 19 : 20;
  return Math.min(getEquippedDie(state).critMin, blessingThreshold);
}

export function getClickValue(state: GameState): number {
  const base = getClickMultiplier(state) * getEquippedDie(state).clickMult * getStudioClick(state);
  const fingerBonus = getFingerBonus(state) * getProduction(state).players;
  return base + fingerBonus;
}

/** Gold gained per click from the Dedos de Ouro blessing. */
export function getGoldClickValue(state: GameState): number {
  if (!hasBlessing(state, 'goldFingers')) return 0;
  return getProduction(state).gold * 0.02;
}

export function buildingCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(COST_GROWTH, owned));
}

export function bulkCost(baseCost: number, owned: number, amount: number): number {
  let total = 0;
  for (let i = 0; i < amount; i += 1) total += buildingCost(baseCost, owned + i);
  return total;
}

export function maxAffordable(baseCost: number, owned: number, bank: number): number {
  let count = 0;
  let total = 0;
  while (count < MAX_BULK_BUY) {
    const next = buildingCost(baseCost, owned + count);
    if (total + next > bank) break;
    total += next;
    count += 1;
  }
  return count;
}

/** Refund for selling `amount` units: half of what those units last cost. */
export function sellRefund(baseCost: number, owned: number, amount: number): number {
  const units = Math.min(amount, owned);
  if (units <= 0) return 0;
  return Math.floor(bulkCost(baseCost, owned - units, units) * SELL_REFUND);
}

/** Jogadores que uma campanha precisa somar por ponto de Destino. */
export const FATE_PLAYERS_PER_POINT = 100000;

/**
 * Destino por campanha cresce com raiz cúbica: cada década de jogadores vale só
 * ~2x de Destino, então bênçãos continuam sendo uma decisão a longo prazo.
 */
export function getFateGain(state: GameState): number {
  // O epsilon evita que um cubo exato (ex.: 1000) caia para 9.999… e perca um ponto.
  const base = Math.floor(Math.cbrt(state.playersEarned / FATE_PLAYERS_PER_POINT) + 1e-9);
  return hasBlessing(state, 'fateAmplifier') ? Math.floor(base * 1.25) : base;
}

/** Total de jogadores que a campanha atual precisa para o próximo ponto de Destino. */
export function getNextFatePlayers(state: GameState): number {
  const target = getFateGain(state) + 1;
  const base = hasBlessing(state, 'fateAmplifier') ? target / 1.25 : target;
  return Math.ceil(FATE_PLAYERS_PER_POINT * base ** 3);
}

export function unlockDice(state: GameState): GameState {
  const missing = diceSetData.filter((die) => !state.diceSet.includes(die.id) && die.req(state));
  if (missing.length === 0) return state;
  return { ...state, diceSet: [...state.diceSet, ...missing.map((die) => die.id)] };
}

export function applyAchievements(state: GameState): GameState {
  const base = unlockDice(state);
  const owned = new Set(base.achievements);
  const unlocked: string[] = [];
  for (const achievement of achievementsData) {
    if (!owned.has(achievement.id) && achievement.req(base)) {
      unlocked.push(achievement.id);
    }
  }
  if (unlocked.length === 0) return base;
  return { ...base, achievements: [...base.achievements, ...unlocked] };
}

/** Buys one permanent level of an Estúdio de Ideias manuscript. */
export function tryBuyStudio(state: GameState, id: string): GameState | null {
  const upgrade = studioData.find((entry) => entry.id === id);
  if (!upgrade) return null;
  const level = getStudioLevel(state, id);
  const cost = studioCost(upgrade, level);
  if (state.inspiration < cost) return null;

  return applyAchievements({
    ...state,
    inspiration: state.inspiration - cost,
    studioLevels: { ...state.studioLevels, [id]: level + 1 },
  });
}

/** Equips a die that has already been collected. */
export function tryEquipDie(state: GameState, id: string): GameState | null {
  if (state.equippedDie === id) return null;
  if (!state.diceSet.includes(id) || !diceSetData.some((die) => die.id === id)) return null;
  return { ...state, equippedDie: id };
}

export function prestigeReset(state: GameState): GameState {
  const gained = getFateGain(state);
  const campaigns = state.campaigns + 1;
  const perCampaign = hasBlessing(state, 'eternalEcho') ? 0.15 : 0.1;
  const keptBuildings: Record<string, number> = {};

  if (hasBlessing(state, 'keeperOfStories')) {
    for (const [id, count] of Object.entries(state.buildings)) {
      const kept = Math.floor(count * 0.05);
      if (kept > 0) keptBuildings[id] = kept;
    }
  }

  const next: GameState = {
    ...createInitialState(),
    campaigns,
    campaignMultiplier: 1 + campaigns * perCampaign,
    fate: state.fate + gained,
    // Lifetime total, so the Destino pill stays visible and achievements keep counting.
    fateEarned: state.fateEarned + gained,
    buildings: keptBuildings,
    prestigeUpgradesBought: [...state.prestigeUpgradesBought],
    achievements: [...state.achievements],
    diceSet: [...state.diceSet],
    equippedDie: state.equippedDie,
    studioLevels: { ...state.studioLevels },
    goldenDiceCollected: state.goldenDiceCollected,
    diceRolls: state.diceRolls,
    plotsHarvested: state.plotsHarvested,
    hybridSeeds: [...state.hybridSeeds],
    playTime: state.playTime,
    soundOn: state.soundOn,
    lastSeen: Date.now(),
  };
  for (const id of next.prestigeUpgradesBought) {
    prestigeUpgradesData.find((upgrade) => upgrade.id === id)?.apply(next);
  }
  return next;
}

/* ------------------------------------------------------------------ */
/* purchases                                                           */
/* ------------------------------------------------------------------ */

export function tryBuyBuilding(state: GameState, id: string, amount: BuyAmount): GameState | null {
  const building = buildingsData.find((entry) => entry.id === id);
  if (!building) return null;
  const owned = state.buildings[id] ?? 0;
  const count = amount === 'max'
    ? maxAffordable(building.baseCost, owned, state[building.costRes])
    : amount;
  if (count <= 0) return null;

  const cost = bulkCost(building.baseCost, owned, count);
  if (state[building.costRes] < cost) return null;

  const next: GameState = {
    ...state,
    buildings: { ...state.buildings, [id]: owned + count },
  };
  next[building.costRes] = state[building.costRes] - cost;
  return applyAchievements(next);
}

export function trySellBuilding(state: GameState, id: string, amount: BuyAmount): GameState | null {
  const building = buildingsData.find((entry) => entry.id === id);
  if (!building) return null;
  const owned = state.buildings[id] ?? 0;
  const units = amount === 'max' ? owned : Math.min(amount, owned);
  if (units <= 0) return null;

  const next: GameState = {
    ...state,
    buildings: { ...state.buildings, [id]: owned - units },
  };
  next[building.costRes] = state[building.costRes] + sellRefund(building.baseCost, owned, units);
  return next;
}

export function tryBuyUpgrade(state: GameState, id: string): GameState | null {
  const upgrade = upgradesData.find((entry) => entry.id === id);
  if (!upgrade || !upgrade.req(state)) return null;
  if (state.upgradesBought.includes(id) || state[upgrade.costRes] < upgrade.cost) return null;

  const next: GameState = {
    ...state,
    upgradesBought: [...state.upgradesBought, id],
    buildingMultipliers: { ...state.buildingMultipliers },
  };
  next[upgrade.costRes] = state[upgrade.costRes] - upgrade.cost;
  upgrade.apply(next);
  return applyAchievements(next);
}

export function tryBuyPrestige(state: GameState, id: string, cost: number): GameState | null {
  const blessing = prestigeUpgradesData.find((entry) => entry.id === id);
  if (!blessing) return null;
  if (state.fate < cost || state.prestigeUpgradesBought.includes(id)) return null;
  if (!blessing.req(state)) return null;

  const next: GameState = {
    ...state,
    fate: state.fate - cost,
    buildingMultipliers: { ...state.buildingMultipliers },
    garden: [...state.garden],
    prestigeUpgradesBought: [...state.prestigeUpgradesBought, id],
  };
  blessing.apply(next);
  return applyAchievements(next);
}

export function affordableUpgrades(state: GameState): string[] {
  return upgradesData
    .filter((upgrade) => !state.upgradesBought.includes(upgrade.id)
      && upgrade.req(state)
      && state[upgrade.costRes] >= upgrade.cost)
    .sort((a, b) => a.cost - b.cost)
    .map((upgrade) => upgrade.id);
}

/* ------------------------------------------------------------------ */
/* dice minigame                                                       */
/* ------------------------------------------------------------------ */

/** The stake grows with lifetime dice, so rolling never becomes free money. */
export function getRollCost(state: GameState): number {
  const tier = Math.max(1, Math.floor(Math.log10(Math.max(1, state.diceEarned)) / 2));
  const base = DICE_ROLL_COST * tier;
  return hasBlessing(state, 'loadedDice') ? Math.round(base * 0.8) : base;
}

export function getAdvantageCost(state: GameState): number {
  if (hasBlessing(state, 'advantage')) return getRollCost(state);
  return Math.round(getRollCost(state) * ADVANTAGE_COST_MULT);
}

/** Promotes any roll inside the equipped die's crit range to a natural 20. */
export function resolveRoll(state: GameState, result: number): number {
  return result >= getCritMin(state) ? 20 : result;
}

export function rollGoldReward(result: number, production: Production, state?: GameState): number {
  const base = Math.max(result * 10, production.gold * 45);
  return state && hasBlessing(state, 'diceBounty') ? base * 3 : base;
}

export function diceRollMessage(result: number, goldReward: number): string {
  if (result === 1) return 'FALHA CRÍTICA! O Mestre ri e você não ganha nada.';
  if (result === 20) return 'CRÍTICO! +1 Destino, inspiração e produção x5 por 30s!';
  if (result >= 16) return 'Excelente! Bênção dos Dados: produção x3 por 20s!';
  if (result >= 11) return 'Bom! Uma ideia repentina: inspiração proporcional à sua produção.';
  return `Você ganhou ${formatNumber(goldReward)} de ouro.`;
}

/** Applies a D20 outcome. The dice were already paid for when the roll started. */
export function applyDiceRoll(state: GameState, result: number, goldReward: number): GameState {
  const next: GameState = { ...state, diceRolls: state.diceRolls + 1 };
  const duration = getBoostDurationMult(state);
  if (result === 20) {
    addResource(next, 'fate', 1);
    addResource(next, 'inspiration', 5);
    return applyBoost(next, {
      id: 'crit',
      name: 'Crítico Perfeito',
      desc: 'Produção x5',
      prodMult: 5,
      clickMult: 1,
      timeLeft: Math.round(30 * duration),
    });
  }
  if (result >= 16) {
    return applyBoost(next, {
      id: 'roll',
      name: 'Bênção dos Dados',
      desc: 'Produção x3',
      prodMult: 3,
      clickMult: 1,
      timeLeft: Math.round(20 * duration),
    });
  }
  if (result >= 11) addResource(next, 'inspiration', Math.max(3, getProduction(state).inspiration * 20));
  else if (result >= 2) addResource(next, 'gold', goldReward);
  return applyAchievements(next);
}

/* ------------------------------------------------------------------ */
/* golden dice                                                         */
/* ------------------------------------------------------------------ */

export function getGoldenDuration(state: GameState): number {
  return hasBlessing(state, 'goldenMagnet') ? 21000 : 14000;
}

/** Spawn delay multiplier: lower is faster. */
export function getGoldenDelayMult(state: GameState): number {
  let mult = 1;
  if (state.upgradesBought.includes('radiantDice')) mult *= 0.5;
  if (hasBlessing(state, 'luckOfTavern')) mult *= 0.5;
  return mult / getEquippedDie(state).goldenMult / getStudioGolden(state);
}

export function getStormCount(state: GameState, base: number): number {
  return base + (hasBlessing(state, 'stormLord') ? 4 : 0);
}

function maybeFateFromGolden(state: GameState, next: GameState): void {
  if (hasBlessing(state, 'fateOfDice') && Math.random() < 0.1) addResource(next, 'fate', 1);
}

export function pickGoldenEffect(random: () => number = Math.random): GoldenEffect {
  const total = goldenEffects.reduce((sum, effect) => sum + effect.weight, 0);
  let roll = random() * total;
  for (const effect of goldenEffects) {
    roll -= effect.weight;
    if (roll <= 0) return effect;
  }
  return goldenEffects[0];
}

/** The most valuable building the player owns, used by the building special. */
export function pickBuildingSpecial(state: GameState, random: () => number = Math.random): string | null {
  const owned = buildingsData
    .filter((building) => (state.buildings[building.id] ?? 0) > 0)
    .sort((a, b) => b.baseCost - a.baseCost);
  if (owned.length === 0) return null;
  return owned[Math.floor(random() * owned.length)].id;
}

export function applyGoldenEffect(
  state: GameState,
  effect: GoldenEffect,
  targetBuildingId: string | null = null,
): GameState {
  const next: GameState = { ...state, goldenDiceCollected: state.goldenDiceCollected + 1 };
  maybeFateFromGolden(state, next);

  if (effect.duration > 0) {
    return applyAchievements(applyBoost(next, {
      id: effect.id,
      name: effect.name,
      desc: effect.desc,
      prodMult: effect.prodMult,
      clickMult: effect.clickMult,
      timeLeft: Math.round(effect.duration * getBoostDurationMult(state)),
    }));
  }

  if (effect.spawns) {
    // The storm pays out one die at a time; see collectStormDie.
    return applyAchievements(next);
  }

  if (effect.id === 'lucky') {
    const production = getProduction(state);
    addResource(next, 'players', state.players * 0.15 + Math.max(13, production.players * 90));
    addResource(next, 'gold', state.gold * 0.15 + Math.max(13, production.gold * 90));
    return applyAchievements(next);
  }

  if (effect.id === 'buildingSpecial' && targetBuildingId) {
    const building = buildingsData.find((entry) => entry.id === targetBuildingId);
    if (building) {
      const owned = state.buildings[building.id] ?? 0;
      const free = Math.min(15, Math.max(1, Math.ceil(owned * 0.1)));
      next.buildings = { ...state.buildings, [building.id]: owned + free };
      return applyAchievements(next);
    }
  }

  addResource(next, 'gold', Math.max(500, getProduction(state).gold * 600));
  addResource(next, 'dice', 25);
  addResource(next, 'inspiration', 5);
  addResource(next, 'fate', 1);
  return applyAchievements(next);
}

/** What one die of the golden storm pays out: half a minute of everything. */
export function stormDieReward(state: GameState): Production {
  const production = getProduction(state);
  return {
    players: Math.max(25, production.players * 30),
    gold: Math.max(25, production.gold * 30),
    dice: Math.max(5, production.dice * 30),
    inspiration: Math.max(3, production.inspiration * 30),
    fate: 0,
  };
}

/** One die of the golden storm. */
export function collectStormDie(state: GameState): GameState {
  const gains = stormDieReward(state);
  const next: GameState = { ...state, goldenDiceCollected: state.goldenDiceCollected + 1 };
  for (const resource of RESOURCE_IDS) addResource(next, resource, gains[resource]);
  maybeFateFromGolden(state, next);
  return applyAchievements(next);
}

/* ------------------------------------------------------------------ */
/* Grimório de Tramas (the garden)                                     */
/* ------------------------------------------------------------------ */

export function getGardenSlots(state: GameState): number {
  let slots = 4 + Math.min(4, Math.floor(state.campaigns / 2));
  if (hasBlessing(state, 'verdantMuse')) slots += 1;
  if (hasBlessing(state, 'manyPages')) slots += 2;
  return Math.min(GARDEN_MAX_SLOTS, slots);
}

export function seedById(id: string): SeedData | undefined {
  return gardenSeedsData.find((seed) => seed.id === id)
    ?? gardenHybridsData.find((seed) => seed.id === id);
}

/** All tramas, base and hybrid, in palette order. */
export const allSeedsData: SeedData[] = [...gardenSeedsData, ...gardenHybridsData];

/** Orthogonal neighbours in the 3-column page grid. */
function neighbourIndices(index: number): number[] {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const out: number[] = [];
  if (col > 0) out.push(index - 1);
  if (col < 2) out.push(index + 1);
  if (row > 0) out.push(index - 3);
  out.push(index + 3);
  return out;
}

/**
 * The hybrid this mature trama would produce: it needs a mature, different trama
 * on an orthogonally adjacent page. Curated pairs have their own seed; every
 * other combination falls back to Trama Cruzada.
 */
export function getCrossbreed(state: GameState, index: number, now = Date.now()): SeedData | null {
  const status = getPlotStatus(state, index, now);
  if (!status || !status.mature) return null;

  for (const other of neighbourIndices(index)) {
    const otherPlot = state.garden[other];
    if (!otherPlot || otherPlot.seedId === status.seed.id) continue;
    const otherStatus = getPlotStatus(state, other, now);
    if (!otherStatus || !otherStatus.mature) continue;

    const key = [status.seed.id, otherPlot.seedId].sort().join('+');
    const hybridId = hybridRecipes[key] ?? 'hybridCruzada';
    const hybrid = gardenHybridsData.find((seed) => seed.id === hybridId);
    if (hybrid) return hybrid;
  }
  return null;
}

/** True when an adjacent page holds the same trama: both grow and harvest better. */
export function getPlotSynergy(state: GameState, index: number): boolean {
  const plot = state.garden[index];
  if (!plot) return false;
  return neighbourIndices(index).some((other) => state.garden[other]?.seedId === plot.seedId);
}

export function getPlotStatus(state: GameState, index: number, now = Date.now()): PlotStatus | null {
  const plot = state.garden[index];
  if (!plot) return null;
  const seed = seedById(plot.seedId);
  if (!seed) return null;

  const synergy = getPlotSynergy(state, index);
  const speed = (hasBlessing(state, 'fastInk') ? 1.5 : 1)
    * (synergy ? 1.4 : 1)
    * getStudioGrowth(state);
  const total = seed.growSeconds * 1000;
  const grown = Math.max(0, now - plot.plantedAt) * speed;

  return {
    index,
    plot,
    seed,
    progress: Math.min(1, grown / total),
    mature: grown >= total,
    secondsLeft: Math.max(0, (total - grown) / speed / 1000),
    synergy,
  };
}

export function getSeedCost(state: GameState, seed: SeedData): number {
  return hasBlessing(state, 'freePages') ? Math.ceil(seed.cost / 2) : seed.cost;
}

export function tryPlantSeed(state: GameState, index: number, seedId: string): GameState | null {
  const seed = seedById(seedId);
  if (!seed || !seed.req(state)) return null;
  if (index < 0 || index >= getGardenSlots(state)) return null;
  if (state.garden[index]) return null;

  const cost = getSeedCost(state, seed);
  if (state.inspiration < cost) return null;

  const garden = [...state.garden];
  garden[index] = { seedId, plantedAt: Date.now() };
  return { ...state, inspiration: state.inspiration - cost, garden };
}

export function trySpeedPlot(state: GameState, index: number): GameState | null {
  const status = getPlotStatus(state, index);
  if (!status || status.mature) return null;
  if (state.dice < GARDEN_SPEEDUP_COST) return null;

  const garden = [...state.garden];
  garden[index] = { ...status.plot, plantedAt: status.plot.plantedAt - GARDEN_SPEEDUP_SECONDS * 1000 };
  return { ...state, dice: state.dice - GARDEN_SPEEDUP_COST, garden };
}

export function tryHarvestPlot(
  state: GameState,
  index: number,
  now = Date.now(),
): { state: GameState; message: string; hybrid?: SeedData } | null {
  const status = getPlotStatus(state, index, now);
  if (!status || !status.mature) return null;

  const { seed, synergy } = status;
  const harvestMult = (hasBlessing(state, 'richHarvest') ? 2 : 1) * (synergy ? 1.5 : 1);
  const next: GameState = {
    ...state,
    garden: [...state.garden],
    plotsHarvested: state.plotsHarvested + 1,
  };
  next.garden[index] = null;
  let message = '';
  let harvested = next;

  if (seed.reward.kind === 'resource') {
    const { resource, seconds, min } = seed.reward;
    const amount = Math.max(min, getProduction(state)[resource] * seconds) * harvestMult;
    addResource(next, resource, amount);
    const resourceName = RESOURCES.find((entry) => entry.id === resource)?.label ?? '';
    message = `${seed.name}: +${formatNumber(amount)} ${resourceName}${synergy ? ' (sinergia!)' : ''}`;
  } else if (seed.reward.kind === 'boost') {
    const duration = Math.round(seed.reward.duration * getBoostDurationMult(state)
      * (hasBlessing(state, 'richHarvest') ? 1.5 : 1) * (synergy ? 1.5 : 1));
    harvested = applyBoost(next, {
      id: `seed-${seed.id}`,
      name: seed.reward.name,
      desc: seed.desc,
      prodMult: seed.reward.prodMult,
      clickMult: seed.reward.clickMult,
      timeLeft: duration,
    });
    message = `${seed.name}: bônus ativo por ${duration}s${synergy ? ' (sinergia!)' : ''}`;
  } else {
    const amount = Math.max(1, Math.round(seed.reward.amount * harvestMult));
    addResource(next, 'fate', amount);
    message = `${seed.name}: +${formatNumber(amount)} Destino${synergy ? ' (sinergia!)' : ''}`;
  }

  // Crossbreeding: a mature, different neighbour unlocks a hybrid seed.
  const hybrid = getCrossbreed(state, index, now);
  if (hybrid && !state.hybridSeeds.includes(hybrid.id)) {
    harvested = { ...harvested, hybridSeeds: [...state.hybridSeeds, hybrid.id] };
    message += ` · Novo híbrido: ${hybrid.name}!`;
    return { state: applyAchievements(harvested), message, hybrid };
  }

  return { state: applyAchievements(harvested), message };
}

/* ------------------------------------------------------------------ */
/* persistence                                                         */
/* ------------------------------------------------------------------ */

export function serializeSave(state: GameState): string {
  return JSON.stringify({ ...state, activeBoosts: [], lastSeen: Date.now() });
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, serializeSave(state));
  } catch {
    /* storage may be full or blocked; the game keeps running in memory */
  }
}

function finite(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function positive(value: unknown, fallback: number): number {
  const amount = finite(value, fallback);
  return amount > 0 ? amount : fallback;
}

function countRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const counts: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const amount = Math.floor(finite(raw));
    if (amount > 0) counts[key] = amount;
  }
  return counts;
}

function multiplierRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const multipliers: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const amount = positive(raw, 1);
    if (amount !== 1) multipliers[key] = amount;
  }
  return multipliers;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === 'string');
}

function gardenRecord(value: unknown): (GardenPlot | null)[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, GARDEN_MAX_SLOTS).map((entry) => {
    if (!entry || typeof entry !== 'object') return null;
    const record = entry as { seedId?: unknown; plantedAt?: unknown };
    if (typeof record.seedId !== 'string' || !seedById(record.seedId)) return null;
    return { seedId: record.seedId, plantedAt: finite(record.plantedAt, Date.now()) };
  });
}

/**
 * Turns any parsed save (current, legacy or hand-edited) into a complete,
 * crash-free state. Returns null when the payload is not a save at all.
 */
export function normalizeSave(raw: unknown): GameState | null {
  if (!raw || typeof raw !== 'object') return null;
  const parsed = raw as Partial<GameState> & Record<string, unknown>;
  if (typeof parsed.players !== 'number' || !Number.isFinite(parsed.players)) return null;

  const campaigns = Math.max(0, Math.floor(finite(parsed.campaigns)));
  const diceSet = stringArray(parsed.diceSet).filter((id) => diceSetData.some((die) => die.id === id));
  if (!diceSet.includes('d4')) diceSet.unshift('d4');
  const equippedDie = typeof parsed.equippedDie === 'string' && diceSet.includes(parsed.equippedDie)
    ? parsed.equippedDie
    : 'd4';
  const state: GameState = {
    ...createInitialState(),
    players: finite(parsed.players), playersEarned: finite(parsed.playersEarned),
    gold: finite(parsed.gold), goldEarned: finite(parsed.goldEarned),
    dice: finite(parsed.dice), diceEarned: finite(parsed.diceEarned),
    inspiration: finite(parsed.inspiration), inspirationEarned: finite(parsed.inspirationEarned),
    fate: finite(parsed.fate), fateEarned: finite(parsed.fateEarned),
    clicks: finite(parsed.clicks),
    clickMultiplier: positive(parsed.clickMultiplier, 1),
    globalMultiplier: positive(parsed.globalMultiplier, 1),
    buildings: countRecord(parsed.buildings),
    buildingMultipliers: multiplierRecord(parsed.buildingMultipliers),
    upgradesBought: stringArray(parsed.upgradesBought),
    campaigns,
    campaignMultiplier: positive(parsed.campaignMultiplier, 1 + campaigns * 0.1),
    prestigeUpgradesBought: stringArray(parsed.prestigeUpgradesBought),
    achievements: stringArray(parsed.achievements),
    goldenDiceCollected: finite(parsed.goldenDiceCollected),
    diceRolls: finite(parsed.diceRolls),
    playTime: finite(parsed.playTime),
    lastSeen: finite(parsed.lastSeen, Date.now()),
    activeBoosts: [],
    garden: gardenRecord(parsed.garden),
    plotsHarvested: finite(parsed.plotsHarvested),
    hybridSeeds: stringArray(parsed.hybridSeeds)
      .filter((id) => gardenHybridsData.some((seed) => seed.id === id)),
    diceSet,
    equippedDie,
    studioLevels: countRecord(parsed.studioLevels),
    soundOn: parsed.soundOn !== false,
  };

  // Redeem the old 'portal' building id so legacy saves keep their progress.
  const legacyPortal = state.buildings.portal;
  if (legacyPortal && !state.buildings.planarPortal) state.buildings.planarPortal = legacyPortal;
  delete state.buildings.portal;

  return state;
}

function computeOffline(state: GameState, lastSeen: number): OfflineReport | null {
  const elapsed = Math.max(0, (Date.now() - lastSeen) / 1000);
  if (elapsed < 60) return null;

  const hasMaster = hasBlessing(state, 'offlineMaster');
  const cap = hasBlessing(state, 'deepDreams') ? 72 : hasMaster ? 24 : 8;
  const efficiency = hasBlessing(state, 'dreamTavern') ? 1.5 : hasMaster ? 1 : 0.5;
  const seconds = Math.min(elapsed, cap * 3600);
  const production = getProduction(state);
  const gains = createEmptyProduction();
  let anything = false;

  for (const resource of RESOURCE_IDS) {
    const amount = production[resource] * seconds * efficiency;
    if (amount > 0.5) {
      gains[resource] = amount;
      anything = true;
    }
  }

  return anything ? { seconds, gains } : null;
}

export function loadGame(): { state: GameState; offline: OfflineReport | null } {
  const base = createInitialState();
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SAVE_KEY) ?? localStorage.getItem(LEGACY_SAVE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) return { state: base, offline: null };

  try {
    const parsed = JSON.parse(raw) as { lastSeen?: unknown };
    const state = normalizeSave(parsed);
    if (!state) return { state: base, offline: null };

    const offline = computeOffline(state, finite(parsed.lastSeen, Date.now()));
    if (offline) {
      for (const resource of RESOURCE_IDS) addResource(state, resource, offline.gains[resource]);
    }
    return { state: applyAchievements(state), offline };
  } catch {
    return { state: base, offline: null };
  }
}
