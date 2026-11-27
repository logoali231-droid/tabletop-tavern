import { useState } from 'react';
import { BuildingData, BuyAmount, GameState, UpgradeData } from '../types';
import { formatNumber, formatRate } from '../utils/format';
import {
  RESOURCES,
  buildingCost,
  bulkCost,
  getBuildingOutput,
  getProdMultiplier,
  maxAffordable,
  sellRefund,
} from '../utils/game';

interface Props {
  state: GameState;
  buildings: BuildingData[];
  upgrades: UpgradeData[];
  buyAmount: BuyAmount;
  onBuyAmountChange: (amount: BuyAmount) => void;
  onBuyBuilding: (id: string, amount: BuyAmount) => void;
  onSellBuilding: (id: string, amount: BuyAmount) => void;
  onBuyUpgrade: (id: string) => void;
  onBuyAllUpgrades: () => void;
}

type Mode = 'buy' | 'sell';

type Hover =
  | { kind: 'building'; id: string; x: number; y: number }
  | { kind: 'upgrade'; id: string; x: number; y: number };

const BUY_AMOUNTS: BuyAmount[] = [1, 10, 100, 'max'];

function resourceLabel(resource: string): string {
  return RESOURCES.find((entry) => entry.id === resource)?.label ?? resource;
}

function outputLabel(state: GameState, building: BuildingData): string {
  const output = getBuildingOutput(state, building);
  const parts = Object.entries(output)
    .filter(([, amount]) => (amount ?? 0) > 0)
    .map(([resource, amount]) => `+${formatRate(amount ?? 0)} ${resourceLabel(resource)}/s`);
  return parts.length > 0 ? parts.join(' · ') : 'sem produção';
}

export default function Shop({
  state,
  buildings,
  upgrades,
  buyAmount,
  onBuyAmountChange,
  onBuyBuilding,
  onSellBuilding,
  onBuyUpgrade,
  onBuyAllUpgrades,
}: Props) {
  const [tab, setTab] = useState<'buildings' | 'upgrades'>('buildings');
  const [mode, setMode] = useState<Mode>('buy');
  const [hover, setHover] = useState<Hover | null>(null);

  const availableUpgrades = upgrades.filter(
    (upgrade) => upgrade.req(state) && !state.upgradesBought.includes(upgrade.id),
  );
  const affordableUpgrades = availableUpgrades.filter(
    (upgrade) => state[upgrade.costRes] >= upgrade.cost,
  );

  const visibleBuildings: { building: BuildingData; locked: boolean }[] = [];
  let showedLocked = false;
  for (const building of buildings) {
    const unlocked = building.req(state);
    if (unlocked) {
      visibleBuildings.push({ building, locked: false });
    } else if (!showedLocked && mode === 'buy') {
      visibleBuildings.push({ building, locked: true });
      showedLocked = true;
    }
  }

  const renderTooltip = () => {
    if (!hover) return null;
    const style = {
      left: Math.min(hover.x + 18, window.innerWidth - 330),
      top: Math.min(hover.y + 16, window.innerHeight - 260),
    };

    if (hover.kind === 'building') {
      const building = buildings.find((entry) => entry.id === hover.id);
      if (!building) return null;
      const owned = state.buildings[building.id] ?? 0;
      const buildingMult = state.buildingMultipliers[building.id] ?? 1;
      const perUnit = Object.entries(building.yield)
        .map(([resource, amount]) =>
          `+${formatRate((amount ?? 0) * buildingMult * getProdMultiplier(state))} ${resourceLabel(resource)}/s`)
        .join(' · ');
      return (
        <div className="tooltip" style={style}>
          <div className="tooltip-title">
            {building.name}
            <span className="tag">{owned}</span>
          </div>
          <p className="tooltip-flavor">{building.flavor}</p>
          <div className="tooltip-line">Cada unidade: {perUnit}</div>
          {owned > 0 ? <div className="tooltip-line">Total atual: {outputLabel(state, building)}</div> : null}
          <div className="tooltip-cost">
            Próxima: {formatNumber(buildingCost(building.baseCost, owned))} {resourceLabel(building.costRes)}
            {owned > 0 ? ` (produção x${buildingMult})` : ''}
          </div>
        </div>
      );
    }

    const upgrade = upgrades.find((entry) => entry.id === hover.id);
    if (!upgrade) return null;
    return (
      <div className="tooltip" style={style}>
        <div className="tooltip-title">{upgrade.name}</div>
        <p className="tooltip-line">{upgrade.desc}</p>
        <div className="tooltip-cost">
          {formatNumber(upgrade.cost)} {resourceLabel(upgrade.costRes)}
        </div>
      </div>
    );
  };

  const sellLabel = buyAmount === 'max' ? 'tudo' : `x${buyAmount}`;

  return (
    <aside className="panel shop">
      <div className="shop-tabs">
        <button
          type="button"
          className={`tab${tab === 'buildings' ? ' active' : ''}`}
          onClick={() => setTab('buildings')}
        >
          Construções
        </button>
        <button
          type="button"
          className={`tab${tab === 'upgrades' ? ' active' : ''}`}
          onClick={() => setTab('upgrades')}
        >
          Melhorias
          {availableUpgrades.length > 0 ? <span className="tab-count">{availableUpgrades.length}</span> : null}
        </button>
      </div>

      {tab === 'buildings' ? (
        <>
          <div className="shop-toolbar">
            <div className="trade-mode">
              <button
                type="button"
                className={`trade-btn${mode === 'buy' ? ' active' : ''}`}
                onClick={() => setMode('buy')}
              >
                Comprar
              </button>
              <button
                type="button"
                className={`trade-btn sell${mode === 'sell' ? ' active' : ''}`}
                onClick={() => setMode('sell')}
              >
                Vender
              </button>
            </div>
            <div className="buy-amounts">
              {BUY_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={`buy-amount${buyAmount === amount ? ' active' : ''}`}
                  onClick={() => onBuyAmountChange(amount)}
                >
                  {amount === 'max' ? 'Max' : `x${amount}`}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-scroll">
            {visibleBuildings.map(({ building, locked }) => {
              const owned = state.buildings[building.id] ?? 0;
              const affordableCount = maxAffordable(building.baseCost, owned, state[building.costRes]);
              const amount = buyAmount === 'max' ? affordableCount : buyAmount;
              const total = amount > 0 ? bulkCost(building.baseCost, owned, amount) : 0;
              const refund = sellRefund(
                building.baseCost,
                owned,
                buyAmount === 'max' ? owned : Math.min(buyAmount, owned),
              );
              const selling = mode === 'sell';
              const sellable = selling && owned > 0;
              const canAct = selling ? sellable : !locked && amount > 0 && state[building.costRes] >= total;

              return (
                <div
                  key={building.id}
                  className={`building-row${locked ? ' locked' : ''}${canAct ? (selling ? ' selling' : ' affordable') : ''}`}
                  onClick={() => {
                    if (!canAct) return;
                    if (selling) onSellBuilding(building.id, buyAmount);
                    else onBuyBuilding(building.id, buyAmount);
                  }}
                  onMouseEnter={(event) =>
                    setHover({ kind: 'building', id: building.id, x: event.clientX, y: event.clientY })}
                  onMouseLeave={() => setHover(null)}
                  role="button"
                  tabIndex={locked || (selling && !sellable) ? -1 : 0}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' || !canAct) return;
                    if (selling) onSellBuilding(building.id, buyAmount);
                    else onBuyBuilding(building.id, buyAmount);
                  }}
                >
                  <img
                    src={locked ? '/icons/scroll.svg' : building.icon}
                    alt=""
                    className={`row-icon${locked ? ' hidden' : ''}`}
                  />
                  <div className="row-main">
                    <div className="row-top">
                      <span className="row-name">{locked ? '???' : building.name}</span>
                      {!locked && owned > 0 ? <span className="row-count">x{owned}</span> : null}
                    </div>
                    <div className="row-desc">{locked ? building.reqHint : building.desc}</div>
                    {!locked && owned > 0 ? (
                      <div className="row-yield">{outputLabel(state, building)}</div>
                    ) : null}
                  </div>
                  {!locked ? (
                    <div className="row-right">
                      {selling ? (
                        <>
                          <span className={`row-cost${sellable ? ' refund' : ''}`}>
                            {sellable ? `+${formatNumber(refund)}` : '—'}
                          </span>
                          <span className="row-res">{resourceLabel(building.costRes)}</span>
                          {sellable && owned > 0 ? (
                            <span className="row-amount">
                              vender {buyAmount === 'max' ? 'tudo' : Math.min(buyAmount, owned)}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <span className={`row-cost${canAct ? ' ok' : ''}`}>
                            {amount > 0 ? formatNumber(total) : '—'}
                          </span>
                          <span className="row-res">{resourceLabel(building.costRes)}</span>
                          {amount > 1 ? <span className="row-amount">x{amount}</span> : null}
                        </>
                      )}
                    </div>
                  ) : (
                    <span className="row-lock">🔒</span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="shop-hint">
            {mode === 'sell'
              ? `Clique numa construção para vender ${sellLabel} e receber metade do valor pago.`
              : 'Clique numa construção para comprar. Passe o mouse para ver os detalhes.'}
          </p>
        </>
      ) : (
        <div className="shop-scroll">
          {availableUpgrades.length === 0 ? (
            <p className="shop-empty">
              Nenhuma melhoria disponível agora. Construa mais e ganhe recursos para desbloquear novas.
            </p>
          ) : (
            <>
              <div className="shop-toolbar">
                <span className="shop-count">{availableUpgrades.length} disponíveis</span>
                <button
                  type="button"
                  className="btn btn-ghost buy-all"
                  onClick={onBuyAllUpgrades}
                  disabled={affordableUpgrades.length === 0}
                >
                  Comprar tudo ({affordableUpgrades.length})
                </button>
              </div>
              <div className="upgrade-list">
                {availableUpgrades.map((upgrade) => {
                  const affordable = state[upgrade.costRes] >= upgrade.cost;
                  return (
                    <button
                      key={upgrade.id}
                      type="button"
                      className={`upgrade-card${affordable ? ' affordable' : ''}`}
                      disabled={!affordable}
                      onClick={() => onBuyUpgrade(upgrade.id)}
                      onMouseEnter={(event) =>
                        setHover({ kind: 'upgrade', id: upgrade.id, x: event.clientX, y: event.clientY })}
                      onMouseLeave={() => setHover(null)}
                    >
                      <img src={upgrade.icon} alt="" />
                      <span className="upgrade-body">
                        <span className="upgrade-name">{upgrade.name}</span>
                        <span className="upgrade-desc">{upgrade.desc}</span>
                      </span>
                      <span className="upgrade-price">
                        {formatNumber(upgrade.cost)}
                        <small>{resourceLabel(upgrade.costRes)}</small>
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {renderTooltip()}
    </aside>
  );
}
