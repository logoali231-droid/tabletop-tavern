import { ModalId } from '../types';

export interface TutorialStep {
  title: string;
  text: string;
  /** CSS selector highlighted by the tour; omit for a centered card. */
  target?: string;
  /** Panel opened while this step is showing, if any. */
  modal?: ModalId;
}

/** localStorage flag: the tour auto-opens only until it is finished or skipped. */
export const TUTORIAL_KEY = 'tabletop-tavern-tutorial-v1';

/** Separate flag for the Grimório tour, so the two never share progress. */
export const GARDEN_TUTORIAL_KEY = 'tabletop-tavern-garden-tutorial-v1';

export const tutorialSteps: TutorialStep[] = [
  {
    title: 'Bem-vindo à Tabletop Tavern',
    text: 'Você é o mestre da taverna: cada sessão hospedada atrai jogadores, e jogadores compram construções que produzem sozinhos. Este tour passa por todos os sistemas em cerca de dois minutos.',
  },
  {
    title: 'Hospede sessões',
    target: '.tavern-button',
    text: 'Clique na mesa para ganhar jogadores. O valor por clique cresce com fama, campanhas, bônus ativos e dados equipados.',
  },
  {
    title: 'Cinco recursos',
    target: '.resource-list',
    text: 'Jogadores, ouro, dados, inspiração e Destino. Cada um alimenta um sistema: construções, melhorias, minijogo de dados, Grimório/Estúdio e prestígio.',
  },
  {
    title: 'Construções',
    target: '.shop',
    text: 'São 45 construções, cada uma com custo e produção próprios. O preço de cada unidade sobe 15%, e a última da lista é sempre "Você", a construção final do jogo.',
  },
  {
    title: 'Comprar, vender e lotes',
    target: '.shop-toolbar',
    text: 'Escolha x1, x10, x100 ou Max e alterne entre Comprar e Vender. Vender devolve metade do valor já pago na construção.',
  },
  {
    title: 'Melhorias',
    target: '.shop-tabs',
    text: 'A aba Melhorias traz compras únicas que multiplicam construções ou cliques. O botão "Comprar tudo" leva todas as que você já consegue pagar.',
  },
  {
    title: 'Sinergias de construções',
    target: '.synergy-strip',
    text: 'Conjuntos temáticos dão bônus global: Mesa Posta pede Taverna, Bardo e Lanchonete. Chips dourados estão ativos; os apagados mostram no tooltip o que falta para completar.',
  },
  {
    title: 'Dados Dourados',
    text: 'De tempos em tempos um D20 dourado aparece na tela por 14 segundos. Clique nele para ganhar Frenesi x7, cliques x777, chuva de dados, cópias grátis de construção ou o Jackpot do Dragão.',
  },
  {
    title: 'Mesas ao Vivo',
    text: 'De 4 em 4 minutos um chefe aparece por 45 segundos: cada Atacar causa dano com combo crescente e a vitória paga 3 minutos de produção, +2 Destino e produção x3 por 30s.',
  },
  {
    title: 'Goblins na Taverna',
    text: 'De tempos em tempos um goblin se gruda na tela e suga 10% da produção de jogadores. Clique nele 5 vezes: o baú paga ouro e dados conforme o tempo que ele ficou ali, e às vezes traz um Dado de Artífice.',
  },
  {
    title: 'Dados e o D20',
    modal: 'minigame',
    target: '.modal',
    text: 'Role o D20 com dados: 16+ dá produção x3, 20 é crítico (x5 e +1 Destino), 11–15 dá inspiração e 2–10 dá ouro. Aqui também se equipam os 6 conjuntos de dados, cada um com um trade-off entre clique, crítico e sorte dourada.',
  },
  {
    title: 'Grimório de Tramas',
    modal: 'garden',
    target: '.modal',
    text: 'Plante tramas com inspiração e colha recursos, bônus temporários ou Destino. Cada uma tem seu tempo de crescimento, de 2 a 30 minutos. O Grimório tem um tutorial próprio, no botão Tutorial.',
  },
  {
    title: 'Estúdio de Ideias',
    modal: 'studio',
    target: '.modal',
    text: 'Gaste inspiração em 5 manuscritos com níveis sem limite: produção global, poder de clique, inspiração, dados dourados e velocidade das tramas (até o dobro). Os níveis sobrevivem a todos os resets.',
  },
  {
    title: 'Prestígio',
    modal: 'prestige',
    target: '.modal',
    text: 'Quando a campanha render pelo menos 1 Destino, reinicie: você troca recursos e construções por Destino e compra 46 bênçãos em 8 grupos, que mudam regras do jogo para sempre.',
  },
  {
    title: 'Publicar a Campanha',
    modal: 'publish',
    target: '.modal',
    text: 'A segunda camada: com 10 campanhas você publica a saga e ganha Lendas. Cada 5 campanhas valem 1 Lenda, e cada Lenda dá +5% produção e +5% Destino, para sempre.',
  },
  {
    title: 'Árvore da Editora',
    modal: 'editora',
    target: '.modal',
    text: 'Cada publicação rende 3 pontos para gastar aqui, em 10 nós permanentes de três ramos. Economia multiplica recursos, Destino melhora resets e Mesas ao Vivo, e Início dá vantagem em cada nova campanha.',
  },
  {
    title: 'Dados de Artífice',
    modal: 'artifice',
    target: '.modal',
    text: 'Um Dado de Artífice chega a cada 12 horas de jogo. Gaste na maestria de uma construção: cada nível dobra a produção dela (até 5 níveis) e nunca se perde em resets.',
  },
  {
    title: 'Conquistas',
    modal: 'achievements',
    target: '.modal',
    text: 'São 368 conquistas, cada uma valendo +2% de produção permanente. Use as abas por categoria, a busca e o filtro de bloqueadas para caçar as que faltam.',
  },
  {
    title: 'Estatísticas',
    modal: 'stats',
    target: '.modal',
    text: 'Aqui ficam os totais, a produção por segundo, os multiplicadores ativos e tudo o que você construiu.',
  },
  {
    title: 'Opções e save',
    modal: 'settings',
    target: '.modal',
    text: 'O jogo salva sozinho a cada 2 segundos. Neste painel você liga e desliga sons, exporta ou importa o save e pode apagar o progresso.',
  },
  {
    title: 'Voltando depois',
    text: 'Ao fechar o jogo a produção continua: até 8 horas normalmente, 24 horas com a bênção Mestre Ausente e 72 horas com Taverna dos Sonhos. O resumo do que rendeu aparece ao voltar.',
  },
  {
    title: 'Pronto para jogar',
    target: '.topbar-actions',
    text: 'Este tour fica sempre disponível no botão ? da barra superior, junto com o manual completo de cada sistema. Bom jogo!',
  },
];

/**
 * Tour próprio do Grimório: abre sozinho na primeira visita e volta pelo botão
 * Tutorial dentro do painel. Os alvos ficam dentro do modal aberto.
 */
export const gardenTutorialSteps: TutorialStep[] = [
  {
    title: 'O Grimório de Tramas',
    modal: 'garden',
    text: 'Aqui você escreve tramas: paga inspiração, espera a página amadurecer e colhe o que ela render. Cada trama tem seu próprio tempo, de 2 a 30 minutos, então o Grimório é coisa para deixar crescendo.',
  },
  {
    title: 'Plantar numa página',
    modal: 'garden',
    target: '.garden-grid',
    text: 'Clique numa página vazia para plantar a trama selecionada na lista de baixo. A página mostra a barra de crescimento e o tempo que falta.',
  },
  {
    title: 'Colher',
    modal: 'garden',
    target: '.garden-grid',
    text: 'Quando a página fica dourada, ela amadureceu: clique para colher jogadores, ouro, dados, inspiração, bênçãos temporárias ou Destino.',
  },
  {
    title: 'O preço acompanha a colheita',
    modal: 'garden',
    target: '.seed-palette',
    text: 'O custo em inspiração cresce junto com a sua produção de ideias, para a colheita nunca virar troco. Se o preço parecer alto, espere a produção subir: a recompensa sobe junto.',
  },
  {
    title: 'Tramas amaldiçoadas',
    modal: 'garden',
    target: '.seed-palette',
    text: 'Algumas tramas têm um preço a mais: enquanto crescem, cortam a produção de ideias. O cartão mostra o corte em vermelho e a página em crescimento traz o selo MALDIÇÃO.',
  },
  {
    title: 'Sinergia',
    modal: 'garden',
    target: '.garden-grid',
    text: 'Duas tramas iguais em páginas vizinhas ganham sinergia: crescem 40% mais rápido e rendem 50% a mais. Repetir a mesma trama lado a lado vale a pena.',
  },
  {
    title: 'Cruzamento',
    modal: 'garden',
    target: '.garden-grid',
    text: 'Duas tramas diferentes e maduras lado a lado cruzam na colheita e revelam um híbrido com recompensa própria. São 13 no total e ficam para sempre.',
  },
  {
    title: 'Acelerar',
    modal: 'garden',
    target: '.garden-grid',
    text: 'Cinco dados adiantam 30 segundos de uma página em crescimento. O painel mostra o tempo real já com bênçãos e sinergia aplicadas.',
  },
  {
    title: 'Sempre à mão',
    modal: 'garden',
    target: '.modal',
    text: 'Este tutorial fica no botão Tutorial do Grimório, e o manual completo está no ? da barra superior. Bom plantio!',
  },
];
