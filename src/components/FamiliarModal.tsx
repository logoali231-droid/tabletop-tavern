import { GameState } from '../types';
import { familiarAurasData } from '../data/gameData';
import {
  FAMILIAR_MAX_LEVEL,
  FAMILIAR_XP_PER_SECOND,
  getFamiliarAura,
  getFamiliarBonus,
  getFamiliarLevel,
  getFamiliarProgress,
  RESOURCES,
} from '../utils/game';
import { formatNumber } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onPickAura: (id: string) => void;
  onClose: () => void;
}

export default function FamiliarModal({ state, onPickAura, onClose }: Props) {
  const progress = getFamiliarProgress(state);
  const active = getFamiliarAura(state);
  const bonus = getFamiliarBonus(state);
  const level = getFamiliarLevel(progress.xp);

  return (
    <Modal title="Familiar" icon="/icons/lute.svg" size="wide" onClose={onClose}>
      <div className="familiar-hero">
        <img src="/icons/lute.svg" alt="" className="familiar-portrait" />
        <div className="familiar-hero-text">
          <span className="familiar-kicker">Companheiro da Taverna</span>
          <h3>Pip, o Familiar</h3>
          <div className="familiar-bar">
            <span className="familiar-bar-fill" style={{ width: `${progress.percent}%` }} />
          </div>
          <p className="familiar-xp">
            {progress.maxed ? (
              <>Nível {FAMILIAR_MAX_LEVEL} · XP máximo</>
            ) : (
              <>
                Nível {level} · {formatNumber(progress.intoLevel)} / {formatNumber(progress.needed)} XP
              </>
            )}
          </p>
        </div>
      </div>

      <p className="modal-lead">
        Pip ganha XP o tempo todo e empresta <strong>uma aura por vez</strong>. Quanto maior o
        nível, mais forte fica a aura escolhida — e a partir do nível 4 ele aprende novas.
      </p>

      <div className="familiar-stats">
        <div className="garden-stat">
          <span className="prestige-label">XP total</span>
          <strong className="garden-stat-value">{formatNumber(progress.xp)}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Aura ativa</span>
          <strong className="garden-stat-value">{active ? active.name : 'Nenhuma'}</strong>
        </div>
        <div className="garden-stat">
          <span className="prestige-label">Bônus agora</span>
          <strong className="garden-stat-value insp">
            {bonus
              ? `+${Math.round((bonus.mult - 1) * 100)}% ${RESOURCES.find((r) => r.id === bonus.resource)?.label ?? ''}`
              : '—'}
          </strong>
        </div>
      </div>

      <h3 className="section-title">Auras</h3>
      <div className="familiar-auras">
        {familiarAurasData.map((aura) => {
          const unlocked = level >= aura.unlockLevel;
          const selected = state.familiar.aura === aura.id;
          const auraBonus = unlocked
            ? 1 + aura.base + aura.perLevel * Math.max(0, level - aura.unlockLevel)
            : 1 + aura.base;
          const resourceLabel = RESOURCES.find((r) => r.id === aura.resource)?.label ?? '';
          return (
            <div key={aura.id} className={`familiar-aura${selected ? ' active' : ''}${unlocked ? '' : ' locked'}`}>
              <div className="familiar-aura-head">
                <img src={aura.icon} alt="" className="blessing-icon" />
                <div>
                  <h4>{aura.name}</h4>
                  <span className="familiar-aura-level">
                    {unlocked ? `Nível ${aura.unlockLevel}+` : `Desbloqueia no nível ${aura.unlockLevel}`}
                  </span>
                </div>
              </div>
              <p className="blessing-desc">{aura.desc}</p>
              <div className="familiar-aura-foot">
                <span className="familiar-aura-bonus">
                  {resourceLabel} +{Math.round((auraBonus - 1) * 100)}%
                </span>
                <button
                  type="button"
                  className={`btn ${selected ? 'btn-primary' : 'btn-ghost'}`}
                  disabled={!unlocked || selected}
                  onClick={() => onPickAura(aura.id)}
                >
                  {selected ? 'Ativa' : unlocked ? 'Ativar' : 'Bloqueada'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="familiar-sources">
        <span className="familiar-source">Passivo +{FAMILIAR_XP_PER_SECOND}/s</span>
        <span className="familiar-source">Clique +1</span>
        <span className="familiar-source">Colheita +20</span>
        <span className="familiar-source">Mesa ao Vivo +120</span>
        <span className="familiar-source">Prestígio +400</span>
        <span className="familiar-source">Publicação +800</span>
      </div>
    </Modal>
  );
}
