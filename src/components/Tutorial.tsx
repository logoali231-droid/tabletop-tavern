import { useEffect, useRef, useState } from 'react';
import { TutorialStep } from '../data/tutorial';

interface Props {
  steps: TutorialStep[];
  step: number;
  /** Shown before the step counter, e.g. "Grimório". */
  label?: string;
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

export default function Tutorial({ steps, step, label, onNext, onPrev, onClose }: Props) {
  const current = steps[step];
  const [box, setBox] = useState<Box | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /* Lets the stylesheet make room for the card while the tour is open. */
  useEffect(() => {
    document.body.classList.add('tutorial-open');
    return () => document.body.classList.remove('tutorial-open');
  }, []);

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
    // On phones the card is a bottom sheet, so the target must clear its height too.
    const cardHeight = cardRef.current?.getBoundingClientRect().height ?? 0;
    const blockedBottom = window.innerWidth <= 640 ? cardHeight + 24 : 80;
    if (rect.top < 80 || rect.bottom > window.innerHeight - blockedBottom) {
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
  const last = step === steps.length - 1;

  return (
    <div className="tutorial" role="dialog" aria-label={label ? `Tutorial do ${label}` : 'Tutorial interativo'}>
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

      <div className={`tutorial-card${box ? '' : ' centered'}`} ref={cardRef}>
        <span className="tutorial-step">
          {label ? `${label} · ` : ''}Passo {step + 1} de {steps.length}
        </span>
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
