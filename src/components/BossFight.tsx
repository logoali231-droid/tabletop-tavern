import { BossEncounter, GameState } from '../types';
import { bossAffixLabels } from '../data/gameData';
import {
  BOSS_COMBO_STEP,
  BOSS_FOCUS_STEP,
  BOSS_RITUAL_COST,
  BOSS_TAUNT_COST,
  bossHitDamage,
  bossShieldFor,
} from '../utils/game';
import { formatNumber } from '../utils/format';

interface Props {
  boss: BossEncounter;
  state: GameState;
  onHit: () => void;
  onTaunt: () => void;
  onRitual: () => void;
}

export default function BossFight({ boss, state, onHit, onTaunt, onRitual }: Props) {
  const percent = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));
  const maxShield = bossShieldFor(boss);
  const shieldPercent = maxShield > 0 ? Math.min(100, Math.round((boss.shield / maxShield) * 100)) : 0;
  const damage = bossHitDamage(state, boss);
  const affix = bossAffixLabels[boss.affix];
  const canTaunt = state.dice >= BOSS_TAUNT_COST;
  const canRitual = boss.ritualReady && state.dice >= BOSS_RITUAL_COST;

  return (
    <div className="boss-card" role="dialog" aria-label={`Mesa ao Vivo: ${boss.name}`}>
      <div className="boss-head">
        <img src={boss.icon} alt="" className="boss-icon" />
        <div className="boss-titles">
          <span className="boss-kicker">
            Mesa ao Vivo · Fase {boss.phase}
            <span className={`boss-phase-pip phase-${boss.phase}`} />
          </span>
          <h3>{boss.name}</h3>
          <span className="boss-affix" title={affix.desc}>{affix.name}</span>
        </div>
        <span className="boss-time">{Math.ceil(boss.timeLeft)}s</span>
      </div>

      <p className="boss-flavor">{boss.flavor}</p>

      <div className="boss-bar">
        <span className="boss-bar-fill" style={{ width: `${percent}%` }} />
      </div>
      {maxShield > 0 ? (
        <div className="boss-shield">
          <span className="boss-shield-fill" style={{ width: `${shieldPercent}%` }} />
          <span className="boss-shield-label">
            Escudo {formatNumber(Math.max(0, boss.shield))}
          </span>
        </div>
      ) : null}

      <div className="boss-meta">
        <span>
          {formatNumber(Math.max(0, boss.hp))} / {formatNumber(boss.maxHp)}
        </span>
        <span>Dano {formatNumber(damage)}</span>
      </div>

      <div className="boss-chips">
        <span className="boss-chip" title="Cada ataque aumenta o combo em 8%">
          Combo x{(1 + boss.combo * BOSS_COMBO_STEP).toFixed(2)}
        </span>
        <span className="boss-chip focus" title="Provocar acumula foco: +30% de dano por foco">
          Foco {boss.focus} · x{(1 + boss.focus * BOSS_FOCUS_STEP).toFixed(2)}
        </span>
        <span className="boss-chip">{boss.ritualReady ? 'Ritual pronto' : 'Ritual usado'}</span>
      </div>

      <div className="boss-actions">
        <button type="button" className="btn btn-danger boss-hit" onClick={onHit}>
          Atacar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canTaunt}
          onClick={onTaunt}
          title="Quebra o escudo, +1 foco e zera o combo"
        >
          Provocar · {BOSS_TAUNT_COST} dados
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={!canRitual}
          onClick={onRitual}
          title="Dano massivo que ignora escudo, uma vez por fase"
        >
          Ritual · {BOSS_RITUAL_COST} dados
        </button>
      </div>

      <div className="boss-log" aria-live="polite">
        {boss.log.map((line, index) => (
          <span key={`${index}-${line}`} className="boss-log-line">{line}</span>
        ))}
      </div>
    </div>
  );
}
