import { useState } from 'react';
import { GameState } from '../types';
import { formatNumber } from './ResourceBar';

interface Props {
  state: GameState;
  onRoll: (result: number) => void;
  onClose: () => void;
}

export default function DiceMinigame({ state, onRoll, onClose }: Props) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const rollD20 = () => {
    if (state.dice < 10 || rolling) return;
    setRolling(true);
    onRoll(-10); // Gasta 10 dados imediatamente

    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * 20) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const finalRes = Math.floor(Math.random() * 20) + 1;
        setResult(finalRes);
        setRolling(false);
        onRoll(finalRes); // Aplica a recompensa real
      }
    }, 100);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'var(--panel-bg)', padding: '40px', borderRadius: '15px', border: '4px solid var(--text-highlight)', textAlign: 'center', width: '400px' }}>
        <h1 style={{ color: 'var(--text-highlight)', fontFamily: 'Cinzel, serif', marginBottom: '20px' }}>Mesa de Dados</h1>
        
        <div style={{ width: '150px', height: '150px', margin: '0 auto 20px', background: 'white', color: 'black', fontSize: '5rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '20px', boxShadow: '0 0 30px var(--text-highlight)' }}>
          {result ? result : '?'}
        </div>

        <p style={{ marginBottom: '20px' }}>Custa: 10 Dados 🎲 (Você tem: {formatNumber(state.dice)})</p>
        <p style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '20px' }}>Role um D20 para ganhar Ouro, Inspiração, Buffs ou até Destino (no 20).</p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={rollD20} disabled={state.dice < 10 || rolling} style={{ background: 'var(--success)', color: 'white', padding: '15px 30px', borderRadius: '10px', border: 'none', fontSize: '1.2rem', cursor: state.dice >= 10 && !rolling ? 'pointer' : 'not-allowed', opacity: state.dice >= 10 ? 1 : 0.5 }}>
            {rolling ? 'Rolando...' : 'Rolar D20'}
          </button>
          <button onClick={onClose} style={{ background: '#333', color: 'white', padding: '15px 30px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Sair</button>
        </div>
      </div>
    </div>
  );
}