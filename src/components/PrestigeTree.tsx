import { GameState } from '../types';
import { prestigeUpgradesData } from '../data/gameData';
import { formatNumber } from './ResourceBar';

interface Props {
  state: GameState;
  onBuyPrestige: (id: string, cost: number) => void;
  onPrestige: () => void;
  onClose: () => void;
}

export default function PrestigeTree({ state, onBuyPrestige, onPrestige, onClose }: Props) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'var(--panel-bg)', padding: '30px', borderRadius: '15px', border: '4px solid var(--danger)', width: '800px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>
          <h1 style={{ color: 'var(--danger)', fontFamily: 'Cinzel, serif' }}>Árvore de Prestígio (Campanhas)</h1>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#1a110a', padding: '15px', borderRadius: '10px' }}>
          <div>
            <h3>Campanhas Concluídas: {state.campaigns}</h3>
            <p style={{ color: '#aaa' }}>Multiplicador Atual: {state.campaignMultiplier.toFixed(1)}x</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: 'var(--danger)' }}>🌌 Destino: {formatNumber(state.fate)}</h3>
            <button onClick={onPrestige} disabled={state.playersEarned < 10000} style={{ background: 'var(--danger)', color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', marginTop: '10px', cursor: state.playersEarned >= 10000 ? 'pointer' : 'not-allowed', opacity: state.playersEarned >= 10000 ? 1 : 0.5 }}>
              Resetar e Iniciar Nova Campanha
            </button>
          </div>
        </div>

        <h2 style={{ color: 'var(--text-highlight)', marginBottom: '15px' }}>Bênçãos Divinas (Melhorias Permanentes)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {prestigeUpgradesData.map(pu => {
            const isBought = state.prestigeUpgradesBought.includes(pu.id);
            const canBuy = state.fate >= pu.cost && !isBought && pu.req(state);
            
            return (
              <div key={pu.id} style={{ background: isBought ? '#2a9d8f' : 'var(--btn-bg)', border: '2px solid var(--border-color)', padding: '15px', borderRadius: '8px', opacity: canBuy || isBought ? 1 : 0.5 }}>
                <h3 style={{ color: isBought ? 'white' : 'var(--text-highlight)' }}>{pu.name}</h3>
                <p style={{ fontSize: '0.9rem', margin: '5px 0' }}>{pu.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Custo: {pu.cost} Destino</span>
                  {isBought ? <span>✅ Comprado</span> : 
                    <button disabled={!canBuy} onClick={() => onBuyPrestige(pu.id, pu.cost)} style={{ background: 'var(--text-highlight)', color: 'black', padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: canBuy ? 'pointer' : 'not-allowed' }}>Comprar</button>
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}