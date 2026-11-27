export type ResourceType = 'players' | 'gold' | 'dice' | 'inspiration' | 'fate';

export type BuyAmount = 1 | 10 | 100 | 'max';

export type ModalId = 'prestige' | 'minigame' | 'achievements' | 'stats' | 'settings' | 'garden';

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
  reward: SeedReward;
  req: (state: GameState) => boolean;
  reqHint: string;
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

export interface AchievementData {
  id: string;
  name: string;
  desc: string;
  icon: string;
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
