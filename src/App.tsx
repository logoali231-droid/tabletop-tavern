import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { BossEncounter, BuyAmount, GameState, ModalId } from './types';
import { achievementsData, buildingsData, upgradesData } from './data/gameData';
import { formatNumber } from './utils/format';
import { playSound } from './utils/sound';
import {
  BOSS_FIRST_DELAY,
  BOSS_MIN_PLAYERS,
  FAMILIAR_XP_PER_SECOND,
  FESTIVAL_POINTS_PER_SECOND,
  LEGACY_SAVE_KEY,
  PEST_CLICKS,
  PEST_FIRST_DELAY,
  PEST_MIN_PLAYERS,
  RESOURCE_IDS,
  SAVE_KEY,
  addFamiliarXp,
  addFestivalPoints,
  addResource,
  applyBossVictory,
  bossAttack,
  bossRitual,
  bossTaunt,
  bossTick,
  claimFestivalTier,
  clearPantheonSlot,
  currentMonthKey,
  expelPest,
  grantArtificerDice,
  nextPestDelay,
  tryBuyEditorial,
  tryBuyMastery,
  affordableUpgrades,
  applyAchievements,
  applyDiceRoll,
  applyGoldenEffect,
  collectStormDie,
  createBoss,
  diceRollMessage,
  getAdvantageCost,
  getClickValue,
  getCrossbreed,
  getFateGain,
  getGardenSlots,
  getGoldenDelayMult,
  getGoldenDuration,
  getGoldClickValue,
  getLegendGain,
  getPlotStatus,
  getProduction,
  getRollCost,
  getStormCount,
  hasBlessing,
  loadGame,
  nextBossDelay,
  normalizeSave,
  pickBuildingSpecial,
  pickGoldenEffect,
  prestigeReset,
  publishReset,
  resolveRoll,
  rollGoldReward,
  saveGame,
  setFamiliarAura,
  stormDieReward,
  serializeSave,
  tryBuyBuilding,
  tryBuyPrestige,
  tryBuyStudio,
  tryBuyUpgrade,
  tryEquipDie,
  tryHarvestPlot,
  trySeatGod,
  tryPlantSeed,
  trySellBuilding,
  trySpeedPlot,
} from './utils/game';
import ResourceBar from './components/ResourceBar';
import ClickerArea from './components/ClickerArea';
import Shop from './components/Shop';
import AchievementsModal from './components/AchievementsModal';
import StatsModal from './components/StatsModal';
import SettingsModal from './components/SettingsModal';
import PrestigeTree from './components/PrestigeTree';
import PublishModal from './components/PublishModal';
import DiceMinigame from './components/DiceMiniGame';
import GoldenDice from './components/GoldenDice';
import BossFight from './components/BossFight';
import EditoraModal from './components/EditoraModal';
import ArtificeModal from './components/ArtificeModal';
import GoblinPest from './components/GoblinPest';
import NewsTicker from './components/NewsTicker';
import OfflineModal from './components/OfflineModal';
import GardenModal from './components/GardenModal';
import StudioModal from './components/StudioModal';
import FamiliarModal from './components/FamiliarModal';
import FestivalModal from './components/FestivalModal';
import PantheonModal from './components/PantheonModal';
import HelpModal from './components/HelpModal';
import Tutorial from './components/Tutorial';
import { GARDEN_TUTORIAL_KEY, gardenTutorialSteps, TUTORIAL_KEY, tutorialSteps } from './data/tutorial';

interface Particle {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface Toast {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

interface GoldenSpawn {
  id: number;
  x: number;
  y: number;
  bonus?: boolean;
}

const STORM_DIE_VISIBLE_MS = 6000;

function randomPosition() {
  return { x: 8 + Math.random() * 78, y: 16 + Math.random() * 60 };
}

export default function App() {
  const [boot] = useState(loadGame);
  const [state, setState] = useState<GameState>(boot.state);
  const [offlineReport, setOfflineReport] = useState(boot.offline);
  const [modal, setModal] = useState<ModalId | null>(null);
  const [buyAmount, setBuyAmount] = useState<BuyAmount>(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [golden, setGolden] = useState<GoldenSpawn | null>(null);
  const [saveText, setSaveText] = useState('');
  const [savedAt, setSavedAt] = useState(Date.now());
  const [boss, setBoss] = useState<BossEncounter | null>(null);
  const [tutorialStep, setTutorialStep] = useState<number | null>(() => {
    try {
      return localStorage.getItem(TUTORIAL_KEY) === 'done' ? null : 0;
    } catch {
      return 0;
    }
  });
  const [gardenStep, setGardenStep] = useState<number | null>(null);

  const stateRef = useRef(state);
  const particleId = useRef(0);
  const toastId = useRef(0);
  const skipSave = useRef(false);
  const seenAchievements = useRef(new Set(boot.state.achievements));
  const goldenRef = useRef<{ until: number } | null>(null);
  const nextGoldenAt = useRef(0);
  const stormQueue = useRef<number[]>([]);
  const bossRef = useRef<BossEncounter | null>(null);
  const nextBossAt = useRef(Date.now() + BOSS_FIRST_DELAY * 1000);
  const nextPestAt = useRef(Date.now() + PEST_FIRST_DELAY);
  const modalRef = useRef<ModalId | null>(null);
  const tutorialRef = useRef<number | null>(null);
  const gardenTutorialRef = useRef<number | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /* ---------------- guided tour ---------------- */
  useEffect(() => {
    if (tutorialStep === null) return;
    setModal(tutorialSteps[tutorialStep]?.modal ?? null);
  }, [tutorialStep]);

  const finishTutorial = () => {
    try {
      localStorage.setItem(TUTORIAL_KEY, 'done');
    } catch {
      /* storage blocked: the tour simply returns on the next visit */
    }
    setTutorialStep(null);
    setModal(null);
  };

  const tutorialNext = () => {
    if (tutorialStep === null) return;
    if (tutorialStep + 1 >= tutorialSteps.length) {
      finishTutorial();
      return;
    }
    setTutorialStep(tutorialStep + 1);
  };

  const tutorialPrev = () => {
    if (tutorialStep === null || tutorialStep === 0) return;
    setTutorialStep(tutorialStep - 1);
  };

  /* ---------------- guided tour of the Grimório ---------------- */
  useEffect(() => {
    if (gardenStep === null) return;
    setModal('garden');
  }, [gardenStep]);

  /* Opens once on the first visit to the Grimório, never behind the main tour. */
  useEffect(() => {
    if (modal !== 'garden' || tutorialStep !== null || gardenStep !== null) return;
    try {
      if (localStorage.getItem(GARDEN_TUTORIAL_KEY) !== 'done') setGardenStep(0);
    } catch {
      /* storage blocked: the tour simply returns next time */
    }
  }, [modal, tutorialStep, gardenStep]);

  const startGardenTutorial = () => setGardenStep(0);

  const finishGardenTutorial = () => {
    try {
      localStorage.setItem(GARDEN_TUTORIAL_KEY, 'done');
    } catch {
      /* storage blocked: the tour simply returns on the next visit */
    }
    setGardenStep(null);
  };

  const gardenNext = () => {
    if (gardenStep === null) return;
    if (gardenStep + 1 >= gardenTutorialSteps.length) {
      finishGardenTutorial();
      return;
    }
    setGardenStep(gardenStep + 1);
  };

  const gardenPrev = () => {
    if (gardenStep === null || gardenStep === 0) return;
    setGardenStep(gardenStep - 1);
  };

  /* ---------------- Mesas ao Vivo (bosses) ---------------- */
  useEffect(() => {
    bossRef.current = boss;
  }, [boss]);

  useEffect(() => {
    modalRef.current = modal;
  }, [modal]);

  useEffect(() => {
    tutorialRef.current = tutorialStep;
  }, [tutorialStep]);

  useEffect(() => {
    gardenTutorialRef.current = gardenStep;
  }, [gardenStep]);

  const resetBossClock = () => {
    bossRef.current = null;
    setBoss(null);
    nextBossAt.current = Date.now() + nextBossDelay();
    nextPestAt.current = Date.now() + PEST_FIRST_DELAY;
  };

  const pushToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = toastId.current + 1;
    toastId.current = id;
    setToasts((previous) => [...previous, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((item) => item.id !== id));
    }, 5200);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Paused while a panel or the tour is open, so no fight is wasted in the background.
      if (modalRef.current !== null || tutorialRef.current !== null || gardenTutorialRef.current !== null) return;

      const current = stateRef.current;
      const active = bossRef.current;

      if (!active) {
        if (current.playersEarned < BOSS_MIN_PLAYERS) return;
        if (Date.now() >= nextBossAt.current) {
          const created = createBoss(current);
          bossRef.current = created;
          setBoss(created);
        }
        return;
      }

      const tick = bossTick(current, active, 0.5);
      if (tick.expired) {
        bossRef.current = null;
        setBoss(null);
        nextBossAt.current = Date.now() + nextBossDelay();
        pushToast({
          title: 'Mesa ao Vivo encerrada',
          desc: `${active.name} cansou de esperar e foi embora.`,
          icon: active.icon,
        });
        return;
      }

      bossRef.current = tick.boss;
      setBoss(tick.boss);
    }, 500);
    return () => window.clearInterval(interval);
  }, [pushToast]);

  /* ---------------- Goblins na Taverna (pestes) ---------------- */
  useEffect(() => {
    const interval = window.setInterval(() => {
      // Like the boss clock, a pest never spawns behind a panel or the tour.
      if (modalRef.current !== null || tutorialRef.current !== null || gardenTutorialRef.current !== null) return;
      const current = stateRef.current;
      if (current.pest || current.playersEarned < PEST_MIN_PLAYERS) return;
      if (Date.now() < nextPestAt.current) return;

      setState((previous) => (previous.pest
        ? previous
        : { ...previous, pest: { spawnedAt: Date.now(), clicks: 0 } }));
      nextPestAt.current = Date.now() + nextPestDelay();
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  /* ---------------- game loop ---------------- */
  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((previous) => {
        const next: GameState = { ...previous };
        next.playTime = previous.playTime + 0.1;

        if (previous.activeBoosts.length > 0) {
          next.activeBoosts = previous.activeBoosts
            .map((boost) => ({ ...boost, timeLeft: boost.timeLeft - 0.1 }))
            .filter((boost) => boost.timeLeft > 0);
        }

        const production = getProduction(next);
        for (const resource of RESOURCE_IDS) {
          addResource(next, resource, production[resource] * 0.1);
        }
        next.familiar = {
          ...next.familiar,
          xp: next.familiar.xp + FAMILIAR_XP_PER_SECOND * 0.1,
        };
        const month = currentMonthKey();
        next.festival = next.festival.month === month
          ? { ...next.festival, points: next.festival.points + FESTIVAL_POINTS_PER_SECOND * 0.1 }
          : { month, points: FESTIVAL_POINTS_PER_SECOND * 0.1, claimed: [] };
        return applyAchievements(grantArtificerDice(next));
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, []);

  /* ---------------- persistence ---------------- */
  useEffect(() => {
    const persist = () => {
      if (!skipSave.current) saveGame(stateRef.current);
    };
    const interval = window.setInterval(() => {
      persist();
      setSavedAt(Date.now());
    }, 2000);
    window.addEventListener('beforeunload', persist);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', persist);
      persist();
    };
  }, []);

  /* ---------------- achievement toasts ---------------- */
  useEffect(() => {
    const fresh = state.achievements.filter((id) => !seenAchievements.current.has(id));
    if (fresh.length === 0) return;
    for (const id of fresh) {
      seenAchievements.current.add(id);
      const achievement = achievementsData.find((entry) => entry.id === id);
      if (achievement) {
        pushToast({
          title: 'Conquista desbloqueada',
          desc: achievement.name,
          icon: achievement.icon,
        });
      }
    }
    playSound('achievement', stateRef.current.soundOn);
  }, [state.achievements, pushToast]);

  /* ---------------- golden dice scheduling ---------------- */
  const scheduleGolden = useCallback(() => {
    const delay = (60000 + Math.random() * 90000) * getGoldenDelayMult(stateRef.current);
    nextGoldenAt.current = Date.now() + delay;
  }, []);

  useEffect(() => {
    scheduleGolden();
    const interval = window.setInterval(() => {
      const now = Date.now();
      if (goldenRef.current) {
        if (now < goldenRef.current.until) return;
        goldenRef.current = null;
        setGolden(null);
        if (stormQueue.current.length === 0) scheduleGolden();
        return;
      }

      const stormAt = stormQueue.current[0];
      if (stormAt !== undefined) {
        if (now < stormAt) return;
        stormQueue.current.shift();
        goldenRef.current = { until: now + STORM_DIE_VISIBLE_MS };
        setGolden({ id: now, ...randomPosition(), bonus: true });
        return;
      }

      if (now >= nextGoldenAt.current) {
        goldenRef.current = { until: now + getGoldenDuration(stateRef.current) };
        setGolden({ id: now, ...randomPosition() });
      }
    }, 400);
    return () => window.clearInterval(interval);
  }, [scheduleGolden]);

  /* ---------------- auto harvest (Bibliotecário) ---------------- */
  useEffect(() => {
    const interval = window.setInterval(() => {
      const current = stateRef.current;
      if (!hasBlessing(current, 'librarian')) return;
      const slots = getGardenSlots(current);
      const ready = Array.from({ length: slots }, (_, index) => index)
        .filter((index) => getPlotStatus(current, index)?.mature);
      if (ready.length === 0) return;

      const hybrid = ready
        .map((index) => getCrossbreed(current, index))
        .find((seed) => seed && !current.hybridSeeds.includes(seed.id));

      setState((previous) => {
        let next = previous;
        for (const index of ready) next = tryHarvestPlot(next, index)?.state ?? next;
        return next;
      });
      playSound('achievement', current.soundOn);
      pushToast({
        title: 'Bibliotecário Eterno',
        desc: `${ready.length} trama(s) colhida(s) automaticamente.${hybrid ? ` Híbrido: ${hybrid.name}!` : ''}`,
        icon: '/icons/scroll.svg',
      });
    }, 2000);
    return () => window.clearInterval(interval);
  }, [pushToast]);

  /* ---------------- actions ---------------- */
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    const current = stateRef.current;
    const gain = getClickValue(current);
    const production = getProduction(current);
    const goldGain = getGoldClickValue(current);
    const diceGod = hasBlessing(current, 'diceGod');
    playSound('click', current.soundOn);

    setState((previous) => {
      const next: GameState = { ...previous, clicks: previous.clicks + 1 };
      addResource(next, 'players', gain);
      if (goldGain > 0) addResource(next, 'gold', goldGain);
      if (Math.random() < (diceGod ? 0.2 : 0.1)) addResource(next, 'dice', 1);
      if (Math.random() < (diceGod ? 0.04 : 0.02)) addResource(next, 'inspiration', 1);
      if (Math.random() < 0.01) addResource(next, 'gold', Math.max(5, production.gold * 12));
      return applyAchievements(addFamiliarXp(addFestivalPoints(next, 1), 1));
    });

    if (event.clientX > 0 || event.clientY > 0) {
      const id = particleId.current + 1;
      particleId.current = id;
      setParticles((previous) => [...previous, { id, x: event.clientX, y: event.clientY, value: gain }]);
      window.setTimeout(() => {
        setParticles((previous) => previous.filter((item) => item.id !== id));
      }, 950);
    }
  };

  const buyBuilding = (id: string, amount: BuyAmount) => {
    if (!tryBuyBuilding(stateRef.current, id, amount)) return;
    playSound('buy', stateRef.current.soundOn);
    setState((previous) => tryBuyBuilding(previous, id, amount) ?? previous);
  };

  const sellBuilding = (id: string, amount: BuyAmount) => {
    if (!trySellBuilding(stateRef.current, id, amount)) return;
    playSound('click', stateRef.current.soundOn);
    setState((previous) => trySellBuilding(previous, id, amount) ?? previous);
  };

  const buyUpgrade = (id: string) => {
    if (!tryBuyUpgrade(stateRef.current, id)) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState((previous) => tryBuyUpgrade(previous, id) ?? previous);
  };

  const buyAllUpgrades = () => {
    const ids = affordableUpgrades(stateRef.current);
    if (ids.length === 0) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState((previous) => ids.reduce(
      (current, id) => tryBuyUpgrade(current, id) ?? current,
      previous,
    ));
  };

  const buyPrestige = (id: string, cost: number) => {
    if (!tryBuyPrestige(stateRef.current, id, cost)) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState((previous) => tryBuyPrestige(previous, id, cost) ?? previous);
  };

  const doPrestige = () => {
    const current = stateRef.current;
    const gained = getFateGain(current);
    if (gained < 1) return;
    const confirmed = window.confirm(
      `Iniciar uma nova campanha por +${gained} Destino?\n\n`
      + 'Jogadores, ouro, dados, inspiração, construções e melhorias serão perdidos. '
      + 'Conquistas, bênçãos, tramas e Destino permanecem.',
    );
    if (!confirmed) return;

    playSound('prestige', current.soundOn);
    stormQueue.current = [];
    resetBossClock();
    setState((previous) => addFamiliarXp(prestigeReset(previous), 400));
    setModal(null);
    pushToast({ title: 'Nova campanha', desc: `Você ganhou ${gained} Destino.`, icon: '/icons/fate.svg' });
    scheduleGolden();
  };

  const doPublish = () => {
    const current = stateRef.current;
    const gained = getLegendGain(current);
    if (gained < 1) return;
    const confirmed = window.confirm(
      `Publicar a campanha por +${gained} Lendas?\n\n`
      + 'Campanhas, bênçãos, Destino, recursos, construções e melhorias serão perdidos. '
      + 'Conquistas, dados, híbridos, níveis do Estúdio e todas as Lendas permanecem.',
    );
    if (!confirmed) return;

    playSound('prestige', current.soundOn);
    stormQueue.current = [];
    resetBossClock();
    setState((previous) => addFamiliarXp(publishReset(previous), 800));
    setModal(null);
    pushToast({ title: 'Saga publicada', desc: `Você ganhou ${gained} Lendas.`, icon: '/icons/crown.svg' });
    scheduleGolden();
  };

  const finishBoss = (current: BossEncounter, source?: GameState) => {
    const game = source ?? stateRef.current;
    const result = applyBossVictory(game, current);
    setState(addFamiliarXp(addFestivalPoints(result.state, 50), 120));
    resetBossClock();
    playSound('golden', game.soundOn);
    pushToast({
      title: 'Mesa ao Vivo vencida',
      desc: `${current.name} caiu: +${result.gains.fate} Destino, Troféu da Mesa (x3 por 30s) e recompensa extra pela pressa.`,
      icon: current.icon,
    });
  };

  const hitBoss = () => {
    const current = bossRef.current;
    if (!current) return;
    playSound('click', stateRef.current.soundOn);
    const next = bossAttack(stateRef.current, current);
    if (next.hp <= 0) {
      finishBoss(next);
      return;
    }
    bossRef.current = next;
    setBoss(next);
  };

  const tauntBoss = () => {
    const current = bossRef.current;
    if (!current) return;
    const result = bossTaunt(stateRef.current, current);
    if (!result) return;
    playSound('click', result.state.soundOn);
    setState(result.state);
    bossRef.current = result.boss;
    setBoss(result.boss);
  };

  const ritualBoss = () => {
    const current = bossRef.current;
    if (!current) return;
    const result = bossRitual(stateRef.current, current);
    if (!result) return;
    playSound('upgrade', result.state.soundOn);
    setState(result.state);
    if (result.boss.hp <= 0) {
      finishBoss(result.boss, result.state);
      return;
    }
    bossRef.current = result.boss;
    setBoss(result.boss);
  };

  const buyEditorial = (id: string) => {
    const next = tryBuyEditorial(stateRef.current, id);
    if (!next) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(next);
  };

  const buyMastery = (id: string) => {
    const next = tryBuyMastery(stateRef.current, id);
    if (!next) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(next);
  };

  const hitPest = () => {
    const current = stateRef.current;
    if (!current.pest) return;
    playSound('click', current.soundOn);

    if (current.pest.clicks + 1 < PEST_CLICKS) {
      setState({
        ...current,
        pest: { ...current.pest, clicks: current.pest.clicks + 1 },
      });
      return;
    }

    const result = expelPest(current);
    if (!result) return;
    setState(result.state);
    playSound('golden', current.soundOn);
    pushToast({
      title: 'Goblin expulso',
      desc: `Baú: +${formatNumber(result.reward.gold)} ouro, +${formatNumber(result.reward.dice)} dados`
        + (result.reward.artificerDice > 0 ? ' e +1 Dado de Artífice!' : '.'),
      icon: '/icons/goblin.svg',
    });
  };

  const buyStudio = (id: string) => {
    const next = tryBuyStudio(stateRef.current, id);
    if (!next) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(next);
  };

  const equipDie = (id: string) => {
    const next = tryEquipDie(stateRef.current, id);
    if (!next) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(next);
  };

  /** Charges the dice and resolves the roll immediately, so closing the modal cannot eat it. */
  const spinDice = (withAdvantage: boolean): { result: number; message: string } | null => {
    const current = stateRef.current;
    const freeAdvantage = hasBlessing(current, 'advantage');
    const cost = withAdvantage ? getAdvantageCost(current) : getRollCost(current);
    if (current.dice < cost) return null;

    const first = Math.floor(Math.random() * 20) + 1;
    const second = withAdvantage || freeAdvantage ? Math.floor(Math.random() * 20) + 1 : first;
    const result = resolveRoll(current, Math.max(first, second));
    const goldReward = rollGoldReward(result, getProduction(current), current);

    playSound(result >= 16 ? 'golden' : 'click', current.soundOn);
    setState((previous) => {
      if (previous.dice < cost) return previous;
      return applyDiceRoll({ ...previous, dice: previous.dice - cost }, result, goldReward);
    });

    return { result, message: diceRollMessage(result, goldReward) };
  };

  const collectGolden = (event?: MouseEvent<HTMLButtonElement>) => {
    if (!golden) return;
    goldenRef.current = null;
    setGolden(null);
    const current = stateRef.current;
    playSound('golden', current.soundOn);

    if (golden.bonus) {
      const gains = stormDieReward(current);
      setState((previous) => addFestivalPoints(collectStormDie(previous), 20));
      // Every storm die must visibly pay out, or the rain feels like decoration.
      if (event) {
        const id = particleId.current + 1;
        particleId.current = id;
        setParticles((previous) => [...previous, {
          id,
          x: event.clientX,
          y: event.clientY,
          value: gains.players,
        }]);
        window.setTimeout(() => {
          setParticles((previous) => previous.filter((item) => item.id !== id));
        }, 950);
      }
      if (stormQueue.current.length === 0) scheduleGolden();
      return;
    }

    const effect = pickGoldenEffect();
    const targetId = effect.id === 'buildingSpecial' ? pickBuildingSpecial(current) : null;
    setState((previous) => addFestivalPoints(applyGoldenEffect(previous, effect, targetId), 20));

    const target = targetId ? buildingsData.find((entry) => entry.id === targetId) : null;
    pushToast({
      title: effect.name,
      desc: target ? `${target.name} ganhou cópias grátis!` : effect.desc,
      icon: '/icons/golden-d20.svg',
    });

    if (effect.spawns) {
      const now = Date.now();
      const count = getStormCount(current, effect.spawns);
      stormQueue.current = Array.from(
        { length: count },
        (_, index) => now + 700 + index * 1000,
      );
    } else {
      scheduleGolden();
    }
  };

  /* ---------------- garden actions ---------------- */
  const plantSeed = (index: number, seedId: string) => {
    const next = tryPlantSeed(stateRef.current, index, seedId);
    if (!next) return;
    playSound('buy', stateRef.current.soundOn);
    setState(next);
  };

  const harvestPlot = (index: number) => {
    const result = tryHarvestPlot(stateRef.current, index);
    if (!result) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(addFamiliarXp(addFestivalPoints(result.state, 10), 20));
    pushToast({ title: 'Trama colhida', desc: result.message, icon: '/icons/scroll.svg' });
    if (result.hybrid) {
      pushToast({
        title: 'Híbrido descoberto',
        desc: `${result.hybrid.name} agora pode ser plantada.`,
        icon: result.hybrid.icon,
      });
    }
  };

  const speedPlot = (index: number) => {
    const next = trySpeedPlot(stateRef.current, index);
    if (!next) return;
    playSound('click', stateRef.current.soundOn);
    setState(next);
  };

  /* ---------------- familiar, festival e panteão ---------------- */
  const pickFamiliarAura = (id: string) => {
    const next = setFamiliarAura(stateRef.current, id);
    if (!next) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(next);
  };

  const claimTier = (id: string) => {
    const result = claimFestivalTier(stateRef.current, id);
    if (!result) return;
    playSound('golden', result.state.soundOn);
    setState(result.state);
    pushToast({ title: 'Festival do Mês', desc: result.message, icon: '/icons/crown.svg' });
  };

  const seatGod = (godId: string, slot: number) => {
    const next = trySeatGod(stateRef.current, godId, slot);
    if (!next) return;
    playSound('upgrade', stateRef.current.soundOn);
    setState(next);
  };

  const clearGod = (slot: number) => {
    const next = clearPantheonSlot(stateRef.current, slot);
    if (!next) return;
    playSound('click', stateRef.current.soundOn);
    setState(next);
  };

  /* ---------------- menu actions ---------------- */
  const openModal = (next: ModalId) => {
    if (next === 'settings') setSaveText(serializeSave(stateRef.current));
    setModal(next);
  };

  const toggleSound = () => {
    setState((previous) => ({ ...previous, soundOn: !previous.soundOn }));
  };

  const importSave = (raw: string): string | null => {
    try {
      const next = normalizeSave(JSON.parse(raw));
      if (!next) return 'Esse texto não parece um save válido.';
      skipSave.current = true;
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...next, activeBoosts: [] }));
      window.location.reload();
      return null;
    } catch {
      return 'Não foi possível ler esse save. Verifique se copiou o texto completo.';
    }
  };

  const resetSave = () => {
    if (!window.confirm('Apagar todo o progresso e começar do zero? Essa ação não pode ser desfeita.')) return;
    skipSave.current = true;
    try {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(LEGACY_SAVE_KEY);
    } catch {
      /* ignore storage errors */
    }
    window.location.reload();
  };

  return (
    <div className="app">
      <ResourceBar state={state} onOpen={openModal} savedAt={savedAt} />

      <div className="layout">
        <ClickerArea state={state} onClick={handleClick} onOpen={openModal} />
        <Shop
          state={state}
          buildings={buildingsData}
          upgrades={upgradesData}
          buyAmount={buyAmount}
          onBuyAmountChange={setBuyAmount}
          onBuyBuilding={buyBuilding}
          onSellBuilding={sellBuilding}
          onBuyUpgrade={buyUpgrade}
          onBuyAllUpgrades={buyAllUpgrades}
        />
      </div>

      <NewsTicker />

      {particles.map((particle) => (
        <div
          className="floating-text"
          key={particle.id}
          style={{ left: particle.x, top: particle.y }}
        >
          +{formatNumber(particle.value)}
        </div>
      ))}

      <div className="toast-stack">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            <img src={toast.icon} alt="" className="toast-icon" />
            <div>
              <div className="toast-title">{toast.title}</div>
              <div className="toast-desc">{toast.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {golden ? (
        <GoldenDice x={golden.x} y={golden.y} bonus={golden.bonus} onCollect={collectGolden} />
      ) : null}

      {boss ? (
        <BossFight
          boss={boss}
          state={state}
          onHit={hitBoss}
          onTaunt={tauntBoss}
          onRitual={ritualBoss}
        />
      ) : null}

      {state.pest ? <GoblinPest pest={state.pest} onHit={hitPest} raised={boss !== null} /> : null}

      {modal === 'garden' ? (
        <GardenModal
          state={state}
          onPlant={plantSeed}
          onHarvest={harvestPlot}
          onSpeed={speedPlot}
          onTutorial={startGardenTutorial}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === 'studio' ? (
        <StudioModal state={state} onBuy={buyStudio} onClose={() => setModal(null)} />
      ) : null}

      {modal === 'familiar' ? (
        <FamiliarModal state={state} onPickAura={pickFamiliarAura} onClose={() => setModal(null)} />
      ) : null}

      {modal === 'festival' ? (
        <FestivalModal state={state} onClaim={claimTier} onClose={() => setModal(null)} />
      ) : null}

      {modal === 'pantheon' ? (
        <PantheonModal
          state={state}
          onSeat={seatGod}
          onClear={clearGod}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === 'prestige' ? (
        <PrestigeTree
          state={state}
          onBuyPrestige={buyPrestige}
          onPrestige={doPrestige}
          onOpenPublish={() => setModal('publish')}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === 'publish' ? (
        <PublishModal
          state={state}
          onPublish={doPublish}
          onOpenEditora={() => setModal('editora')}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === 'editora' ? (
        <EditoraModal state={state} onBuy={buyEditorial} onClose={() => setModal('publish')} />
      ) : null}

      {modal === 'artifice' ? (
        <ArtificeModal state={state} onBuy={buyMastery} onClose={() => setModal(null)} />
      ) : null}

      {modal === 'minigame' ? (
        <DiceMinigame
          state={state}
          onSpin={spinDice}
          onEquip={equipDie}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === 'achievements' ? (
        <AchievementsModal state={state} onClose={() => setModal(null)} />
      ) : null}

      {modal === 'stats' ? (
        <StatsModal state={state} onClose={() => setModal(null)} />
      ) : null}

      {modal === 'settings' ? (
        <SettingsModal
          state={state}
          saveText={saveText}
          onToggleSound={toggleSound}
          onImport={importSave}
          onReset={resetSave}
          onClose={() => setModal(null)}
        />
      ) : null}

      {modal === 'help' ? (
        <HelpModal
          onStartTutorial={() => {
            setGardenStep(null);
            setModal(null);
            setTutorialStep(0);
          }}
          onClose={() => setModal(null)}
        />
      ) : null}

      {offlineReport ? (
        <OfflineModal report={offlineReport} onClose={() => setOfflineReport(null)} />
      ) : null}

      {tutorialStep !== null && tutorialSteps[tutorialStep] ? (
        <Tutorial
          steps={tutorialSteps}
          step={tutorialStep}
          onNext={tutorialNext}
          onPrev={tutorialPrev}
          onClose={finishTutorial}
        />
      ) : null}

      {gardenStep !== null && gardenTutorialSteps[gardenStep] ? (
        <Tutorial
          steps={gardenTutorialSteps}
          step={gardenStep}
          label="Grimório"
          onNext={gardenNext}
          onPrev={gardenPrev}
          onClose={finishGardenTutorial}
        />
      ) : null}

    </div>
  );
}
