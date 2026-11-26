import { GameState } from '../types';

interface Props {
  state: GameState;
  onClaim: () => void;
  onClose: () => void;
  canClaim: boolean;
}

export default function DailyReward({ state, onClaim, onClose, canClaim }: Props) {
  const rewards = [
    { day: 1, desc: '500 Jogadores' },
    { day: 2, desc: '50 Ouro' },
    { day: 3, desc: '10 Dados' },
    { day: 4, desc: '2 Inspiração' },
    { day: 5, desc: '5.000 Jogadores' },
    { day: 6, desc: '500 Ouro' },
    { day: 7, desc: '1 Destino' },
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'var(--panel-bg)', padding: '30px', borderRadius: '15px', border: '4px solid var(--gold)', textAlign: 'center', width: '600px', maxWidth: '95%' }}>
        
        <h1 style={{ color: 'var(--gold)', fontFamily: 'Cinzel, serif', marginBottom: '10px' }}>Recompensa Diária</h1>
        <p style={{ color: '#aaa', marginBottom: '20px' }}>Volte todos os dias para manter a sequência!</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '30px' }}>
          {rewards.map((r, index) => {
            const dayNum = index + 1;
            const isClaimed = state.dailyStreak >= dayNum;
            const isCurrent = state.dailyStreak + 1 === dayNum && canClaim;
            
            return (
              <div key={r.day} style={{ 
                background: isClaimed ? 'rgba(42, 157, 143, 0.3)' : isCurrent ? 'rgba(244, 162, 97, 0.3)' : '#1a110a', 
                border: isCurrent ? '2px solid var(--text-highlight)' : isClaimed ? '2px solid var(--success)' : '2px solid var(--border-color)', 
                padding: '15px', borderRadius: '8px', opacity: isClaimed || isCurrent ? 1 : 0.5 
              }}>
                <h3 style={{ color: isCurrent ? 'var(--text-highlight)' : 'var(--text-main)' }}>Dia {r.day}</h3>
                <p style={{ fontSize: '0.9rem', marginTop: '5px', color: isClaimed ? 'var(--success)' : '#fff' }}>{r.desc}</p>
                {isClaimed && <span style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '5px', display: 'block' }}>✅ Coletado</span>}
              </div>
            );
          })}
          <div style={{ background: '#1a110a', border: '2px dashed var(--border-color)', padding: '15px', borderRadius: '8px', opacity: 0.5 }}>
            <h3>Bônus</h3>
            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>Ciclo Completo</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {canClaim ? (
            <button onClick={onClaim} style={{ background: 'var(--gold)', color: 'black', padding: '15px 40px', borderRadius: '10px', border: 'none', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
              Coletar Recompensa
            </button>
          ) : (
             <p style={{ color: 'var(--danger)', fontWeight: 'bold', padding: '15px' }}>Volte amanhã para a próxima recompensa!</p>
          )}
          <button onClick={onClose} style={{ background: '#333', color: 'white', padding: '15px 30px', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}