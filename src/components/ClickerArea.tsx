import { useState, useEffect } from 'react';
import { GameState } from '../types';
import { formatNumber } from './ResourceBar';

interface Props {
  state: GameState;
  onClick: (e: React.MouseEvent) => void;
  onBoostClick: () => void;
}

export default function ClickerArea({ state, onClick, onBoostClick }: Props) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      
      {/* Boost Ativo */}
      {state.activeBoost && (
        <div style={{ position: 'absolute', top: '10px', background: 'var(--success)', color: 'white', padding: '10px 20px', borderRadius: '20px', fontWeight: 'bold', animation: 'pulse 1s infinite' }}>
          BOOST {state.activeBoost.multiplier}x ATIVO ({Math.ceil(state.activeBoost.timeLeft)}s)
        </div>
      )}

      <button onClick={onClick} style={{
        width: '250px', height: '250px', borderRadius: '50%', background: 'var(--btn-bg)', border: '4px solid var(--border-color)',
        boxShadow: '0 0 40px rgba(244, 162, 97, 0.2), inset 0 0 20px rgba(0,0,0,0.8)', color: 'var(--text-main)',
        fontFamily: 'Cinzel, serif', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <span>Hospedar</span>
        <span>Sessão</span>
      </button>

      <div style={{ marginTop: '20px', fontSize: '1.1rem', color: '#aaa' }}>Sessões jogadas: {formatNumber(state.clicks)}</div>
      
      {/* Botão de Boost Se Tiver Destino */}
      {state.fate > 0 && (
        <button onClick={onBoostClick} style={{ marginTop: '15px', background: 'var(--danger)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Gaste 1 Destino p/ Boost 2x (30s)
        </button>
      )}
    </div>
  );
}