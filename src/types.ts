export type ResourceType = 'players' | 'gold' | 'dice' | 'inspiration' | 'fate';

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
  activeBoost: { id: string; name: string; multiplier: number; timeLeft: number } | null;
  
  lastSaved: number;
  lastDailyReward: number;
  dailyStreak: number;
  
  // Novas propriedades
  questsCompleted: string[];
  minigamePlays: number;
}

export interface BuildingData {
  id: string; name: string; baseCost: number; costRes: ResourceType; desc: string; icon: string;
  yield: Partial<Record<ResourceType, number>>;
  req: (state: GameState) => boolean;
}

export interface UpgradeData {
  id: string; name: string; cost: number; costRes: ResourceType; desc: string; icon: string;
  req: (state: GameState) => boolean;
  apply: (state: GameState) => void;
}

export interface PrestigeUpgradeData {
  id: string; name: string; cost: number; desc: string; icon: string;
  req: (state: GameState) => boolean;
  apply: (state: GameState) => void;
}

export interface AchievementData {
  id: string; name: string; desc: string; req: (state: GameState) => boolean;
}

// Novo Tipo para Missões
export interface QuestData {
  id: string;
  name: string;
  desc: string;
  req: (state: GameState) => boolean; // Quando a missão estiver pronta para coletar
  rewardDesc: string;
  applyReward: (state: GameState) => void; // O que a missão dá
}