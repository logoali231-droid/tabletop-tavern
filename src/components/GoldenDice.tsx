import { MouseEvent } from 'react';

interface Props {
  x: number;
  y: number;
  bonus?: boolean;
  onCollect: (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function GoldenDice({ x, y, bonus, onCollect }: Props) {
  return (
    <div className="golden-wrap">
      <button
        type="button"
        className={`golden-dice${bonus ? ' storm' : ''}`}
        style={{ left: `${x}%`, top: `${y}%` }}
        onClick={onCollect}
        aria-label={bonus ? 'Coletar dado da chuva' : 'Coletar Dado Dourado'}
        title={bonus ? 'Dado da Chuva! Clique rápido' : 'Dado Dourado! Clique para coletar'}
      >
        <img src="/icons/golden-d20.svg" alt="" />
        <span className="golden-glow" />
      </button>
    </div>
  );
}
