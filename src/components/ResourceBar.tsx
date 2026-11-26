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
  onOpenDaily: () => void; // Nova prop
}

export default function ResourceBar({ state, onOpenPrestige, onOpenMinigame, onOpenDaily }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--panel-bg)', padding: '15px', border: '2px solid var(--border-color)', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
      
      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <img src="/icons/players.svg" className="game-icon" alt="Players" /> 
          <span style={{ color: 'var(--text-highlight)' }}>{formatNumber(state.players)}</span>
        </div>
        <div style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <img src="/icons/gold.svg" className="game-icon" alt="Gold" /> 
          <span style={{ color: 'var(--gold)' }}>{formatNumber(state.gold)}</span>
        </div>
        {state.diceEarned > 0 && <div style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <img src="/icons/dice.svg" className="game-icon" alt="Dice" /> 
          <span style={{ color: '#fff' }}>{formatNumber(state.dice)}</span>
        </div>}
        {state.inspirationEarned > 0 && <div style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <img src="/icons/inspiration.svg" className="game-icon" alt="Inspiration" /> 
          <span style={{ color: '#9b5de5' }}>{formatNumber(state.inspiration)}</span>
        </div>}
        {state.campaigns > 0 && <div style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <img src="/icons/fate.svg" className="game-icon" alt="Fate" /> 
          <span style={{ color: 'var(--danger)' }}>{formatNumber(state.fate)}</span>
        </div>}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Botão Diário */}
        <button onClick={onOpenDaily} style={{ background: 'var(--gold)', color: 'black', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
           🎁 Diário
        </button>
        
        <button onClick={onOpenMinigame} style={{ background: 'var(--btn-bg)', color: 'white', border: '1px solid var(--border-color)', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <img src="/icons/dice.svg" className="game-icon" style={{marginRight: '5px'}} /> Jogar Dados
        </button>
        <button onClick={onOpenPrestige} style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <img src="/icons/fate.svg" className="game-icon" style={{marginRight: '5px', filter: 'invert(1)'}} /> Prestígio
        </button>
      </div>

    </div>
  );
}