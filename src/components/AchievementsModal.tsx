import { useMemo, useState } from 'react';
import { AchievementCategory, GameState } from '../types';
import { achievementsData } from '../data/gameData';
import { getFameBonus, hasBlessing } from '../utils/game';
import Modal from './Modal';

interface Props {
  state: GameState;
  onClose: () => void;
}

type Tab = 'Tudo' | AchievementCategory;

const TABS: Tab[] = ['Tudo', 'Geral', 'Construções', 'Prestígio', 'Editora', 'Grimório', 'Dados', 'Estúdio'];

/** Accent-insensitive, so "construcoes" still finds "Construções". */
function normalize(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function AchievementsModal({ state, onClose }: Props) {
  const unlocked = useMemo(() => new Set(state.achievements), [state.achievements]);
  const [tab, setTab] = useState<Tab>('Tudo');
  const [query, setQuery] = useState('');
  const [onlyLocked, setOnlyLocked] = useState(false);

  const perAchievement = hasBlessing(state, 'fameBoost') ? 4 : 2;
  const fame = Math.round((getFameBonus(state) - 1) * 100);
  const total = achievementsData.length;
  const percent = total === 0 ? 0 : Math.round((state.achievements.length / total) * 100);

  const counts = useMemo(() => {
    const map = new Map<string, { total: number; unlocked: number }>();
    for (const achievement of achievementsData) {
      const category = achievement.category ?? 'Geral';
      const entry = map.get(category) ?? { total: 0, unlocked: 0 };
      entry.total += 1;
      if (unlocked.has(achievement.id)) entry.unlocked += 1;
      map.set(category, entry);
    }
    return map;
  }, [unlocked]);

  const search = normalize(query.trim());
  const visible = achievementsData
    .filter((achievement) => tab === 'Tudo' || (achievement.category ?? 'Geral') === tab)
    .filter((achievement) => !search
      || normalize(`${achievement.name} ${achievement.desc}`).includes(search))
    .filter((achievement) => !onlyLocked || !unlocked.has(achievement.id))
    .sort((a, b) => Number(unlocked.has(b.id)) - Number(unlocked.has(a.id)));

  return (
    <Modal title="Conquistas" icon="/icons/trophy.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Cada conquista concede <strong>+{perAchievement}% de produção permanente</strong>.
        Você tem {state.achievements.length} de {total} conquistas (+{fame}% de fama).
      </p>

      <div className="ach-progress">
        <span className="ach-progress-track">
          <span className="ach-progress-fill" style={{ width: `${percent}%` }} />
        </span>
        <span className="ach-progress-label">{percent}% completo</span>
      </div>

      <div className="ach-toolbar">
        <input
          className="ach-search"
          type="search"
          placeholder="Buscar conquista..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar conquista"
        />
        <label className="ach-toggle">
          <input
            type="checkbox"
            checked={onlyLocked}
            onChange={(event) => setOnlyLocked(event.target.checked)}
          />
          Só bloqueadas
        </label>
      </div>

      <div className="ach-tabs">
        {TABS.map((entry) => {
          const count = entry === 'Tudo'
            ? { total, unlocked: state.achievements.length }
            : counts.get(entry) ?? { total: 0, unlocked: 0 };
          if (entry !== 'Tudo' && count.total === 0) return null;
          return (
            <button
              key={entry}
              type="button"
              className={`ach-tab${tab === entry ? ' active' : ''}`}
              onClick={() => setTab(entry)}
            >
              {entry}
              <span className="ach-tab-count">{count.unlocked}/{count.total}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <p className="ach-empty">Nenhuma conquista com esse filtro.</p>
      ) : (
        <div className="ach-grid">
          {visible.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.id);
            return (
              <div key={achievement.id} className={`ach-card${isUnlocked ? ' unlocked' : ''}`}>
                <img src={achievement.icon} alt="" className="ach-icon" />
                <div className="ach-text">
                  <div className="ach-name">{achievement.name}</div>
                  <div className="ach-desc">{achievement.desc}</div>
                </div>
                {tab === 'Tudo' ? (
                  <span className="ach-tag">{achievement.category ?? 'Geral'}</span>
                ) : null}
                <span className="ach-state">{isUnlocked ? '✓' : '•'}</span>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
