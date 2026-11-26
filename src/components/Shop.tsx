import { useState } from 'react';
import { GameState, BuildingData, UpgradeData, QuestData } from '../types';
import { formatNumber } from './ResourceBar';
import { getBuildingCost } from '../data/gameData';
import QuestTab from './QuestTab';

interface Props {
  state: GameState;
  buildings: BuildingData[];
  upgrades: UpgradeData[];
  quests: QuestData[];
  onBuyBuilding: (id: string, costRes: keyof GameState, cost: number) => void;
  onBuyUpgrade: (id: string, costRes: keyof GameState, cost: number) => void;
  onClaimQuest: (id: string) => void;
}

export default function Shop({ state, buildings, upgrades, quests, onBuyBuilding, onBuyUpgrade, onClaimQuest }: Props) {
  const [activeTab, setActiveTab] = useState<'buildings' | 'upgrades' | 'quests'>('buildings');

  // Verifica se há alguma missão pronta para coletar (para colocar a bolinha vermelha na aba)
  const hasReadyQuest = quests.some(q => q.req(state) && !state.questsCompleted.includes(q.id));

  const TabButton = ({ id, label }: { id: 'buildings' | 'upgrades' | 'quests', label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1, padding: '10px', background: activeTab === id ? 'var(--panel-bg)' : 'transparent',
        border: 'none', borderBottom: activeTab === id ? '2px solid var(--text-highlight)' : '2px solid transparent',
        color: activeTab === id ? 'var(--text-highlight)' : '#888', fontWeight: 'bold', fontSize: '1rem',
        cursor: 'pointer', position: 'relative', transition: 'all 0.2s'
      }}
    >
      {label}
      {id === 'quests' && hasReadyQuest && (
        <span style={{ position: 'absolute', top: '8px', right: '15px', width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%', boxShadow: '0 0 5px var(--danger)' }} />
      )}
    </button>
  );

  return (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', background: 'var(--panel-bg)', border: '2px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
      
      {/* Cabeçalho das Abas */}
      <div style={{ display: 'flex', background: '#1a110a', borderBottom: '2px solid var(--border-color)' }}>
        <TabButton id="buildings" label="Construções" />
        <TabButton id="upgrades" label="Melhorias" />
        <TabButton id="quests" label="Missões" />
      </div>

      {/* Conteúdo da Aba */}
      <div style={{ padding: '15px', overflowY: 'auto', flex: 1, maxHeight: 'calc(80vh - 50px)' }}>
        
        {activeTab === 'buildings' && buildings.filter(b => b.req(state)).map(b => {
          const count = state.buildings[b.id] || 0;
          const cost = getBuildingCost(b.baseCost, count);
          const canAfford = (state[b.costRes] as number) >= cost;
          
          return (
            <button key={b.id} disabled={!canAfford} onClick={() => onBuyBuilding(b.id, b.costRes, cost)}
              style={{ width: '100%', background: 'var(--btn-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px', marginBottom: '8px', borderRadius: '5px', cursor: canAfford ? 'pointer' : 'not-allowed', opacity: canAfford ? 1 : 0.5, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={b.icon} className="game-icon" style={{ width: '32px', height: '32px', margin: 0 }} alt={b.name} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>{b.name} ({count})</div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{b.desc}</div>
                </div>
              </div>
              <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{formatNumber(cost)} {b.costRes === 'players' ? 'P' : b.costRes === 'gold' ? 'G' : 'D'}</div>
            </button>
          );
        })}

        {activeTab === 'upgrades' && (
          upgrades.filter(u => u.req(state) && !state.upgradesBought.includes(u.id)).length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Nenhuma melhoria disponível no momento.</p>
          ) : (
            upgrades.filter(u => u.req(state) && !state.upgradesBought.includes(u.id)).map(u => {
              const canAfford = (state[u.costRes] as number) >= u.cost;
              return (
                <button key={u.id} disabled={!canAfford} onClick={() => onBuyUpgrade(u.id, u.costRes, u.cost)}
                  style={{ width: '100%', background: 'var(--btn-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '10px', marginBottom: '8px', borderRadius: '5px', cursor: canAfford ? 'pointer' : 'not-allowed', opacity: canAfford ? 1 : 0.5, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={u.icon} className="game-icon" style={{ width: '32px', height: '32px', margin: 0 }} alt={u.name} />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{u.desc}</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{formatNumber(u.cost)} {u.costRes === 'players' ? 'P' : u.costRes === 'inspiration' ? 'I' : 'G'}</div>
                </button>
              );
            })
          )
        )}

        {activeTab === 'quests' && (
          <QuestTab state={state} quests={quests} onClaimQuest={onClaimQuest} />
        )}

      </div>
    </div>
  );
}