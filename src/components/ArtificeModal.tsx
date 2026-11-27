import { GameState } from '../types';
import { buildingsData } from '../data/gameData';
import {
  ARTIFICER_INTERVAL_SECONDS,
  ARTIFICER_MAX_MASTERY,
  MASTERY_MULTIPLIER,
  getArtificerNextIn,
  getMasteryCost,
  getMasteryLevel,
  getMasteryMultiplier,
  getTotalMasteryLevels,
} from '../utils/game';
import { formatTime } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
  onClose: () => void;
}

export default function ArtificeModal({ state, onBuy, onClose }: Props) {
  const owned = buildingsData
    .filter((building) => (state.buildings[building.id] ?? 0) > 0)
    .sort((a, b) => getMasteryLevel(state, b.id) - getMasteryLevel(state, a.id)
      || b.baseCost - a.baseCost);

  return (
    <Modal title="Dados de Artífice" icon="/icons/artificer.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Um Dado de Artífice chega sozinho a cada <strong>{ARTIFICER_INTERVAL_SECONDS / 3600} horas</strong> de
        jogo. Cada dado compra um nível de maestria numa construção: <strong>cada nível dobra</strong> a
        produção dela e sobrevive a campanhas e publicações.
      </p>

      <div className="artifice-summary">
        <div className="artifice-stat">
          <span>Dados disponíveis</span>
          <strong>{state.artificerDice}</strong>
        </div>
        <div className="artifice-stat">
          <span>Próximo dado em</span>
          <strong>{formatTime(getArtificerNextIn(state))}</strong>
        </div>
        <div className="artifice-stat">
          <span>Níveis de maestria</span>
          <strong>{getTotalMasteryLevels(state)}</strong>
        </div>
      </div>

      {owned.length === 0 ? (
        <p className="shop-empty">
          Você ainda não tem construções. Compre a primeira na loja e volte aqui para investir seus dados.
        </p>
      ) : (
        <div className="artifice-list">
          {owned.map((building) => {
            const level = getMasteryLevel(state, building.id);
            const mastered = level > 0;
            const maxed = level >= ARTIFICER_MAX_MASTERY;
            const cost = getMasteryCost(level);
            const affordable = state.artificerDice >= cost;
            return (
              <div className={`artifice-row${mastered ? ' mastered' : ''}`} key={building.id}>
                <img src={building.icon} alt="" className="game-icon" />
                <div className="artifice-info">
                  <div className="artifice-name">
                    {building.name}
                    <span className="artifice-mult">x{getMasteryMultiplier(state, building.id)}</span>
                  </div>
                  <div className="artifice-pips" aria-label={`Maestria ${level} de ${ARTIFICER_MAX_MASTERY}`}>
                    {Array.from({ length: ARTIFICER_MAX_MASTERY }, (_, index) => (
                      <span key={index} className={`artifice-pip${index < level ? ' on' : ''}`} />
                    ))}
                    <span className="artifice-level">
                      {level}/{ARTIFICER_MAX_MASTERY}
                      {mastered ? ` · +${Math.round((Math.pow(MASTERY_MULTIPLIER, level) - 1) * 100)}%` : ''}
                    </span>
                  </div>
                </div>
                {maxed ? (
                  <span className="artifice-maxed">Maestria máxima</span>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary artifice-buy"
                    disabled={!affordable}
                    onClick={() => onBuy(building.id)}
                  >
                    {cost} {cost === 1 ? 'dado' : 'dados'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="modal-footnote">
        O relógio conta apenas tempo de jogo: sair da aba não adianta o próximo dado. Expulsar goblins também
        pode render um Dado de Artífice.
      </p>
    </Modal>
  );
}
