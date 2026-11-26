export type ResourceType = 'players' | 'gold' | 'dice' | 'inspiration' | 'fate';

export interface GameState {
  players: number;
  playersEarned: number;
  gold: number;
  goldEarned: number;
  dice: number;
  diceEarned: number;
  inspiration: number;
  inspirationEarned: number;
  fate: number;
  fateEarned: number;
  
  clicks: number;
  clickMultiplier: number;
  globalMultiplier: number;
  
  buildings: Record<string, number>;
  buildingMultipliers: Record<string, number>;
  upgradesBought: string[];
  
  // Prestígio
  campaigns: number;
  campaignMultiplier: number;
  prestigeUpgradesBought: string[];
  
  // Buffs Temporários
  activeBoost: { id: string; name: string; multiplier: number; timeLeft: number } | null;
}

export interface BuildingData {
  id: string;
  name: string;
  baseCost: number;
  costRes: ResourceType;
  desc: string;
  yield: Partial<Record<ResourceType, number>>;
  req: (state: GameState) => boolean;
}

export interface UpgradeData {
  id: string;
  name: string;
  cost: number;
  costRes: ResourceType;
  desc: string;
  req: (state: GameState) => boolean;
  apply: (state: GameState) => void;
}

export interface PrestigeUpgradeData {
  id: string;
  name: string;
  cost: number; // Custa Destino
  desc: string;
  req: (state: GameState) => boolean;
  apply: (state: GameState) => void; // Aplicado permanentemente
}

export interface AchievementData {
  id: string;
  name: string;
  desc: string;
  req: (state: GameState) => boolean;
}