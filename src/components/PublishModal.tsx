import { GameState } from '../types';
import {
  CAMPAIGNS_PER_LEGEND,
  LEGEND_FATE_BONUS,
  LEGEND_PROD_BONUS,
  PUBLISH_MIN_CAMPAIGNS,
  getCampaignsUntilNextLegend,
  getCampaignsUntilPublish,
  getLegendFateBonus,
  getLegendGain,
  getLegendProdBonus,
} from '../utils/game';
import { formatNumber } from '../utils/format';
import Modal from './Modal';

interface Props {
  state: GameState;
  onPublish: () => void;
  onClose: () => void;
}

export default function PublishModal({ state, onPublish, onClose }: Props) {
  const gain = getLegendGain(state);
  const canPublish = gain >= 1;
  const missingCampaigns = getCampaignsUntilPublish(state);
  const untilNextLegend = getCampaignsUntilNextLegend(state);
  const prodBonus = Math.round((getLegendProdBonus(state) - 1) * 100);
  const fateBonus = Math.round((getLegendFateBonus(state) - 1) * 100);

  return (
    <Modal title="Publicar a Campanha" icon="/icons/crown.svg" size="wide" onClose={onClose}>
      <p className="modal-lead">
        A segunda camada de prestígio: transforme a saga inteira em uma <strong>Lenda</strong>.
        Cada Lenda nunca é gasta e vale para sempre
        (<strong>+{Math.round(LEGEND_PROD_BONUS * 100)}% produção</strong> e{' '}
        <strong>+{Math.round(LEGEND_FATE_BONUS * 100)}% Destino</strong>).
      </p>

      <div className="prestige-summary">
        <div className="prestige-block">
          <span className="prestige-label">Lendas</span>
          <strong className="prestige-big">{formatNumber(state.legends)}</strong>
          <span className="prestige-note">
            {state.legends > 0
              ? `Bônus atual: +${prodBonus}% produção e +${fateBonus}% Destino.`
              : 'Publique uma saga para conquistar a primeira.'}
          </span>
        </div>
        <div className="prestige-block">
          <span className="prestige-label">Publicações</span>
          <strong className="prestige-big">{formatNumber(state.publications)}</strong>
          <span className="prestige-note">Sagas publicadas até hoje.</span>
        </div>
        <div className="prestige-block">
          <span className="prestige-label">Campanhas nesta saga</span>
          <strong className="prestige-big">{formatNumber(state.campaigns)}</strong>
          <span className="prestige-note">
            {missingCampaigns > 0
              ? `Faltam ${missingCampaigns} ${missingCampaigns === 1 ? 'campanha' : 'campanhas'} para desbloquear a publicação.`
              : `1 Lenda a cada ${CAMPAIGNS_PER_LEGEND} campanhas · faltam ${untilNextLegend} para a próxima.`}
          </span>
        </div>
        <div className="prestige-block prestige-reset">
          <span className="prestige-label">Publicar rende</span>
          <strong className="prestige-big fate">+{formatNumber(gain)} Lendas</strong>
          <button
            type="button"
            className="btn btn-danger"
            disabled={!canPublish}
            onClick={onPublish}
          >
            Publicar Campanha
          </button>
          <span className="prestige-note">
            {canPublish
              ? 'Campanhas, bênçãos, Destino, recursos, construções e melhorias são perdidos.'
              : `Precisa de ${PUBLISH_MIN_CAMPAIGNS} campanhas concluídas nesta saga.`}
          </span>
        </div>
      </div>

      <div className="publish-notes">
        <div className="publish-note keep">
          <strong>Fica para sempre</strong>
          Conquistas, dados e o dado equipado, tramas híbridas, níveis do Estúdio de Ideias e todas as Lendas.
        </div>
        <div className="publish-note lose">
          <strong>Some ao publicar</strong>
          Campanhas, multiplicador de campanha, bênçãos compradas, saldo de Destino, recursos, construções e melhorias.
        </div>
      </div>
    </Modal>
  );
}
