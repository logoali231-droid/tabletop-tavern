import { GameState, QuestData } from '../types';

interface Props {
  state: GameState;
  quests: QuestData[];
  onClaimQuest: (id: string) => void;
}

export default function QuestTab({ state, quests, onClaimQuest }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {quests.map(quest => {
        const isCompleted = state.questsCompleted.includes(quest.id);
        const isReady = quest.req(state) && !isCompleted;

        return (
          <div key={quest.id} style={{ 
            background: isCompleted ? 'rgba(42, 157, 143, 0.1)' : isReady ? 'rgba(244, 162, 97, 0.15)' : 'var(--btn-bg)', 
            border: isCompleted ? '1px solid var(--success)' : isReady ? '1px solid var(--text-highlight)' : '1px solid var(--border-color)', 
            padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
          }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <img src="/icons/scroll.svg" alt="Quest" style={{ width: '32px', height: '32px', filter: isCompleted ? 'invert(1) sepia(1) saturate(5) hue-rotate(90deg)' : 'invert(0.8) sepia(0.5) saturate(2) hue-rotate(-10deg)' }} />
              <div>
                <h3 style={{ color: isCompleted ? 'var(--success)' : 'var(--text-main)', fontSize: '1.1rem', marginBottom: '4px' }}>{quest.name}</h3>
                <p style={{ fontSize: '0.9rem', color: '#aaa' }}>{quest.desc}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--gold)', marginTop: '4px', fontWeight: 'bold' }}>Recompensa: {quest.rewardDesc}</p>
              </div>
            </div>
            
            <div>
              {isCompleted ? (
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✅ Concluído</span>
              ) : isReady ? (
                <button onClick={() => onClaimQuest(quest.id)} style={{ background: 'var(--text-highlight)', color: 'black', padding: '8px 15px', borderRadius: '5px', border: 'none', fontWeight: 'bold', cursor: 'pointer', animation: 'pulse 2s infinite' }}>
                  Coletar
                </button>
              ) : (
                <span style={{ color: '#666', fontWeight: 'bold' }}>🔒 Bloqueado</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}