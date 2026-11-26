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
      <div style={{ background: 'var(--panel-bg)', padding: '30px', borderRadius: '15px', border: '4px solid var(--danger)', width: '850px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
          <h1 style={{ color: 'var(--danger)', fontFamily: 'Cinzel, serif', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/icons/fate.svg" alt="Fate" style={{ width: '40px', height: '40px', filter: 'invert(1)' }} />
            Árvore de Prestígio
          </h1>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>✖</button>
        </div>

        {/* Status Atual e Botão de Reset */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', background: '#1a110a', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '5px' }}>Campanhas Concluídas: <span style={{ color: 'var(--text-highlight)' }}>{state.campaigns}</span></h3>
            <p style={{ color: '#aaa' }}>Multiplicador Global Permanente: <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{state.campaignMultiplier.toFixed(1)}x</span></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '10px' }}>
              <img src="/icons/fate.svg" alt="Fate" style={{ width: '24px', height: '24px', filter: 'invert(1)' }} />
              {formatNumber(state.fate)} Destino
            </h3>
            <button onClick={onPrestige} disabled={state.playersEarned < 10000} style={{ background: 'var(--danger)', color: 'white', padding: '12px 20px', borderRadius: '5px', border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: state.playersEarned >= 10000 ? 'pointer' : 'not-allowed', opacity: state.playersEarned >= 10000 ? 1 : 0.5, boxShadow: state.playersEarned >= 10000 ? '0 0 15px var(--danger)' : 'none' }}>
              Resetar Campanha
            </button>
            {state.playersEarned < 10000 && <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '5px' }}>Requer 10K de Jogadores ganhos na vida.</p>}
          </div>
        </div>

        {/* Lista de Bênçãos */}
        <h2 style={{ color: 'var(--text-highlight)', marginBottom: '15px' }}>Bênçãos Divinas (Melhorias Permanentes)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {prestigeUpgradesData.map(pu => {
            const isBought = state.prestigeUpgradesBought.includes(pu.id);
            const canBuy = state.fate >= pu.cost && !isBought && pu.req(state);
            
            return (
              <div key={pu.id} style={{ background: isBought ? 'rgba(42, 157, 143, 0.2)' : 'var(--btn-bg)', border: isBought ? '2px solid var(--success)' : '2px solid var(--border-color)', padding: '15px', borderRadius: '8px', opacity: canBuy || isBought ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <img src={pu.icon} alt={pu.name} style={{ width: '40px', height: '40px', filter: isBought ? 'invert(1) sepia(1) saturate(5) hue-rotate(90deg)' : 'invert(0.8) sepia(0.5) saturate(2) hue-rotate(-10deg)' }} />
                  <h3 style={{ color: isBought ? 'var(--success)' : 'var(--text-highlight)' }}>{pu.name}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', margin: '5px 0', minHeight: '40px' }}>{pu.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Custo: {pu.cost} Destino</span>
                  {isBought ? (
                    <span style={{ color: 'var(--success)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>✅ Comprado</span> 
                  ) : (
                    <button disabled={!canBuy} onClick={() => onBuyPrestige(pu.id, pu.cost)} style={{ background: 'var(--text-highlight)', color: 'black', padding: '8px 15px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: canBuy ? 'pointer' : 'not-allowed' }}>
                      Comprar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}