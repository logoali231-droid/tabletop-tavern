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
  const [message, setMessage] = useState<string>('');

  const rollD20 = () => {
    if (state.dice < 10 || rolling) return;
    setRolling(true);
    setMessage('');
    onRoll(-10); // Gasta 10 dados imediatamente

    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * 20) + 1);
      count++;
      
      if (count > 15) { // Tempo da animação
        clearInterval(interval);
        const finalRes = Math.floor(Math.random() * 20) + 1;
        setResult(finalRes);
        setRolling(false);
        onRoll(finalRes); // Aplica a recompensa real no estado do jogo
        
        // Mensagens de feedback
        if (finalRes === 20) setMessage("SUCESSO CRÍTICO! Você ganhou 1 Destino e 5 Inspiração!");
        else if (finalRes >= 16) setMessage("Excelente! Você ganhou um Buff de x3 por 20s!");
        else if (finalRes >= 11) setMessage("Bom! Você encontrou 2 Inspiração.");
        else if (finalRes >= 2) setMessage(`Você ganhou ${finalRes * 10} de Ouro.`);
        else setMessage("FALHA CRÍTICA! Você não ganhou nada.");
      }
    }, 50); // Velocidade da roleta
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'var(--panel-bg)', padding: '40px', borderRadius: '15px', border: '4px solid var(--text-highlight)', textAlign: 'center', width: '450px', boxShadow: '0 0 50px rgba(244, 162, 97, 0.2)' }}>
        
        <h1 style={{ color: 'var(--text-highlight)', fontFamily: 'Cinzel, serif', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <img src="/icons/dice.svg" alt="Dice" style={{ width: '40px', height: '40px' }} />
          Mesa de Dados
        </h1>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>Teste sua sorte com o Destino</p>
        
        {/* O D20 Visual */}
        <div style={{ 
          width: '180px', height: '180px', margin: '0 auto 20px', 
          background: 'white', color: 'black', fontSize: '6rem', fontWeight: 'bold', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', 
          borderRadius: '30px', boxShadow: '0 0 30px var(--text-highlight)',
          transition: 'transform 0.1s',
          transform: rolling ? 'scale(0.9) rotate(5deg)' : 'scale(1) rotate(0deg)'
        }}>
          {result ? result : '?'}
        </div>

        {/* Mensagem de Resultado */}
        <div style={{ minHeight: '40px', marginBottom: '20px', fontWeight: 'bold', color: result === 20 ? 'var(--success)' : result === 1 ? 'var(--danger)' : 'var(--text-highlight)' }}>
          {message}
        </div>

        <p style={{ marginBottom: '20px', fontSize: '1.1rem' }}>
          Custa: <span style={{color: 'white', fontWeight: 'bold'}}>10 Dados</span> 
          <span style={{fontSize: '0.9rem', color: '#aaa', display: 'block', marginTop: '5px'}}>
            (Você tem: {formatNumber(state.dice)} 🎲)
          </span>
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button onClick={rollD20} disabled={state.dice < 10 || rolling} style={{ 
            background: 'var(--success)', color: 'white', padding: '15px 30px', borderRadius: '10px', border: 'none', 
            fontSize: '1.2rem', fontWeight: 'bold', cursor: state.dice >= 10 && !rolling ? 'pointer' : 'not-allowed', 
            opacity: state.dice >= 10 ? 1 : 0.5, transform: rolling ? 'translateY(4px)' : 'none', 
            boxShadow: rolling ? 'none' : '0 4px 0 #1e7065'
          }}>
            {rolling ? 'Rolando...' : 'Rolar D20'}
          </button>
          <button onClick={onClose} disabled={rolling} style={{ background: '#333', color: 'white', padding: '15px 30px', borderRadius: '10px', border: 'none', cursor: rolling ? 'not-allowed' : 'pointer', opacity: rolling ? 0.5 : 1 }}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}