import { BossEncounter, GameState } from '../types';
import { BOSS_COMBO_STEP, bossHitDamage } from '../utils/game';
import { formatNumber } from '../utils/format';

interface Props {
  boss: BossEncounter;
  state: GameState;
  onHit: () => void;
}

export default function BossFight({ boss, state, onHit }: Props) {
  const percent = Math.max(0, Math.min(100, Math.round((boss.hp / boss.maxHp) * 100)));
  const phase = percent <= 33 ? 3 : percent <= 66 ? 2 : 1;
  const damage = bossHitDamage(state, boss);

  return (
    <div className="boss-card" role="dialog" aria-label={`Mesa ao Vivo: ${boss.name}`}>
      <div className="boss-head">
        <img src={boss.icon} alt="" className="boss-icon" />
        <div className="boss-titles">
          <span className="boss-kicker">Mesa ao Vivo · Fase {phase}</span>
          <h3>{boss.name}</h3>
        </div>
        <span className="boss-time">{Math.ceil(boss.timeLeft)}s</span>
      </div>

      <p className="boss-flavor">{boss.flavor}</p>

      <div className="boss-bar">
        <span className="boss-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="boss-meta">
        <span>{formatNumber(Math.max(0, boss.hp))} / {formatNumber(boss.maxHp)}</span>
        <span>
          Dano {formatNumber(damage)}
          {boss.combo > 0 ? ` · combo x${(1 + boss.combo * BOSS_COMBO_STEP).toFixed(2)}` : ''}
        </span>
      </div>

      <button type="button" className="btn btn-danger boss-hit" onClick={onHit}>
        Atacar
      </button>
    </div>
  );
}
