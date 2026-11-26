import { GameState } from '../types';
import { formatNumber } from './ResourceBar';

interface Props {
  state: GameState;
  onClick: (e: React.MouseEvent) => void;
}

export default function ClickerArea({ state, onClick }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      
      {state.activeBoost && (
        <div style={{ position: 'absolute', top: '10px', background: 'var(--success)', color: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
          {state.activeBoost.name} {state.activeBoost.multiplier}x ({Math.ceil(state.activeBoost.timeLeft)}s)
        </div>
      )}

      <button onClick={onClick} style={{
        width: '280px', height: '280px', borderRadius: '50%', background: 'var(--btn-bg)', border: '4px solid var(--border-color)',
        boxShadow: '0 0 40px rgba(244, 162, 97, 0.2), inset 0 0 20px rgba(0,0,0,0.8)', color: 'var(--text-main)',
        fontFamily: 'Cinzel, serif', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px'
      }}>
        <img src="/icons/table.svg" className="game-icon-large" alt="Mesa" />
        <span>Hospedar Sessão</span>
      </button>

      <div style={{ marginTop: '20px', fontSize: '1.1rem', color: '#aaa' }}>Sessões jogadas: {formatNumber(state.clicks)}</div>
    </div>
  );
}