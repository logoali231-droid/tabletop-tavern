import { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';
import { formatNumber } from '../utils/format';
import { getAdvantageCost, getRollCost, hasBlessing } from '../utils/game';
import Modal from './Modal';

interface Props {
  state: GameState;
  onSpin: (withAdvantage: boolean) => { result: number; message: string } | null;
  onClose: () => void;
}

const OUTCOMES = [
  '1 — Falha crítica: azar absoluto.',
  '2–10 — Ouro proporcional à sua produção.',
  '11–15 — Inspiração proporcional à sua produção.',
  '16–19 — Bênção dos Dados: produção x3 por 20s.',
  '20 — Crítico: +1 Destino, inspiração e produção x5 por 30s.',
];

export default function DiceMiniGame({ state, onSpin, onClose }: Props) {
  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<number[]>([]);
  const timer = useRef<number | null>(null);

  const rollCost = getRollCost(state);
  const advantageCost = getAdvantageCost(state);
  const freeAdvantage = hasBlessing(state, 'advantage');

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
    <Modal title="Mesa de Dados" icon="/icons/dice.svg" onClose={onClose}>
      <p className="modal-lead">
        Teste sua sorte com o Destino. Uma rolagem custa <strong>{rollCost} dados</strong> (o valor
        cresce com os dados que você já ganhou); com vantagem você rola dois d20 e usa o melhor por{' '}
        <strong>{advantageCost} dados</strong>.
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
        {OUTCOMES.map((outcome) => <li key={outcome}>{outcome}</li>)}
      </ul>
    </Modal>
  );
}
