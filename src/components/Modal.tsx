import { ReactNode, useEffect } from 'react';

interface Props {
  title: string;
  icon?: string;
  size?: 'normal' | 'wide';
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ title, icon, size = 'normal', onClose, children }: Props) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose} role="presentation">
      <div
        className={`modal${size === 'wide' ? ' modal-wide' : ''}`}
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-head">
          <h2>
            {icon ? <img src={icon} alt="" className="game-icon" /> : null}
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">✕</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
