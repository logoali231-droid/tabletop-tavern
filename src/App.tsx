import { useState, useEffect, useRef } from 'react';
import { GameState, ResourceType } from './types';
import { buildingsData, upgradesData, prestigeUpgradesData, questsData } from './data/gameData';
import ResourceBar, { formatNumber } from './components/ResourceBar';
import Shop from './components/Shop';
import ClickerArea from './components/ClickerArea';
import PrestigeTree from './components/PrestigeTree';
import DiceMinigame from './components/DiceMiniGame';
import GoldenDice from './components/GoldenDice';
import OfflinePopup from './components/OfflinePopup';
import DailyReward from './components/DailyReward';

const INITIAL_STATE: GameState = {
  players: 0, playersEarned: 0, gold: 0, goldEarned: 0, dice: 0, diceEarned: 0, inspiration: 0, inspirationEarned: 0, fate: 0, fateEarned: 0,
  clicks: 0, clickMultiplier: 1, globalMultiplier: 1,
  buildings: {}, buildingMultipliers: {}, upgradesBought: [],
  campaigns: 0, campaignMultiplier: 1, prestigeUpgradesBought: [],
  activeBoost: null,
  lastSaved: Date.now(), lastDailyReward: 0, dailyStreak: 0,
  questsCompleted: [], minigamePlays: 0 // Novos estados iniciais
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('tabletopTavernSaveReact');
    if (!saved) return INITIAL_STATE;

    const parsed: GameState = JSON.parse(saved);
    const now = Date.now();
    const timeDiff = Math.min((now - parsed.lastSaved) / 1000, 14400); 

    let offlineEarnings: Partial<Record<ResourceType, number>> = {};
    
    if (timeDiff > 60) { 
      const boostMult = parsed.activeBoost ? parsed.activeBoost.multiplier : 1; 
      const finalMult = parsed.globalMultiplier * parsed.campaignMultiplier * boostMult;

      buildingsData.forEach(b => {
        const count = parsed.buildings[b.id] || 0;
        if (count > 0) {
          Object.entries(b.yield).forEach(([res, amount]) => {
            const bMult = parsed.buildingMultipliers[b.id] || 1;
            const produced = (amount as number) * count * bMult * finalMult * timeDiff;
            
            if (produced > 0) {
              offlineEarnings[res as ResourceType] = (offlineEarnings[res as ResourceType] || 0) + produced;
              parsed[res as ResourceType] += produced;
              const earnedKey = `${res}Earned` as keyof GameState;
              (parsed[earnedKey] as number) += produced;
            }
          });
        }
      });
      
      setOfflineEarnings(offlineEarnings);
      setOfflineTime(timeDiff);
    }

    return { ...parsed, activeBoost: null, lastSaved: now }; 
  });

  const [showPrestige, setShowPrestige] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [goldenDiceActive, setGoldenDiceActive] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState<Partial<Record<ResourceType, number>> | null>(null);
  const [offlineTime, setOfflineTime] = useState(0);

  const goldenDiceTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const saveInterval = setInterval(() => {
      setState(prev => {
        const next = { ...prev, lastSaved: Date.now() };
        localStorage.setItem('tabletopTavernSaveReact', JSON.stringify(next));
        return next;
      });
    }, 10000); 
    return () => clearInterval(saveInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        let next = { ...prev };
        if (next.activeBoost) {
          if (next.activeBoost.timeLeft > 0) next.activeBoost = { ...next.activeBoost, timeLeft: next.activeBoost.timeLeft - 0.1 };
          else next.activeBoost = null;
        }

        const boostMult = next.activeBoost ? next.activeBoost.multiplier : 1;
        const finalMult = next.globalMultiplier * next.campaignMultiplier * boostMult;

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

  useEffect(() => {
    const spawnTimer = setInterval(() => {
      if (Math.random() < 0.10 && !goldenDiceActive) {
        setGoldenDiceActive(true);
        goldenDiceTimer.current = setTimeout(() => setGoldenDiceActive(false), 8000);
      }
    }, 30000);
    return () => { clearInterval(spawnTimer); if (goldenDiceTimer.current) clearTimeout(goldenDiceTimer.current); };
  }, [goldenDiceActive]);

  const addResourceToState = (state: GameState, res: ResourceType, amount: number) => {
    state[res] += amount;
    const earnedKey = `${res}Earned` as keyof GameState;
    if (typeof state[earnedKey] === 'number') (state[earnedKey] as number) += amount;
  };

  const handleMainClick = (e: React.MouseEvent) => {
    setState(prev => {
      let next = { ...prev };
      next.clicks += 1;
      const boostMult = next.activeBoost ? next.activeBoost.multiplier : 1;
      const gain = 1 * next.clickMultiplier * next.globalMultiplier * next.campaignMultiplier * boostMult;
      addResourceToState(next, 'players', gain);

      const isDiceGod = next.prestigeUpgradesBought.includes('diceGod');
      if (Math.random() < (isDiceGod ? 0.20 : 0.10)) addResourceToState(next, 'dice', 1);
      if (Math.random() < (isDiceGod ? 0.04 : 0.02)) addResourceToState(next, 'inspiration', 1);
      if (Math.random() < 0.01) addResourceToState(next, 'gold', 5);

      const el = document.createElement('div');
      el.className = 'floating-text';
      el.innerText = `+${formatNumber(gain)}`;
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

  // Nova função para coletar a missão
  const handleClaimQuest = (id: string) => {
    setState(prev => {
      let next = { ...prev };
      const quest = questsData.find(q => q.id === id);
      if (quest && quest.req(next) && !next.questsCompleted.includes(id)) {
        quest.applyReward(next);
        next.questsCompleted.push(id);
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
      }
      return next;
    });
  };

  const handlePrestige = () => {
    setState(prev => {
      const newCampaigns = prev.campaigns + 1;
      let next: GameState = {
        ...INITIAL_STATE,
        campaigns: newCampaigns,
        campaignMultiplier: 1 + (newCampaigns * 0.1),
        fate: prev.fate + Math.floor(prev.playersEarned / 10000),
        fateEarned: prev.fateEarned + Math.floor(prev.playersEarned / 10000),
        prestigeUpgradesBought: [...prev.prestigeUpgradesBought],
        lastSaved: Date.now(),
        lastDailyReward: prev.lastDailyReward,
        dailyStreak: prev.dailyStreak,
        questsCompleted: [...prev.questsCompleted] // Mantém o histórico de missões completadas no prestígio? Se sim, deixa. Se quiser resetar, remove essa linha.
      };
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
        if (Math.random() < 0.5) next.activeBoost = { id: 'golden', name: 'Sorte do Mestre', multiplier: 7, timeLeft: 15 };
        else {
          addResourceToState(next, 'players', next.players * 0.1 + 100);
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
        next.dice -= 10;
        next.minigamePlays += 1; // Incrementa o contador do minigame aqui
      }
      else if (result >= 2 && result <= 10) addResourceToState(next, 'gold', result * 10);
      else if (result >= 11 && result <= 15) addResourceToState(next, 'inspiration', 2);
      else if (result >= 16 && result <= 19) next.activeBoost = { id: 'roll', name: 'Bênção dos Dados', multiplier: 3, timeLeft: 20 };
      else if (result === 20) { addResourceToState(next, 'fate', 1); addResourceToState(next, 'inspiration', 5); }
      return next;
    });
  };

  const checkDailyReward = () => {
    const now = Date.now();
    const timeSinceLast = now - state.lastDailyReward;
    const oneDay = 24 * 60 * 60 * 1000;
    
    let currentStreak = state.dailyStreak;
    if (timeSinceLast > oneDay * 2) currentStreak = 0;
    
    return timeSinceLast >= oneDay && currentStreak < 7;
  };

  const handleClaimDaily = () => {
    setState(prev => {
      let next = { ...prev };
      let newStreak = prev.dailyStreak + 1;
      switch (newStreak) {
        case 1: addResourceToState(next, 'players', 500); break;
        case 2: addResourceToState(next, 'gold', 50); break;
        case 3: addResourceToState(next, 'dice', 10); break;
        case 4: addResourceToState(next, 'inspiration', 2); break;
        case 5: addResourceToState(next, 'players', 5000); break;
        case 6: addResourceToState(next, 'gold', 500); break;
        case 7: addResourceToState(next, 'fate', 1); break;
      }
      next.dailyStreak = newStreak;
      next.lastDailyReward = Date.now();
      return next;
    });
    setShowDaily(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      
      {checkDailyReward() && !showDaily && (
         <div style={{ position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', background: 'var(--gold)', color: 'black', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', zIndex: 100, animation: 'pulse 2s infinite', boxShadow: '0 0 20px var(--gold)' }} onClick={() => setShowDaily(true)}>
           🎁 Sua Recompensa Diária está pronta! Clique aqui.
         </div>
      )}

      <ResourceBar state={state} onOpenPrestige={() => setShowPrestige(true)} onOpenMinigame={() => setShowMinigame(true)} onOpenDaily={() => setShowDaily(true)} />
      
      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 150px)' }}>
        <ClickerArea state={state} onClick={handleMainClick} />
        <Shop 
          state={state} 
          buildings={buildingsData} 
          upgrades={upgradesData} 
          quests={questsData}
          onBuyBuilding={handleBuyBuilding} 
          onBuyUpgrade={handleBuyUpgrade} 
          onClaimQuest={handleClaimQuest} // Nova prop passada
        />
      </div>

      {showPrestige && <PrestigeTree state={state} onBuyPrestige={handleBuyPrestige} onPrestige={handlePrestige} onClose={() => setShowPrestige(false)} />}
      {showMinigame && <DiceMinigame state={state} onRoll={handleDiceRollResult} onClose={() => setShowMinigame(false)} />}
      {goldenDiceActive && <GoldenDice onCollect={handleGoldenDiceCollect} />}
      {offlineEarnings && <OfflinePopup earnings={offlineEarnings} timeAway={offlineTime} onClose={() => setOfflineEarnings(null)} />}
      {showDaily && <DailyReward state={state} onClaim={handleClaimDaily} onClose={() => setShowDaily(false)} canClaim={checkDailyReward()} />}

    </div>
  );
}