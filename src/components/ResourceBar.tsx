import { GameState } from '../types';

export function formatNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return Math.floor(num).toString();
}

interface Props {
  state: GameState;
  onOpenPrestige: () => void;
  onOpenMinigame: () => void;
}

export default function ResourceBar({ state, onOpenPrestige, onOpenMinigame }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--panel-bg)', padding: '15px', border: '2px solid var(--border-color)', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>🛡️ <span style={{ color: 'var(--text-highlight)' }}>{formatNumber(state.players)}</span></div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>🪙 <span style={{ color: 'var(--gold)' }}>{formatNumber(state.gold)}</span></div>
        {state.diceEarned > 0 && <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>🎲 <span style={{ color: '#fff' }}>{formatNumber(state.dice)}</span></div>}
        {state.inspirationEarned > 0 && <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>✨ <span style={{ color: '#9b5de5' }}>{formatNumber(state.inspiration)}</span></div>}
        {state.campaigns > 0 && <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>🌌 <span style={{ color: 'var(--danger)' }}>{formatNumber(state.fate)}</span></div>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={onOpenMinigame} style={{ background: 'var(--btn-bg)', color: 'white', border: '1px solid var(--border-color)', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>
          Jogar Dados
        </button>
        <button onClick={onOpenPrestige} style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Prestígio
        </button>
      </div>

    </div>
  );
}