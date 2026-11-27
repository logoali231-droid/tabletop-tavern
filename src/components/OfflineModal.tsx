import { OfflineReport, RESOURCES } from '../utils/game';
import { formatNumber, formatTime } from '../utils/format';
import Modal from './Modal';

interface Props {
  report: OfflineReport;
  onClose: () => void;
}

export default function OfflineModal({ report, onClose }: Props) {
  const entries = RESOURCES.filter((resource) => (report.gains[resource.id] ?? 0) > 0);

  return (
    <Modal title="Enquanto você estava fora" icon="/icons/tavern.svg" onClose={onClose}>
      <p className="modal-lead">
        Sua taverna continuou funcionando por <strong>{formatTime(report.seconds)}</strong>.
      </p>
      <div className="offline-gains">
        {entries.map((resource) => (
          <div className="offline-row" key={resource.id}>
            <img src={resource.icon} alt="" className="game-icon" />
            <span>{resource.label}</span>
            <strong>+{formatNumber(report.gains[resource.id])}</strong>
          </div>
        ))}
      </div>
      <p className="setting-desc">
        A produção offline rende 50% do normal e é limitada a 8 horas. A bênção
        {' '}<strong>Mestre Ausente</strong> aumenta isso para 100% por até 24 horas.
      </p>
      <div className="setting-actions">
        <button type="button" className="btn btn-primary" onClick={onClose}>Continuar</button>
      </div>
    </Modal>
  );
}
