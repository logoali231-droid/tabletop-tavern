import { GameState } from '../types';
import { prestigeUpgradesData } from '../data/gameData';
import { getFateGain } from '../utils/game';
import { formatNumber } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onBuyPrestige: (id: string, cost: number) => void;
  onPrestige: () => void;
  onClose: () => void;
}

interface Group {
  name: string;
  blessings: typeof prestigeUpgradesData;
}

export default function PrestigeTree({ state, onBuyPrestige, onPrestige, onClose }: Props) {
  const gain = getFateGain(state);
  const canPrestige = gain >= 1;
  const bought = state.prestigeUpgradesBought.length;

  const groups: Group[] = [];
  for (const blessing of prestigeUpgradesData) {
    let group = groups.find((entry) => entry.name === blessing.group);
    if (!group) {
      group = { name: blessing.group, blessings: [] };
      groups.push(group);
    }
    group.blessings.push(blessing);
  }

  return (
    <Modal title="Árvore de Prestígio" icon="/icons/fate.svg" size="wide" onClose={onClose}>
      <div className="prestige-summary">
        <div className="prestige-block">
          <span className="prestige-label">Campanhas concluídas</span>
          <strong className="prestige-big">{state.campaigns}</strong>
          <span className="prestige-note">
            Multiplicador permanente: x{state.campaignMultiplier.toFixed(1)}
          </span>
        </div>
        <div className="prestige-block">
          <span className="prestige-label">Destino disponível</span>
          <strong className="prestige-big fate">{formatNumber(state.fate)}</strong>
          <span className="prestige-note">Ganhe Destino ao reiniciar a campanha.</span>
        </div>
        <div className="prestige-block">
          <span className="prestige-label">Bênçãos compradas</span>
          <strong className="prestige-big">{bought}/{prestigeUpgradesData.length}</strong>
          <span className="prestige-note">Cada bênção muda uma regra do jogo.</span>
        </div>
        <div className="prestige-block prestige-reset">
          <span className="prestige-label">Próxima campanha rende</span>
          <strong className="prestige-big fate">+{formatNumber(gain)} Destino</strong>
          <button
            type="button"
            className="btn btn-danger"
            disabled={!canPrestige}
            onClick={onPrestige}
          >
            Resetar Campanha
          </button>
          <span className="prestige-note">
            {canPrestige
              ? 'Você perde jogadores, ouro, construções e melhorias. Conquistas, bênçãos, tramas e Destino ficam.'
              : 'Ganhe 10K de jogadores no total para conseguir o primeiro Destino.'}
          </span>
        </div>
      </div>

      {groups.map((group) => (
        <section className="prestige-group" key={group.name}>
          <h3 className="prestige-heading">{group.name}</h3>
          <div className="prestige-grid">
            {group.blessings.map((blessing) => {
              const owned = state.prestigeUpgradesBought.includes(blessing.id);
              const available = blessing.req(state);
              const canBuy = available && !owned && state.fate >= blessing.cost;
              return (
                <div
                  key={blessing.id}
                  className={`blessing${owned ? ' bought' : ''}${available ? '' : ' locked'}`}
                >
                  <div className="blessing-head">
                    <img src={blessing.icon} alt="" className="blessing-icon" />
                    <h4>{blessing.name}</h4>
                  </div>
                  <p className="blessing-desc">{blessing.desc}</p>
                  {!available && blessing.reqHint ? (
                    <p className="blessing-req">{blessing.reqHint}</p>
                  ) : null}
                  <div className="blessing-foot">
                    <span className="blessing-cost">{blessing.cost} Destino</span>
                    {owned ? (
                      <span className="blessing-owned">Comprada</span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={!canBuy}
                        onClick={() => onBuyPrestige(blessing.id, blessing.cost)}
                      >
                        {available ? 'Comprar' : 'Bloqueada'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </Modal>
  );
}
