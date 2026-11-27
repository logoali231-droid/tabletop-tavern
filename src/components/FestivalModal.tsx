import { GameState } from '../types';
import { festivalData, festivalTiersData } from '../data/gameData';
import {
  getFestival,
  getFestivalProgress,
  getFestivalTierStatus,
  RESOURCES,
} from '../utils/game';
import { formatNumber } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onClaim: (id: string) => void;
  onClose: () => void;
}

export default function FestivalModal({ state, onClaim, onClose }: Props) {
  const festival = getFestival();
  const progress = getFestivalProgress(state);
  const tiers = getFestivalTierStatus(state);
  const goal = festivalTiersData[festivalTiersData.length - 1]?.points ?? 1;
  const percent = Math.min(100, (progress.points / goal) * 100);
  const nextTier = tiers.find((entry) => !entry.claimed);
  const monthName = new Date().toLocaleDateString('pt-BR', { month: 'long' });

  return (
    <Modal title="Festival do Mês" icon="/icons/crown.svg" size="wide" onClose={onClose}>
      <div className="festival-hero">
        <img src={festival.icon} alt="" className="festival-icon" />
        <div>
          <span className="familiar-kicker">Festival de {monthName}</span>
          <h3>{festival.name}</h3>
          <p className="festival-flavor">{festival.flavor}</p>
        </div>
      </div>

      <p className="modal-lead">{festival.desc}</p>

      <div className="festival-bonus-row">
        {Object.entries(festival.production).map(([resource, mult]) => (
          <span className="festival-bonus" key={resource}>
            {RESOURCES.find((entry) => entry.id === resource)?.label ?? resource} x{mult}
          </span>
        ))}
        {festival.clickMult ? <span className="festival-bonus">Clique x{festival.clickMult}</span> : null}
        {festival.goldenMult ? (
          <span className="festival-bonus">Dourados x{festival.goldenMult} frequência</span>
        ) : null}
      </div>

      <div className="festival-progress-head">
        <span>
          <strong>{formatNumber(progress.points)}</strong> pontos
        </span>
        <span className="muted">
          {nextTier
            ? `Próxima meta: ${nextTier.tier.name} (${formatNumber(nextTier.tier.points)})`
            : 'Todas as metas do mês concluídas'}
        </span>
      </div>
      <div className="familiar-bar festival-bar">
        <span className="familiar-bar-fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="festival-hint">
        Cliques, colheitas, Mesas ao Vivo e o tempo de jogo rendem pontos. No dia 1º do mês
        seguinte o festival vira e a contagem recomeça — os prêmios resgatados ficam.
      </p>

      <div className="festival-tiers">
        {tiers.map(({ tier, claimed, ready }) => (
          <div key={tier.id} className={`festival-tier${claimed ? ' claimed' : ''}${ready ? ' ready' : ''}`}>
            <img src={tier.icon} alt="" className="blessing-icon" />
            <div className="festival-tier-text">
              <h4>{tier.name}</h4>
              <p className="blessing-desc">{tier.desc}</p>
              <span className="festival-tier-points">
                {formatNumber(tier.points)} pontos
                {claimed ? ' · resgatado' : ready ? ' · pronto' : ''}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!ready}
              onClick={() => onClaim(tier.id)}
            >
              {claimed ? 'Resgatado' : 'Resgatar'}
            </button>
          </div>
        ))}
      </div>

      <p className="festival-hint">
        Próximo festival em {festivalData[(festival.month + 1) % festivalData.length].name}. Ele
        começa sozinho quando o mês virar.
      </p>
    </Modal>
  );
}
