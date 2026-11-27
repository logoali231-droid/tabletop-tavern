import { GameState } from '../types';
import { studioData } from '../data/gameData';
import { formatNumber } from '../utils/format';
import { getStudioLevel, studioCost } from '../utils/game';
import Modal from './Modal';

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
  onClose: () => void;
}

export default function StudioModal({ state, onBuy, onClose }: Props) {
  const totalLevels = studioData.reduce((sum, upgrade) => sum + getStudioLevel(state, upgrade.id), 0);

  return (
    <Modal title="Estúdio de Ideias" icon="/icons/inspiration.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Gaste <strong>inspiração</strong> em manuscritos permanentes. Cada nível vale para sempre,
        sobrevive a novas campanhas e não tem limite — quanto mais ideias você junta, mais fundo dá
        para cavar.
      </p>

      <div className="garden-stats">
        <div className="garden-stat">
          <span className="prestige-label">Inspiração</span>
          <strong className="garden-stat-value insp">{formatNumber(state.inspiration)}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Níveis comprados</span>
          <strong className="garden-stat-value">{formatNumber(totalLevels)}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Manuscritos</span>
          <strong className="garden-stat-value">{studioData.length}</strong>
        </div>
      </div>

      <div className="studio-grid">
        {studioData.map((upgrade) => {
          const level = getStudioLevel(state, upgrade.id);
          const cost = studioCost(upgrade, level);
          const affordable = state.inspiration >= cost;
          return (
            <div key={upgrade.id} className={`studio-card${affordable ? ' affordable' : ''}`}>
              <div className="studio-head">
                <img src={upgrade.icon} alt="" className="blessing-icon" />
                <h4>{upgrade.name}</h4>
                <span className="studio-level">Nível {level}</span>
              </div>
              <p className="blessing-desc">{upgrade.desc}</p>
              <p className="studio-bonus">{upgrade.perLevel} por nível</p>
              <div className="blessing-foot">
                <span className="blessing-cost">{formatNumber(cost)} inspiração</span>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!affordable}
                  onClick={() => onBuy(upgrade.id)}
                >
                  Comprar nível
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
