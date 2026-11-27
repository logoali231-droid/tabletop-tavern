import { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';
import { diceSetData } from '../data/gameData';
import { formatNumber } from '../utils/format';
import {
  getAdvantageCost,
  getCritMin,
  getEquippedDie,
  getRollCost,
  hasBlessing,
} from '../utils/game';
import Modal from './Modal';

interface Props {
  state: GameState;
  onSpin: (withAdvantage: boolean) => { result: number; message: string } | null;
  onEquip: (id: string) => void;
  onClose: () => void;
}

export default function DiceMiniGame({ state, onSpin, onEquip, onClose }: Props) {
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<number[]>([]);
  const timer = useRef<number | null>(null);

  const rollCost = getRollCost(state);
  const advantageCost = getAdvantageCost(state);
  const freeAdvantage = hasBlessing(state, 'advantage');
  const equipped = getEquippedDie(state);
  const critMin = getCritMin(state);

  const outcomes = [
    '1 — Falha crítica: azar absoluto.',
    '2–10 — Ouro proporcional à sua produção.',
    '11–15 — Inspiração proporcional à sua produção.',
    `16–${Math.max(16, critMin - 1)} — Bênção dos Dados: produção x3 por 20s.`,
    `${critMin}–20 — Crítico: +1 Destino, inspiração e produção x5 por 30s.`,
  ];

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const spin = (withAdvantage: boolean) => {
    if (rolling) return;
    // The reward is settled up front, so closing the modal mid-animation cannot eat it.
    const outcome = onSpin(withAdvantage);
    if (!outcome) return;

    setRolling(true);
    setMessage('');

    let ticks = 0;
    timer.current = window.setInterval(() => {
      setFace(Math.floor(Math.random() * 20) + 1);
      ticks += 1;
      if (ticks <= 14) return;

      if (timer.current) window.clearInterval(timer.current);
      setFace(outcome.result);
      setRolling(false);
      setHistory((previous) => [outcome.result, ...previous].slice(0, 6));
      setMessage(outcome.message);
    }, 55);
  };

  const faceClass = face === 20 ? ' nat20' : face === 1 ? ' nat1' : '';

  return (
    <Modal title="Mesa de Dados" icon="/icons/dice.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Teste sua sorte com o Destino. Uma rolagem custa <strong>{rollCost} dados</strong> (o valor
        cresce com os dados que você já ganhou); com vantagem você rola dois d20 e usa o melhor por{' '}
        <strong>{advantageCost} dados</strong>. O dado equipado muda o poder de clique, a faixa de
        crítico e a frequência dos Dados Dourados.
      </p>

      <div className="dice-stage">
        <div className={`dice-face${faceClass}${rolling ? ' rolling' : ''}`}>
          {face ?? '?'}
        </div>
        <div className="dice-message">
          {message || (rolling ? 'Rolando...' : 'Role o D20 e veja o que o Mestre reservou.')}
        </div>
        <div className="dice-stock">
          Você tem <strong>{formatNumber(state.dice)}</strong> dados
          {history.length > 0 ? (
            <span className="dice-history">Últimas: {history.join(' · ')}</span>
          ) : null}
        </div>
        <div className="dice-actions">
          <button
            type="button"
            className="btn btn-primary dice-roll"
            onClick={() => spin(false)}
            disabled={state.dice < rollCost || rolling}
          >
            {rolling ? 'Rolando...' : `Rolar D20 (${rollCost})`}
          </button>
          <button
            type="button"
            className="btn dice-roll"
            onClick={() => spin(true)}
            disabled={state.dice < advantageCost || rolling}
          >
            Vantagem ({freeAdvantage ? rollCost : advantageCost})
          </button>
        </div>
        {freeAdvantage ? (
          <span className="dice-note">Bênção ativa: toda rolagem já sai com vantagem.</span>
        ) : null}
      </div>

      <ul className="dice-outcomes">
        {outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
      </ul>

      <div className="die-equipped">
        <span className="die-shape equipped">{equipped.label}</span>
        <div className="die-equipped-text">
          <span className="prestige-label">Dado equipado</span>
          <strong>{equipped.name}</strong>
          <span className="die-stats">
            Clique x{equipped.clickMult} · Crítico {critMin}–20 · Dourados x{equipped.goldenMult}
          </span>
        </div>
      </div>

      <div className="shop-toolbar">
        <h3 className="prestige-heading">Coleção de Dados</h3>
        <span className="shop-count">{state.diceSet.length}/{diceSetData.length} coletados</span>
      </div>

      <div className="die-grid">
        {diceSetData.map((die) => {
          const collected = state.diceSet.includes(die.id);
          const isEquipped = state.equippedDie === die.id;
          return (
            <button
              key={die.id}
              type="button"
              className={`die-card${isEquipped ? ' equipped' : ''}${collected ? '' : ' locked'}`}
              onClick={() => onEquip(die.id)}
              disabled={!collected || isEquipped}
              title={collected ? die.flavor : die.reqHint}
            >
              <span className={`die-shape${isEquipped ? ' equipped' : ''}`}>{die.label}</span>
              <span className="die-body">
                <span className="die-name">{collected ? die.name : '???'}</span>
                <span className="die-stats">
                  {collected
                    ? `Clique x${die.clickMult} · Crítico ${die.critMin}–20 · Dourados x${die.goldenMult}`
                    : die.reqHint}
                </span>
              </span>
              <span className={`die-action${isEquipped ? ' on' : ''}`}>
                {isEquipped ? 'Equipado' : collected ? 'Equipar' : 'Bloqueado'}
              </span>
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
