import { BuildingData, UpgradeData, AchievementData, PrestigeUpgradeData } from '../types';

export const buildingsData: BuildingData[] = [
  {
    id: 'gameTable', name: 'Mesa de Jogo', baseCost: 10, costRes: 'players', desc: '+0.2 Jogadores/s', yield: { players: 0.2 }, req: () => true,
    icon: ''
  },
  {
    id: 'dmScreen', name: 'Escudo do Mestre', baseCost: 50, costRes: 'players', desc: '+1 Jogador/s', yield: { players: 1 }, req: (s) => s.playersEarned >= 25,
    icon: ''
  },
  {
    id: 'snackBar', name: 'Lanchonete', baseCost: 150, costRes: 'players', desc: '+0.5 Ouro/s', yield: { gold: 0.5 }, req: (s) => s.gold > 0,
    icon: ''
  },
  {
    id: 'paintingStudio', name: 'Estúdio de Pintura', baseCost: 250, costRes: 'players', desc: '+2 Dados/s', yield: { dice: 2 }, req: (s) => s.diceEarned >= 5,
    icon: ''
  },
  {
    id: 'tavern', name: 'Taverna', baseCost: 500, costRes: 'players', desc: '+10 Jogadores/s', yield: { players: 10 }, req: (s) => s.playersEarned >= 200,
    icon: ''
  },
  {
    id: 'conventionHall', name: 'Centro de Convenções', baseCost: 5000, costRes: 'players', desc: '+100 Jogadores/s, +2 Ouro/s', yield: { players: 100, gold: 2 }, req: (s) => s.playersEarned >= 2000,
    icon: ''
  },
  {
    id: 'guild', name: 'Guilda de Aventureiros', baseCost: 25000, costRes: 'players', desc: '+500 Jogadores/s, +5 Ouro/s', yield: { players: 500, gold: 5 }, req: (s) => s.playersEarned >= 10000,
    icon: ''
  },
  {
    id: 'magicTower', name: 'Torre de Mago', baseCost: 100000, costRes: 'players', desc: '+10 Inspiração/s', yield: { inspiration: 10 }, req: (s) => s.buildings.guild >= 5,
    icon: ''
  },
  {
    id: 'portal', name: 'Portal Planar', baseCost: 500000, costRes: 'gold', desc: '+2 Destino/s', yield: { fate: 2 }, req: (s) => s.buildings.magicTower >= 10,
    icon: ''
  }
];

export const upgradesData: UpgradeData[] = [
  {
    id: 'phb', name: 'Livro do Jogador', cost: 100, costRes: 'players', desc: 'Dobra o ganho do botão principal', req: (s) => s.playersEarned >= 50, apply: (s) => { s.clickMultiplier *= 2; },
    icon: ''
  },
  {
    id: 'dmg', name: 'Guia do Mestre', cost: 300, costRes: 'players', desc: 'Dobra ganho das Mesas de Jogo', req: (s) => s.buildings.gameTable >= 10, apply: (s) => { s.buildingMultipliers.gameTable = (s.buildingMultipliers.gameTable || 1) * 2; },
    icon: ''
  },
  {
    id: 'metalDice', name: 'Dados de Metal', cost: 2, costRes: 'inspiration', desc: 'Multiplica ganho global por 1.5x', req: (s) => s.inspirationEarned >= 1, apply: (s) => { s.globalMultiplier *= 1.5; },
    icon: ''
  },
  {
    id: 'coffee', name: 'Máquina de Café', cost: 10, costRes: 'inspiration', desc: 'Triplica ganho das Lanchonetes', req: (s) => s.inspirationEarned >= 5, apply: (s) => { s.buildingMultipliers.snackBar = (s.buildingMultipliers.snackBar || 1) * 3; },
    icon: ''
  },
  {
    id: 'grid', name: 'Grid Tático', cost: 5000, costRes: 'gold', desc: 'Dobra ganho das Tavernas', req: (s) => s.buildings.tavern >= 5, apply: (s) => { s.buildingMultipliers.tavern = (s.buildingMultipliers.tavern || 1) * 2; },
    icon: ''
  },
  {
    id: 'guildCharter', name: 'Carta de Guilda', cost: 10000, costRes: 'gold', desc: 'Dobra ganho das Guildas', req: (s) => s.buildings.guild >= 5, apply: (s) => { s.buildingMultipliers.guild = (s.buildingMultipliers.guild || 1) * 2; },
    icon: ''
  }
];

export const prestigeUpgradesData: PrestigeUpgradeData[] = [
  {
    id: 'headstart', name: 'Vantagem Inicial', cost: 1, desc: 'Comece cada nova campanha com 1.000 Jogadores.', req: (s) => s.campaigns >= 1, apply: (s) => { s.players += 1000; s.playersEarned += 1000; },
    icon: ''
  },
  {
    id: 'fasterClicks', name: 'Mãos Rápidas', cost: 3, desc: 'Ganho base de clique multiplicado por 5 permanentemente.', req: (s) => s.campaigns >= 1, apply: (s) => { s.clickMultiplier *= 5; },
    icon: ''
  },
  {
    id: 'goldenTouch', name: 'Toque de Ouro', cost: 5, desc: 'Lanchonetes produzem 10x mais Ouro.', req: (s) => s.campaigns >= 2, apply: (s) => { s.buildingMultipliers.snackBar = (s.buildingMultipliers.snackBar || 1) * 10; },
    icon: ''
  },
  {
    id: 'diceGod', name: 'Deus dos Dados', cost: 15, desc: 'Chance de drops de Dados e Inspiração dobrada.', req: (s) => s.campaigns >= 3, apply: (_s) => { },
    icon: ''
  },
  {
    id: 'eternalFate', name: 'Destino Eterno', cost: 50, desc: 'Multiplica todos os ganhos globais por 10x.', req: (s) => s.campaigns >= 5, apply: (s) => { s.globalMultiplier *= 10; },
    icon: ''
  }
];

export const achievementsData: AchievementData[] = [
  { id: 'firstSession', name: 'Primeira Sessão', desc: 'Hospede sua primeira sessão.', req: (s) => s.clicks >= 1 },
  { id: 'sessionMaster', name: 'Mestre das Sessões', desc: 'Hospede 100 sessões.', req: (s) => s.clicks >= 100 },
  { id: 'richTavern', name: 'Taverna Rica', desc: 'Tenha 1000 de Ouro.', req: (s) => s.gold >= 1000 },
  { id: 'fateTwister', name: 'Manipulador do Destino', desc: 'Alcance 5 Campanhas.', req: (s) => s.campaigns >= 5 }
];

export const getBuildingCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.15, count));