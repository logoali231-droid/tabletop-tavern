import { GameState } from '../types';
import { pantheonData } from '../data/gameData';
import {
  getPantheonBonus,
  getPantheonGod,
  PANTHEON_SLOTS,
  RESOURCES,
} from '../utils/game';
import Modal from './Modal';

interface Props {
  state: GameState;
  onSeat: (godId: string, slot: number) => void;
  onClear: (slot: number) => void;
  onClose: () => void;
}

export default function PantheonModal({ state, onSeat, onClear, onClose }: Props) {
  const bonus = getPantheonBonus(state);
  const seated = Array.from({ length: PANTHEON_SLOTS }, (_, slot) => getPantheonGod(state, slot));
  const gods = pantheonData;

  return (
    <Modal title="Panteão dos Deuses" icon="/icons/fate.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Dois assentos, sete deuses. Todo deus dá um <strong>buff forte</strong> e cobra um{' '}
        <strong>debuff</strong>, então sentar dois é sempre escolher o que sacrificar.
      </p>

      <div className="pantheon-slots">
        {seated.map((god, slot) => (
          <div key={slot} className={`pantheon-slot${god ? ' filled' : ''}`}>
            <span className="pantheon-slot-label">Assento {slot + 1}</span>
            {god ? (
              <>
                <div className="pantheon-slot-god">
                  <img src={god.icon} alt="" className="blessing-icon" />
                  <div>
                    <h4>{god.name}</h4>
                    <span className="pantheon-title">{god.title}</span>
                  </div>
                </div>
                <div className="pantheon-effects">
                  <span className="pantheon-buff">{god.buff}</span>
                  <span className="pantheon-debuff">{god.debuff}</span>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => onClear(slot)}>
                  Esvaziar assento
                </button>
              </>
            ) : (
              <p className="pantheon-empty">Nenhum deus sentado. Escolha um abaixo.</p>
            )}
          </div>
        ))}
      </div>

      <div className="pantheon-summary">
        <span className="pantheon-summary-label">Efeito combinado</span>
        <div className="pantheon-bonus-row">
          {RESOURCES.map((resource) => {
            const mult = bonus.production[resource.id] ?? 1;
            if (mult === 1) return null;
            return (
              <span key={resource.id} className={`festival-bonus${mult < 1 ? ' negative' : ''}`}>
                {resource.label} x{mult.toFixed(2)}
              </span>
            );
          })}
          {bonus.clickMult !== 1 ? (
            <span className={`festival-bonus${bonus.clickMult < 1 ? ' negative' : ''}`}>
              Clique x{bonus.clickMult.toFixed(2)}
            </span>
          ) : null}
          {bonus.gods.length === 0 ? <span className="muted">Nenhum deus sentado.</span> : null}
        </div>
      </div>

      <div className="pantheon-gods">
        {gods.map((god) => {
          const unlocked = god.req(state);
          const activeSlot = seated.findIndex((entry) => entry?.id === god.id);
          return (
            <div key={god.id} className={`pantheon-god${unlocked ? '' : ' locked'}`}>
              <div className="pantheon-god-head">
                <img src={god.icon} alt="" className="blessing-icon" />
                <div>
                  <h4>{god.name}</h4>
                  <span className="pantheon-title">{god.title}</span>
                </div>
              </div>
              <p className="blessing-desc">{god.desc}</p>
              <div className="pantheon-effects">
                <span className="pantheon-buff">{god.buff}</span>
                <span className="pantheon-debuff">{god.debuff}</span>
              </div>
              {unlocked ? (
                <div className="pantheon-god-actions">
                  {seated.map((_, slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`btn ${activeSlot === slot ? 'btn-primary' : 'btn-ghost'}`}
                      disabled={activeSlot === slot}
                      onClick={() => onSeat(god.id, slot)}
                    >
                      {activeSlot === slot ? `No assento ${slot + 1}` : `Assento ${slot + 1}`}
                    </button>
                  ))}
                </div>
              ) : (
                <span className="locked-hint">{god.reqHint}</span>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
