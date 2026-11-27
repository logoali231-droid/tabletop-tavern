import { useEffect, useState } from 'react';
import { tutorialSteps } from '../data/tutorial';

interface Props {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function Tutorial({ step, onNext, onPrev, onClose }: Props) {
  const current = tutorialSteps[step];
  const [box, setBox] = useState<Box | null>(null);

  /* Measures the highlighted element twice a second, so panels that open late still line up. */
  useEffect(() => {
    if (!current) return;
    const measure = () => {
      if (!current.target) {
        setBox(null);
        return;
      }
      const element = document.querySelector(current.target);
      if (!element) {
        setBox(null);
        return;
      }
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        setBox(null);
        return;
      }
      setBox({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };

    measure();
    const late = window.setTimeout(measure, 140);
    const interval = window.setInterval(measure, 300);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.clearTimeout(late);
      window.clearInterval(interval);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [current, step]);

  useEffect(() => {
    if (!current?.target) return;
    const element = document.querySelector(current.target);
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < 80 || rect.bottom > window.innerHeight - 80) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [current, step]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' && !event.metaKey && !event.ctrlKey) onNext();
      if (event.key === 'ArrowLeft' && !event.metaKey && !event.ctrlKey) onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  if (!current) return null;
  const last = step === tutorialSteps.length - 1;

  return (
    <div className="tutorial" role="dialog" aria-label="Tutorial interativo">
      {box ? (
        <div
          className="tutorial-spot"
          style={{
            top: box.top - 8,
            left: box.left - 8,
            width: box.width + 16,
            height: box.height + 16,
          }}
        />
      ) : (
        <div className="tutorial-veil" />
      )}

      <div className={`tutorial-card${box ? '' : ' centered'}`}>
        <span className="tutorial-step">Passo {step + 1} de {tutorialSteps.length}</span>
        <h3>{current.title}</h3>
        <p>{current.text}</p>
        <div className="tutorial-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Pular
          </button>
          <div className="tutorial-nav">
            <button type="button" className="btn btn-ghost" onClick={onPrev} disabled={step === 0}>
              Voltar
            </button>
            <button type="button" className="btn btn-primary" onClick={onNext}>
              {last ? 'Concluir' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
