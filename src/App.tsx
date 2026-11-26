import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, ResourceType } from './types';
import { buildingsData, upgradesData, achievementsData, prestigeUpgradesData } from './data/gameData';
import ResourceBar, { formatNumber } from './components/ResourceBar';
import Shop from './components/Shop';
import ClickerArea from './components/ClickerArea';
import PrestigeTree from './components/PrestigeTree';
import DiceMinigame from './components/DiceMiniGame';
import GoldenDice from './components/GoldenDice';

const INITIAL_STATE: GameState = {
  players: 0, playersEarned: 0, gold: 0, goldEarned: 0, dice: 0, diceEarned: 0, inspiration: 0, inspirationEarned: 0, fate: 0, fateEarned: 0,
  clicks: 0, clickMultiplier: 1, globalMultiplier: 1,
  buildings: {}, buildingMultipliers: {}, upgradesBought: [],
  campaigns: 0, campaignMultiplier: 1, prestigeUpgradesBought: [],
  activeBoost: null
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('tabletopTavernSaveReact');
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...INITIAL_STATE, ...parsed, activeBoost: null }; // Reseta boost ao carregar
    }
    return INITIAL_STATE;
  });

  const [showPrestige, setShowPrestige] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const [goldenDiceActive, setGoldenDiceActive] = useState(false);

  // Referência para o timer do Dado Dourado
  const goldenDiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Salvar automaticamente
  useEffect(() => {
    localStorage.setItem('tabletopTavernSaveReact', JSON.stringify(state));
  }, [state]);

  // Loop do Jogo (Ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        let next = { ...prev };
        
        // Lida com Boosts temporários
        if (next.activeBoost) {
          if (next.activeBoost.timeLeft > 0) {
            next.activeBoost = { ...next.activeBoost, timeLeft: next.activeBoost.timeLeft - 0.1 };
          } else {
            next.activeBoost = null;
          }
        }

        const boostMult = next.activeBoost ? next.activeBoost.multiplier : 1;
        const finalMult = next.globalMultiplier * next.campaignMultiplier * boostMult;

        // Produção Passiva
        buildingsData.forEach(b => {
          const count = next.buildings[b.id] || 0;
          if (count > 0) {
            Object.entries(b.yield).forEach(([res, amount]) => {
              const bMult = next.buildingMultipliers[b.id] || 1;
              const produced = (amount as number) * count * bMult * finalMult * 0.1;
              addResourceToState(next, res as ResourceType, produced);
            });
          }
        });

        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Sistema de Spawn do Dado Dourado (Golden Cookie)
  useEffect(() => {
    const spawnTimer = setInterval(() => {
      // 10% de chance a cada 30 segundos (média de 1 a cada 5 min)
      if (Math.random() < 0.10 && !goldenDiceActive) {
        setGoldenDiceActive(true);
        
        // Se não clicar em 8 segundos, ele some
        goldenDiceTimer.current = setTimeout(() => {
          setGoldenDiceActive(false);
        }, 8000);
      }
    }, 30000);

    return () => {
      clearInterval(spawnTimer);
      if (goldenDiceTimer.current) clearTimeout(goldenDiceTimer.current);
    };
  }, [goldenDiceActive]);

  const addResourceToState = (state: GameState, res: ResourceType, amount: number) => {
    state[res] += amount;
    const earnedKey = `${res}Earned` as keyof GameState;
    if (typeof state[earnedKey] === 'number') {
      (state[earnedKey] as number) += amount;
    }
  };

  const handleMainClick = (e: React.MouseEvent) => {
    setState(prev => {
      let next = { ...prev };
      next.clicks += 1;
      const boostMult = next.activeBoost ? next.activeBoost.multiplier : 1;
      const gain = 1 * next.clickMultiplier * next.globalMultiplier * next.campaignMultiplier * boostMult;
      
      addResourceToState(next, 'players', gain);

      // RNG (Drops)
      // A Bênção "Deus dos Dados" dobra a chance
      const isDiceGod = next.prestigeUpgradesBought.includes('diceGod');
      if (Math.random() < (isDiceGod ? 0.20 : 0.10)) addResourceToState(next, 'dice', 1);
      if (Math.random() < (isDiceGod ? 0.04 : 0.02)) addResourceToState(next, 'inspiration', 1);
      if (Math.random() < 0.01) addResourceToState(next, 'gold', 5);

      // Efeito visual de clique
      const el = document.createElement('div');
      el.className = 'floating-text';
      el.innerText = `+${formatNumber(gain)} P`;
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);

      return next;
    });
  };

  const handleBuyBuilding = (id: string, costRes: keyof GameState, cost: number) => {
    setState(prev => {
      let next = { ...prev };
      if ((next[costRes] as number) >= cost) {
        (next[costRes] as number) -= cost;
        next.buildings[id] = (next.buildings[id] || 0) + 1;
      }
      return next;
    });
  };

  const handleBuyUpgrade = (id: string, costRes: keyof GameState, cost: number) => {
    setState(prev => {
      let next = { ...prev };
      const upgrade = upgradesData.find(u => u.id === id);
      if (upgrade && (next[costRes] as number) >= cost && !next.upgradesBought.includes(id)) {
        (next[costRes] as number) -= cost;
        next.upgradesBought.push(id);
        upgrade.apply(next);
      }
      return next;
    });
  };

  const handleBuyPrestige = (id: string, cost: number) => {
    setState(prev => {
      let next = { ...prev };
      const pu = prestigeUpgradesData.find(p => p.id === id);
      if (pu && next.fate >= cost && !next.prestigeUpgradesBought.includes(id)) {
        next.fate -= cost;
        next.prestigeUpgradesBought.push(id);
        // O efeito de compra só é aplicado no reset (exceto se for um multiplicador global que fica)
      }
      return next;
    });
  };

  const handlePrestige = () => {
    setState(prev => {
      const newCampaigns = prev.campaigns + 1;
      
      // Base do novo estado
      let next: GameState = {
        ...INITIAL_STATE,
        campaigns: newCampaigns,
        campaignMultiplier: 1 + (newCampaigns * 0.1), // +10% por campanha
        fate: prev.fate + Math.floor(prev.playersEarned / 10000), // Fórmula de Destino
        fateEarned: prev.fateEarned + Math.floor(prev.playersEarned / 10000),
        prestigeUpgradesBought: [...prev.prestigeUpgradesBought],
      };

      // Re-aplica todas as Bênçãos compradas
      next.prestigeUpgradesBought.forEach(id => {
        const pu = prestigeUpgradesData.find(p => p.id === id);
        if (pu) pu.apply(next);
      });

      return next;
    });
    setShowPrestige(false);
  };

  const handleGoldenDiceCollect = (type: 'buff' | 'lump') => {
    if (!goldenDiceActive) return;
    
    setGoldenDiceActive(false);
    if (goldenDiceTimer.current) clearTimeout(goldenDiceTimer.current);

    setState(prev => {
      let next = { ...prev };
      if (type === 'buff') {
        // 50/50 de dar um Buff massivo (x7 por 15s) ou um Loot (Ouro/Inspiração)
        if (Math.random() < 0.5) {
          next.activeBoost = { id: 'golden', name: 'Sorte do Mestre', multiplier: 7, timeLeft: 15 };
        } else {
          addResourceToState(next, 'players', next.players * 0.1 + 100); // 10% dos players atuais + 100
          addResourceToState(next, 'gold', 50);
          addResourceToState(next, 'inspiration', 1);
        }
      }
      return next;
    });
  };

  const handleDiceRollResult = (result: number) => {
    setState(prev => {
      let next = { ...prev };
      if (result === -10) {
        next.dice -= 10; // Custo da rolagem
      } else if (result === 1) {
        // Nada (Falha Crítica)
      } else if (result >= 2 && result <= 10) {
        addResourceToState(next, 'gold', result * 10);
      } else if (result >= 11 && result <= 15) {
        addResourceToState(next, 'inspiration', 2);
      } else if (result >= 16 && result <= 19) {
        next.activeBoost = { id: 'roll', name: 'Bênção dos Dados', multiplier: 3, timeLeft: 20 };
      } else if (result === 20) {
        addResourceToState(next, 'fate', 1); // Sucesso Crítico! Ganha Destino
        addResourceToState(next, 'inspiration', 5);
      }
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      
      <ResourceBar state={state} onOpenPrestige={() => setShowPrestige(true)} onOpenMinigame={() => setShowMinigame(true)} />

      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 150px)' }}>
        <ClickerArea state={state} onClick={handleMainClick} onBoostClick={() => {}} />
        <Shop state={state} buildings={buildingsData} upgrades={upgradesData} onBuyBuilding={handleBuyBuilding} onBuyUpgrade={handleBuyUpgrade} />
      </div>

      {/* Modais e Overlays */}
      {showPrestige && <PrestigeTree state={state} onBuyPrestige={handleBuyPrestige} onPrestige={handlePrestige} onClose={() => setShowPrestige(false)} />}
      {showMinigame && <DiceMinigame state={state} onRoll={handleDiceRollResult} onClose={() => setShowMinigame(false)} />}
      {goldenDiceActive && <GoldenDice onCollect={handleGoldenDiceCollect} />}

    </div>
  );
}