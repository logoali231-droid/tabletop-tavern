export type ResourceType = 'players' | 'gold' | 'dice' | 'inspiration' | 'fate';

export type BuyAmount = 1 | 10 | 100 | 'max';

export type ModalId = 'prestige' | 'publish' | 'editora' | 'artifice' | 'minigame' | 'achievements' | 'stats' | 'settings' | 'garden' | 'studio' | 'help' | 'familiar' | 'festival' | 'pantheon';

export type Production = Record<ResourceType, number>;

export interface Boost {
  id: string;
  name: string;
  desc: string;
  prodMult: number;
  clickMult: number;
  timeLeft: number;
}

/** One page of the Grimório holding a story thread. */
export interface GardenPlot {
  seedId: string;
  plantedAt: number;
}

export type SeedRarity = 'comum' | 'incomum' | 'raro' | 'lendário' | 'híbrido';

export type SeedReward =
  | { kind: 'resource'; resource: ResourceType; seconds: number; min: number }
  | { kind: 'boost'; name: string; prodMult: number; clickMult: number; duration: number }
  | { kind: 'fate'; amount: number };

export interface SeedData {
  id: string;
  name: string;
  rarity: SeedRarity;
  desc: string;
  icon: string;
  cost: number;
  growSeconds: number;
  /** Cursed tramas cut Idea production while they grow (fraction, 0–1). */
  drawback?: { inspiration: number };
  reward: SeedReward;
  req: (state: GameState) => boolean;
  reqHint: string;
}

/** A familiar that grows with XP and lends one aura at a time. */
export interface FamiliarState {
  xp: number;
  /** Active aura id, or null until the player picks one. */
  aura: string | null;
}

export interface FamiliarAuraData {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** Familiar level that unlocks this aura. */
  unlockLevel: number;
  /** Resource boosted while the aura is active. */
  resource: ResourceType;
  /** Fractional bonus at the unlock level. */
  base: number;
  /** Extra fraction per familiar level above the unlock level. */
  perLevel: number;
}

/** A god seated in the Pantheon: one strong buff and one real drawback. */
export interface GodData {
  id: string;
  name: string;
  title: string;
  icon: string;
  desc: string;
  buff: string;
  debuff: string;
  /** Multipliers over production; values below 1 are drawbacks. */
  production: Partial<Record<ResourceType, number>>;
  /** Multiplier over click power when the god is seated. */
  clickMult?: number;
  req: (state: GameState) => boolean;
  reqHint: string;
}

/** The festival of one real-world month. */
export interface FestivalData {
  /** 0 = January. */
  month: number;
  name: string;
  icon: string;
  flavor: string;
  desc: string;
  production: Partial<Record<ResourceType, number>>;
  clickMult?: number;
  /** Multiplier over golden-dice frequency. */
  goldenMult?: number;
}

export interface FestivalTierData {
  id: string;
  name: string;
  icon: string;
  points: number;
  desc: string;
}

export interface FestivalState {
  /** YYYY-MM of the month these points belong to. */
  month: string;
  points: number;
  /** Ids of the tiers already claimed this month. */
  claimed: string[];
}

export interface DieData {
  id: string;
  label: string;
  name: string;
  faces: number;
  /** Multiplier applied to the click value. */
  clickMult: number;
  /** Lowest natural d20 result that counts as a critical. */
  critMin: number;
  /** Multiplier for how often golden dice show up. */
  goldenMult: number;
  desc: string;
  flavor: string;
  icon: string;
  req: (state: GameState) => boolean;
  reqHint: string;
}

export interface GameState {
  players: number; playersEarned: number;
  gold: number; goldEarned: number;
  dice: number; diceEarned: number;
  inspiration: number; inspirationEarned: number;
  fate: number; fateEarned: number;
  clicks: number; clickMultiplier: number; globalMultiplier: number;
  buildings: Record<string, number>;
  buildingMultipliers: Record<string, number>;
  upgradesBought: string[];
  campaigns: number; campaignMultiplier: number; prestigeUpgradesBought: string[];
  /** Mesas ao Vivo (chefes) vencidas; permanente como as conquistas. */
  bossesDefeated: number;
  /** Second prestige layer: permanent Lendas, each one a permanent bonus. */
  legends: number;
  /** Spendable Editora points: each published saga grants a few. */
  publications: number;
  /** Sagas published, lifetime; achievements count this, so spending never regresses them. */
  publicationsEarned: number;
  /** Bought Editora tree nodes, permanent. */
  editorialUpgrades: string[];
  /** Saldo de Dados de Artífice, a moeda rara que paga maestria de construção. */
  artificerDice: number;
  /** Marcos de 12h já pagos pelo relógio de jogo, para não pagar duas vezes. */
  artificerEarned: number;
  /** Níveis de maestria por construção: cada nível dobra a produção dela, para sempre. */
  masteryLevels: Record<string, number>;
  /** Goblin sugando a produção agora; null quando a taverna está limpa. */
  pest: Pest | null;
  /** Goblins expulsos na vida, permanente como as conquistas. */
  pestsExpelled: number;
  achievements: string[];
  goldenDiceCollected: number;
  diceRolls: number;
  playTime: number;
  lastSeen: number;
  activeBoosts: Boost[];
  garden: (GardenPlot | null)[];
  plotsHarvested: number;
  /** Hybrid tramas discovered by crossbreeding; permanent like achievements. */
  hybridSeeds: string[];
  diceSet: string[];
  equippedDie: string | null;
  /** Permanent Estúdio de Ideias levels, bought with inspiration. */
  studioLevels: Record<string, number>;
  /** Companion that earns XP and lends an aura; permanent. */
  familiar: FamiliarState;
  /** This month's festival progress; resets when the real month changes. */
  festival: FestivalState;
  /** Two god slots; each god multiplies some resources and cuts others. */
  pantheon: (string | null)[];
  soundOn: boolean;
}

export interface BuildingData {
  id: string;
  name: string;
  baseCost: number;
  costRes: ResourceType;
  desc: string;
  flavor: string;
  icon: string;
  yield: Partial<Record<ResourceType, number>>;
  req: (state: GameState) => boolean;
  reqHint: string;
}

export interface UpgradeData {
  id: string;
  name: string;
  cost: number;
  costRes: ResourceType;
  desc: string;
  icon: string;
  req: (state: GameState) => boolean;
  apply: (state: GameState) => void;
}

export interface PrestigeUpgradeData {
  id: string;
  name: string;
  cost: number;
  desc: string;
  icon: string;
  /** Section of the tree this blessing belongs to. */
  group: string;
  /** Shown while locked, to explain the requirement. */
  reqHint?: string;
  req: (state: GameState) => boolean;
  apply: (state: GameState) => void;
}

export interface StudioUpgradeData {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** Bonus granted by each level, shown as text. */
  perLevel: string;
  baseCost: number;
  /** Cost multiplier per level already owned. */
  growth: number;
}

export type AchievementCategory =
  | 'Geral'
  | 'Construções'
  | 'Prestígio'
  | 'Grimório'
  | 'Dados'
  | 'Estúdio'
  | 'Editora'
  | 'Artífice'
  | 'Sinergias';

export interface AchievementData {
  id: string;
  name: string;
  desc: string;
  icon: string;
  /** Group used by the achievement browser; untagged entries fall under Geral. */
  category?: AchievementCategory;
  req: (state: GameState) => boolean;
}

export interface GoldenEffect {
  id: string;
  name: string;
  desc: string;
  weight: number;
  prodMult: number;
  clickMult: number;
  duration: number;
  /** When set, the effect rains this many extra dice on the screen. */
  spawns?: number;
}

export interface SynergyData {
  id: string;
  name: string;
  /** Achievement unlocked when the whole set is owned. */
  achievement: string;
  icon: string;
  desc: string;
  /** Building ids that must each have at least one unit. */
  buildings: string[];
  /** Fractional global production bonus while active. */
  bonus: number;
}

export type BossAffix = 'armored' | 'regenerating' | 'swift';

export interface BossTemplate {
  id: string;
  name: string;
  icon: string;
  flavor: string;
  /** Extra rule that makes this table harder. */
  affix: BossAffix;
}

/** A running Mesa ao Vivo encounter. */
export interface BossEncounter extends BossTemplate {
  key: string;
  hp: number;
  maxHp: number;
  timeLeft: number;
  combo: number;
  /** 1, 2 or 3; the table gets a new trick at each phase. */
  phase: number;
  /** Absorbs damage and forces a Provocar before the table opens up. */
  shield: number;
  /** Stacks from Provocar; each one makes the next hits hurt more. */
  focus: number;
  /** One Ritual do Mestre is allowed per phase. */
  ritualReady: boolean;
  /** Short lines shown under the table. */
  log: string[];
}

/** A goblin pest stuck to the tavern, draining players until it is clicked away. */
export interface Pest {
  spawnedAt: number;
  clicks: number;
}

export type EditorialBranch = 'Economia' | 'Destino' | 'Início';

export interface EditorialUpgradeData {
  id: string;
  name: string;
  icon: string;
  desc: string;
  /** Cost in Editora points (state.publications). */
  cost: number;
  branch: EditorialBranch;
}
