import { GameState } from '../types';
import { buildingsData } from '../data/gameData';
import {
  RESOURCES,
  getClickValue,
  getCampaignBonus,
  getFameBonus,
  getProdMultiplier,
  getProduction,
  getTotalMasteryLevels,
} from '../utils/game';
import { formatNumber, formatRate, formatTime } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export default function StatsModal({ state, onClose }: Props) {
  const production = getProduction(state);
  const ownedBuildings = buildingsData.filter((building) => (state.buildings[building.id] ?? 0) > 0);

  return (
    <Modal title="Estatísticas" icon="/icons/stats.svg" size="wide" onClose={onClose}>
      <div className="stat-columns">
        <section className="stat-section">
          <h3>Taverna</h3>
          <Row label="Sessões hospedadas" value={formatNumber(state.clicks)} />
          <Row label="Tempo de jogo" value={formatTime(state.playTime)} />
          <Row label="Campanhas concluídas" value={formatNumber(state.campaigns)} />
          <Row label="Conquistas" value={formatNumber(state.achievements.length)} />
          <Row label="Dados Dourados coletados" value={formatNumber(state.goldenDiceCollected)} />
          <Row label="Rolagens de D20" value={formatNumber(state.diceRolls)} />
          <Row label="Tramas colhidas" value={formatNumber(state.plotsHarvested)} />
          <Row label="Bênçãos compradas" value={formatNumber(state.prestigeUpgradesBought.length)} />
          <Row label="Sagas publicadas" value={formatNumber(state.publicationsEarned)} />
          <Row label="Pontos da Editora" value={formatNumber(state.publications)} />
          <Row label="Nós da Editora" value={formatNumber(state.editorialUpgrades.length)} />
          <Row label="Lendas" value={formatNumber(state.legends)} />
          <Row label="Dados de Artífice" value={formatNumber(state.artificerDice)} />
          <Row label="Níveis de maestria" value={formatNumber(getTotalMasteryLevels(state))} />
          <Row label="Goblins expulsos" value={formatNumber(state.pestsExpelled)} />
        </section>

        <section className="stat-section">
          <h3>Produção por segundo</h3>
          {RESOURCES.map((resource) => (
            <Row
              key={resource.id}
              label={resource.label}
              value={`+${formatRate(production[resource.id])}`}
            />
          ))}
          <Row label="Poder de clique" value={`+${formatNumber(getClickValue(state))}`} />
        </section>

        <section className="stat-section">
          <h3>Multiplicadores</h3>
          <Row label="Global" value={`x${state.globalMultiplier.toFixed(2)}`} />
          <Row label="Campanhas" value={`x${getCampaignBonus(state).toFixed(2)}`} />
          <Row label="Fama (conquistas)" value={`x${getFameBonus(state).toFixed(2)}`} />
          <Row
            label="Bônus ativos"
            value={state.activeBoosts.length > 0
              ? state.activeBoosts
                .map((boost) => `${boost.name} (${Math.ceil(boost.timeLeft)}s)`)
                .join(' · ')
              : '—'}
          />
          <Row label="Total de produção" value={`x${getProdMultiplier(state).toFixed(2)}`} />
        </section>

        <section className="stat-section">
          <h3>Totais acumulados</h3>
          {RESOURCES.map((resource) => {
            const earned = state[`${resource.id}Earned` as keyof GameState] as number;
            return <Row key={resource.id} label={resource.label} value={formatNumber(earned)} />;
          })}
        </section>
      </div>

      <section className="stat-section stat-buildings">
        <h3>Construções ({ownedBuildings.length})</h3>
        {ownedBuildings.length === 0 ? (
          <p className="shop-empty">Você ainda não construiu nada. Clique na mesa para começar.</p>
        ) : (
          <div className="stat-building-grid">
            {ownedBuildings.map((building) => (
              <div className="stat-building" key={building.id}>
                <img src={building.icon} alt="" className="game-icon" />
                <span className="stat-building-name">{building.name}</span>
                <span className="stat-building-count">x{state.buildings[building.id]}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </Modal>
  );
}
