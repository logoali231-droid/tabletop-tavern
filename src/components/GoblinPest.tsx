import { Pest } from '../types';
import { PEST_CLICKS, PEST_PLAYERS_PENALTY } from '../utils/game';

interface Props {
  pest: Pest;
  onHit: () => void;
  /** Lifts the goblin above the boss card on narrow screens. */
  raised?: boolean;
}

/** A goblin stuck to the screen, sucking players until it is clicked away. */
export default function GoblinPest({ pest, onHit, raised = false }: Props) {
  const clicks = Math.min(pest.clicks, PEST_CLICKS);

  return (
    <div className={`pest-wrap${raised ? ' raised' : ''}`}>
      <button
        type="button"
        className="pest-goblin"
        onClick={onHit}
        title={`Goblin: ${Math.round(PEST_PLAYERS_PENALTY * 100)}% dos jogadores por segundo. Clique ${PEST_CLICKS} vezes para expulsar.`}
        aria-label="Goblin na taverna, clique para expulsar"
      >
        <img src="/icons/goblin.svg" alt="" />
        <span className="pest-pips">
          {Array.from({ length: PEST_CLICKS }, (_, index) => (
            <span key={index} className={`pest-pip${index < clicks ? ' on' : ''}`} />
          ))}
        </span>
        <span className="pest-label">-{Math.round(PEST_PLAYERS_PENALTY * 100)}% jogadores</span>
      </button>
    </div>
  );
}
