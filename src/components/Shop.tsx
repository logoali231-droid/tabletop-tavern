import { GameState, BuildingData, UpgradeData } from '../types';
import { formatNumber } from './ResourceBar';
import { getBuildingCost } from '../data/gameData';

interface Props {
  state: GameState;
  buildings: BuildingData[];
  upgrades: UpgradeData[];
  onBuyBuilding: (id: string, costRes: keyof GameState, cost: number) => void;
  onBuyUpgrade: (id: string, costRes: keyof GameState, cost: number) => void;
}

export default function Shop({ state, buildings, upgrades, onBuyBuilding, onBuyUpgrade }: Props) {
  return (
    <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', maxHeight: '80vh' }}>
      
      <div style={{ background: 'var(--panel-bg)', border: '2px solid var(--border-color)', borderRadius: '10px', padding: '15px' }}>
        <h2 style={{ color: 'var(--text-highlight)', borderBottom: '2px solid var(--border-color)', paddingBottom: '5px', marginBottom: '10px' }}>Construções</h2>
        {buildings.filter(b => b.req(state)).map(b => {
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
      </div>

      <div style={{ background: 'var(--panel-bg)', border: '2px solid var(--border-color)', borderRadius: '10px', padding: '15px' }}>
        <h2 style={{ color: 'var(--text-highlight)', borderBottom: '2px solid var(--border-color)', paddingBottom: '5px', marginBottom: '10px' }}>Melhorias</h2>
        {upgrades.filter(u => u.req(state) && !state.upgradesBought.includes(u.id)).map(u => {
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
        })}
      </div>
    </div>
  );
}