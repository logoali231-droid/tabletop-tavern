import { GameState } from '../types';
import { editorialData } from '../data/gameData';
import { PUBLICATIONS_PER_PUBLISH, hasEditorialUpgrade } from '../utils/game';
import Modal from './Modal';

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
  onClose: () => void;
}

const BRANCHES = ['Economia', 'Destino', 'Início'] as const;

const BRANCH_NOTES: Record<string, string> = {
  Economia: 'Produção e recursos de todo dia.',
  Destino: 'A camada que atravessa resets.',
  Início: 'Como cada nova campanha começa.',
};

export default function EditoraModal({ state, onBuy, onClose }: Props) {
  const owned = state.editorialUpgrades.length;

  return (
    <Modal title="Árvore da Editora" icon="/icons/scroll.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        Cada saga publicada vale <strong>{PUBLICATIONS_PER_PUBLISH} pontos</strong> para gastar aqui.
        Os {editorialData.length} nós são permanentes: publicar de novo nunca os remove, e as
        conquistas de publicação contam sagas publicadas, não pontos gastos.
      </p>

      <div className="editora-summary">
        <div className="editora-stat">
          <span>Pontos disponíveis</span>
          <strong>{state.publications}</strong>
        </div>
        <div className="editora-stat">
          <span>Sagas publicadas</span>
          <strong>{state.publicationsEarned}</strong>
        </div>
        <div className="editora-stat">
          <span>Nós comprados</span>
          <strong>{owned}/{editorialData.length}</strong>
        </div>
      </div>

      <div className="editora-grid">
        {BRANCHES.map((branch) => (
          <section className="editora-branch" key={branch}>
            <h3>{branch}</h3>
            <p className="editora-branch-note">{BRANCH_NOTES[branch]}</p>
            {editorialData.filter((node) => node.branch === branch).map((node) => {
              const bought = hasEditorialUpgrade(state, node.id);
              const affordable = state.publications >= node.cost;
              return (
                <div className={`editora-node${bought ? ' bought' : ''}`} key={node.id}>
                  <div className="editora-node-head">
                    <img src={node.icon} alt="" className="game-icon" />
                    <strong>{node.name}</strong>
                    <span className="editora-cost">{bought ? '✓' : `${node.cost} pt`}</span>
                  </div>
                  <p>{node.desc}</p>
                  {bought ? (
                    <span className="editora-owned">Comprado</span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary editora-buy"
                      disabled={!affordable}
                      onClick={() => onBuy(node.id)}
                    >
                      Comprar por {node.cost} {node.cost === 1 ? 'ponto' : 'pontos'}
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </div>

      <p className="modal-footnote">
        Faltam pontos? Publique outra saga: cada publicação rende mais {PUBLICATIONS_PER_PUBLISH} pontos,
        além das Lendas. A Pré-venda e o Adiantamento valem a partir da próxima campanha.
      </p>
    </Modal>
  );
}
