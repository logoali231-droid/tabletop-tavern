import { ResourceType } from '../types';
import { formatNumber } from './ResourceBar';

interface Props {
  earnings: Partial<Record<ResourceType, number>>;
  timeAway: number; // em segundos
  onClose: () => void;
}

export default function OfflinePopup({ earnings, timeAway, onClose }: Props) {
  const hours = Math.floor(timeAway / 3600);
  const minutes = Math.floor((timeAway % 3600) / 60);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'var(--panel-bg)', padding: '40px', borderRadius: '15px', border: '4px solid var(--text-highlight)', textAlign: 'center', width: '450px', boxShadow: '0 0 50px rgba(244, 162, 97, 0.2)' }}>
        
        <h1 style={{ color: 'var(--text-highlight)', fontFamily: 'Cinzel, serif', marginBottom: '10px' }}>Bem-vindo de Volta!</h1>
        <p style={{ color: '#aaa', marginBottom: '30px' }}>Sua taverna continuou funcionando por {hours}h e {minutes}m.</p>
        
        <div style={{ background: '#1a110a', padding: '20px', borderRadius: '10px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {Object.entries(earnings).map(([res, amount]) => {
            if (amount <= 0) return null;
            return (
              <div key={res} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`/icons/${res === 'players' ? 'players' : res === 'gold' ? 'gold' : res === 'dice' ? 'dice' : res === 'inspiration' ? 'inspiration' : 'fate'}.svg`} alt={res} style={{ width: '30px', height: '30px', filter: 'invert(0.8)' }} />
                  {res === 'players' ? 'Jogadores' : res === 'gold' ? 'Ouro' : res === 'dice' ? 'Dados' : res === 'inspiration' ? 'Inspiração' : 'Destino'}
                </span>
                <span style={{ color: 'var(--success)' }}>+{formatNumber(amount)}</span>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} style={{ background: 'var(--success)', color: 'white', padding: '15px 40px', borderRadius: '10px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
          Coletar Recompensas
        </button>
      </div>
    </div>
  );
}