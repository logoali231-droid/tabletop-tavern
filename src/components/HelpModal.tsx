import { helpSections } from '../data/helpContent';
import Modal from './Modal';

interface Props {
  onStartTutorial: () => void;
  onClose: () => void;
}

export default function HelpModal({ onStartTutorial, onClose }: Props) {
  const jumpTo = (id: string) => {
    document.getElementById(`help-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Modal title="Ajuda" icon="/icons/scroll.svg" size="wide" onClose={onClose}>
      <p className="modal-lead help-lead">
        <span>
          O manual completo: cada sistema do jogo explicado, com os números reais.
          O tour guiado abre cada painel junto com a explicação.
        </span>
        <button type="button" className="btn btn-primary" onClick={onStartTutorial}>
          Rever tutorial
        </button>
      </p>

      <div className="help-toc">
        {helpSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className="help-toc-btn"
            onClick={() => jumpTo(section.id)}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="help-grid">
        {helpSections.map((section) => (
          <section className="help-section" key={section.id} id={`help-${section.id}`}>
            <h3>
              <img src={section.icon} alt="" className="game-icon" />
              {section.title}
            </h3>
            <dl className="help-list">
              {section.items.map((item) => (
                <div className="help-item" key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </Modal>
  );
}
