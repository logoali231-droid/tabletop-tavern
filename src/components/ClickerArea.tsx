import { MouseEvent } from 'react';
import { GameState, ModalId } from '../types';
import {
  getClickValue,
  getFamiliarProgress,
  getFestival,
  getPantheonBonus,
  getProduction,
} from '../utils/game';
import { formatNumber, formatRate } from '../utils/format';

interface Props {
  state: GameState;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  onOpen: (modal: ModalId) => void;
}

export default function ClickerArea({ state, onClick, onOpen }: Props) {
  const production = getProduction(state);
  const clickValue = getClickValue(state);
  const familiar = getFamiliarProgress(state);
  const festival = getFestival();
  const gods = getPantheonBonus(state).gods.length;
  const monthShort = new Date().toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

  return (
    <section className="panel clicker">
      <h1 className="clicker-title">Tabletop Tavern</h1>
      <div className="clicker-boosts">
        {state.activeBoosts.length > 0 ? (
          state.activeBoosts.map((boost) => (
            <div className="boost-badge" key={boost.id}>
              <span className="boost-name">{boost.name}</span>
              <span className="boost-mult">
                {boost.prodMult > 1 ? `x${boost.prodMult} produção` : null}
                {boost.prodMult > 1 && boost.clickMult > 1 ? ' · ' : null}
                {boost.clickMult > 1 ? `x${boost.clickMult} clique` : null}
              </span>
              <span className="boost-time">{Math.ceil(boost.timeLeft)}s</span>
            </div>
          ))
        ) : (
          <div className="boost-badge boost-idle">Nenhum bônus ativo</div>
        )}
      </div>

      <button type="button" className="tavern-button" onClick={onClick}>
        <img src="/icons/table.svg" alt="" className="tavern-button-icon" />
        <span className="tavern-button-label">Hospedar Sessão</span>
        <span className="tavern-button-sub">+{formatNumber(clickValue)} jogadores</span>
      </button>

      <div className="world-strip">
        <button
          type="button"
          className="world-chip"
          onClick={() => onOpen('familiar')}
          title="Familiar: XP e auras"
        >
          <img src="/icons/lute.svg" alt="" className="game-icon" />
          <span className="world-chip-label">Familiar</span>
          <span className="world-chip-value">Nv {familiar.level}</span>
        </button>
        <button
          type="button"
          className="world-chip"
          onClick={() => onOpen('festival')}
          title={festival.name}
        >
          <img src={festival.icon} alt="" className="game-icon" />
          <span className="world-chip-label">Festival</span>
          <span className="world-chip-value">{monthShort}</span>
        </button>
        <button
          type="button"
          className="world-chip"
          onClick={() => onOpen('pantheon')}
          title="Panteão dos Deuses: dois assentos"
        >
          <img src="/icons/fate.svg" alt="" className="game-icon" />
          <span className="world-chip-label">Panteão</span>
          <span className="world-chip-value">{gods}/2</span>
        </button>
      </div>

      <div className="clicker-meta">
        <div className="meta-item">
          <span className="meta-label">Sessões jogadas</span>
          <span className="meta-value">{formatNumber(state.clicks)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Jogadores por segundo</span>
          <span className="meta-value">+{formatRate(production.players)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Fama das conquistas</span>
          <span className="meta-value">+{(state.achievements.length * 2)}%</span>
        </div>
      </div>
    </section>
  );
}
