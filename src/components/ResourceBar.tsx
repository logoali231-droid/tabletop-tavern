import { GameState, ModalId, ResourceType } from '../types';
import { getEquippedDie, getGardenSlots, getPlotStatus, getProduction, RESOURCES } from '../utils/game';
import { formatNumber, formatRate } from '../utils/format';

interface Props {
  state: GameState;
  onOpen: (modal: ModalId) => void;
  savedAt: number;
}

const ALWAYS_VISIBLE: ResourceType[] = ['players', 'gold'];

export default function ResourceBar({ state, onOpen, savedAt }: Props) {
  const production = getProduction(state);
  const slots = getGardenSlots(state);
  const ready = Array.from({ length: slots }, (_, index) => getPlotStatus(state, index))
    .filter((status) => status?.mature).length;

  return (
    <header className="topbar">
      <div className="resource-list">
        {RESOURCES.map((resource) => {
          const value = state[resource.id];
          const earned = state[`${resource.id}Earned` as keyof GameState] as number;
          const visible = ALWAYS_VISIBLE.includes(resource.id) || earned > 0 || value > 0;
          if (!visible) return null;
          return (
            <div className="resource" key={resource.id} title={`${resource.label}: ${formatNumber(value)}`}>
              <img src={resource.icon} alt="" className="game-icon" />
              <div className="resource-text">
                <span className={`resource-value resource-${resource.id}`}>{formatNumber(value)}</span>
                <span className="resource-rate">
                  +{formatRate(production[resource.id])}/s
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="topbar-actions">
        <span className="autosave" key={savedAt} title="O progresso é salvo automaticamente">
          salvo
        </span>
        <button type="button" className="btn btn-ghost" onClick={() => onOpen('studio')}>
          <img src="/icons/inspiration.svg" alt="" className="game-icon" /> Ideias
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onOpen('garden')}>
          <img src="/icons/scroll.svg" alt="" className="game-icon" /> Grimório
          {ready > 0 ? <span className="btn-badge">{ready}</span> : null}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => onOpen('minigame')}>
          <img src="/icons/dice.svg" alt="" className="game-icon" /> Dados
          <span className="die-tag">{getEquippedDie(state).label}</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onOpen('artifice')}
          title={`Dados de Artífice (${state.artificerDice} disponíveis)`}
          aria-label="Dados de Artífice"
        >
          <img src="/icons/artificer.svg" alt="" className="game-icon" />
          {state.artificerDice > 0 ? (
            <span className="icon-btn-badge artificer">{state.artificerDice}</span>
          ) : null}
        </button>
        <button type="button" className="btn btn-danger" onClick={() => onOpen('prestige')}>
          <img src="/icons/fate.svg" alt="" className="game-icon" /> Prestígio
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onOpen('publish')}
          title={`Publicar a Campanha (${state.legends} Lendas)`}
          aria-label="Publicar a Campanha"
        >
          <img src="/icons/crown.svg" alt="" className="game-icon" />
          {state.legends > 0 ? (
            <span className="icon-btn-badge legends">{formatNumber(state.legends)}</span>
          ) : null}
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onOpen('achievements')}
          title={`Conquistas (${state.achievements.length})`}
          aria-label="Conquistas"
        >
          <img src="/icons/trophy.svg" alt="" className="game-icon" />
          <span className="icon-btn-badge">{state.achievements.length}</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onOpen('stats')}
          title="Estatísticas"
          aria-label="Estatísticas"
        >
          <img src="/icons/stats.svg" alt="" className="game-icon" />
        </button>
        <button
          type="button"
          className="icon-btn help-btn"
          onClick={() => onOpen('help')}
          title="Ajuda e tutorial"
          aria-label="Ajuda e tutorial"
        >
          <span className="help-mark">?</span>
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onOpen('settings')}
          title="Opções"
          aria-label="Opções"
        >
          <img src="/icons/gear.svg" alt="" className="game-icon" />
        </button>
      </div>
    </header>
  );
}
