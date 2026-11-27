import { useState } from 'react';
import { GameState } from '../types';
import Modal from './Modal';

interface Props {
  state: GameState;
  saveText: string;
  onToggleSound: () => void;
  onImport: (raw: string) => string | null;
  onReset: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  state,
  saveText,
  onToggleSound,
  onImport,
  onReset,
  onClose,
}: Props) {
  const [importText, setImportText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const copySave = async () => {
    try {
      await navigator.clipboard.writeText(saveText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      setError('');
    } catch {
      setError('Não foi possível copiar. Selecione o texto manualmente.');
    }
  };

  const downloadSave = () => {
    const blob = new Blob([saveText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tabletop-tavern-save.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const doImport = () => {
    const problem = onImport(importText.trim());
    if (problem) setError(problem);
  };

  return (
    <Modal title="Opções" icon="/icons/gear.svg" onClose={onClose}>
      <div className="settings">
        <div className="setting-row">
          <div>
            <div className="setting-name">Sons</div>
            <div className="setting-desc">Efeitos sonoros de cliques, compras e eventos.</div>
          </div>
          <button
            type="button"
            className={`switch${state.soundOn ? ' on' : ''}`}
            onClick={onToggleSound}
            aria-pressed={state.soundOn}
            aria-label="Alternar sons"
          >
            <span className="switch-knob" />
          </button>
        </div>

        <div className="setting-block">
          <h3>Exportar save</h3>
          <p className="setting-desc">
            Copie o texto abaixo ou baixe o arquivo para guardar sua taverna em outro navegador.
          </p>
          <textarea className="save-text" readOnly value={saveText} onFocus={(event) => event.currentTarget.select()} />
          <div className="setting-actions">
            <button type="button" className="btn btn-ghost" onClick={copySave}>
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={downloadSave}>Baixar arquivo</button>
          </div>
        </div>

        <div className="setting-block">
          <h3>Importar save</h3>
          <p className="setting-desc">Cole um save exportado. Isso substitui o progresso atual e recarrega o jogo.</p>
          <textarea
            className="save-text"
            placeholder="Cole o save aqui..."
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
          />
          <div className="setting-actions">
            <button type="button" className="btn btn-primary" onClick={doImport} disabled={!importText.trim()}>
              Importar
            </button>
          </div>
        </div>

        {error ? <p className="setting-error">{error}</p> : null}

        <div className="setting-block danger">
          <h3>Reiniciar tudo</h3>
          <p className="setting-desc">
            Apaga o save, incluindo conquistas, campanhas e bênçãos. Não há como desfazer.
          </p>
          <div className="setting-actions">
            <button type="button" className="btn btn-danger" onClick={onReset}>Apagar progresso</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
