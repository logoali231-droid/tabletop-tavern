import { useState } from 'react';
import { GameState } from '../types';
import { gardenSeedsData } from '../data/gameData';
import {
  GARDEN_SPEEDUP_COST,
  getGardenSlots,
  getPlotStatus,
  getSeedCost,
  hasBlessing,
} from '../utils/game';
import { formatNumber, formatTime } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onPlant: (index: number, seedId: string) => void;
  onHarvest: (index: number) => void;
  onSpeed: (index: number) => void;
  onClose: () => void;
}

const RARITY_LABEL: Record<string, string> = {
  comum: 'Comum',
  incomum: 'Incomum',
  raro: 'Raro',
  lendário: 'Lendário',
};

export default function GardenModal({ state, onPlant, onHarvest, onSpeed, onClose }: Props) {
  const [selectedId, setSelectedId] = useState(gardenSeedsData[0].id);
  const slots = getGardenSlots(state);
  const selected = gardenSeedsData.find((seed) => seed.id === selectedId) ?? gardenSeedsData[0];
  const selectedCost = getSeedCost(state, selected);

  return (
    <Modal title="Grimório de Tramas" icon="/icons/scroll.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Cada página é uma trama esperando para acontecer. Plante com <strong>inspiração</strong>,
        espere crescer e colha recursos, bônus ou Destino. Tramas iguais em páginas vizinhas ganham
        <strong> sinergia</strong>: crescem 40% mais rápido e rendem 50% a mais.
      </p>

      <div className="garden-stats">
        <div className="garden-stat">
          <span className="prestige-label">Inspiração</span>
          <strong className="garden-stat-value insp">{formatNumber(state.inspiration)}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Páginas</span>
          <strong className="garden-stat-value">{slots}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Tramas colhidas</span>
          <strong className="garden-stat-value">{formatNumber(state.plotsHarvested)}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Dados</span>
          <strong className="garden-stat-value">{formatNumber(state.dice)}</strong>
        </div>
      </div>

      <div className="garden-hint">
        Página vazia planta <strong>{selected.name}</strong> por {selectedCost} de inspiração.
        Página em crescimento acelera {formatTime(30)} com {GARDEN_SPEEDUP_COST} dados.
        {hasBlessing(state, 'librarian') ? ' O Bibliotecário Eterno colhe tudo sozinho.' : ''}
      </div>

      <div className="garden-grid">
        {Array.from({ length: slots }, (_, index) => {
          const status = getPlotStatus(state, index);
          if (!status) {
            return (
              <button
                key={index}
                type="button"
                className="plot empty"
                onClick={() => onPlant(index, selected.id)}
                disabled={state.inspiration < selectedCost}
                title={`Plantar ${selected.name}`}
              >
                <span className="plot-plus">+</span>
                <span className="plot-name">{selected.name}</span>
                <span className="plot-label">{selectedCost} inspiração</span>
              </button>
            );
          }

          const { seed, progress, mature, secondsLeft, synergy } = status;
          const shared = `plot ${mature ? 'mature' : 'growing'}${synergy ? ' synergy' : ''}`;

          if (mature) {
            return (
              <button
                key={index}
                type="button"
                className={shared}
                onClick={() => onHarvest(index)}
                title={`Colher ${seed.name}`}
              >
                <img src={seed.icon} alt="" className="plot-icon" />
                <span className="plot-name">{seed.name}</span>
                <span className="plot-ready">Colher</span>
                {synergy ? <span className="plot-chip">sinergia</span> : null}
              </button>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className={shared}
              onClick={() => onSpeed(index)}
              disabled={state.dice < GARDEN_SPEEDUP_COST}
              title={`Acelerar por ${GARDEN_SPEEDUP_COST} dados`}
            >
              <img src={seed.icon} alt="" className="plot-icon" />
              <span className="plot-name">{seed.name}</span>
              <span className="plot-bar">
                <span className="plot-bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
              </span>
              <span className="plot-label">
                {formatTime(secondsLeft)} · {GARDEN_SPEEDUP_COST} dados
              </span>
              {synergy ? <span className="plot-chip">sinergia</span> : null}
            </button>
          );
        })}
      </div>

      <h3 className="prestige-heading">Tramas conhecidas</h3>
      <div className="seed-palette">
        {gardenSeedsData.map((seed) => {
          const unlocked = seed.req(state);
          const cost = getSeedCost(state, seed);
          return (
            <button
              key={seed.id}
              type="button"
              className={`seed-card ${seed.rarity}${selectedId === seed.id ? ' active' : ''}${unlocked ? '' : ' locked'}`}
              onClick={() => setSelectedId(seed.id)}
              disabled={!unlocked}
            >
              <img src={unlocked ? seed.icon : '/icons/scroll.svg'} alt="" className="seed-icon" />
              <span className="seed-body">
                <span className="seed-name">
                  {unlocked ? seed.name : '???'}
                  <span className="seed-rarity">{RARITY_LABEL[seed.rarity]}</span>
                </span>
                <span className="seed-meta">
                  {unlocked ? `${cost} inspiração · ${formatTime(seed.growSeconds)}` : seed.reqHint}
                </span>
                {unlocked ? <span className="seed-desc">{seed.desc}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
