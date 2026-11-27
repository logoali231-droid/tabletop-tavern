import { GameState } from '../types';
import { achievementsData } from '../data/gameData';
import Modal from './Modal';

interface Props {
  state: GameState;
  onClose: () => void;
}

export default function AchievementsModal({ state, onClose }: Props) {
  const unlocked = new Set(state.achievements);
  const fameBonus = state.achievements.length * 2;

  return (
    <Modal title="Conquistas" icon="/icons/trophy.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Cada conquista concede <strong>+2% de produção permanente</strong>. Você tem{' '}
        {state.achievements.length} de {achievementsData.length} conquistas
        ({fameBonus}% de fama).
      </p>

      <div className="ach-grid">
        {achievementsData.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.id);
          return (
            <div key={achievement.id} className={`ach-card${isUnlocked ? ' unlocked' : ''}`}>
              <img src={achievement.icon} alt="" className="ach-icon" />
              <div className="ach-text">
                <div className="ach-name">{achievement.name}</div>
                <div className="ach-desc">{achievement.desc}</div>
              </div>
              <span className="ach-state">{isUnlocked ? '✓' : '•'}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
