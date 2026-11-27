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
    title: 'Dados Dourados',
    text: 'De tempos em tempos um D20 dourado aparece na tela por 14 segundos. Clique nele para ganhar Frenesi x7, cliques x777, chuva de dados, cópias grátis de construção ou o Jackpot do Dragão.',
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
    text: 'Plante tramas com inspiração e colha recursos, bônus temporários ou Destino. Tramas iguais vizinhas crescem mais rápido, e duas maduras diferentes cruzam para revelar um dos 13 híbridos.',
  },
  {
    title: 'Estúdio de Ideias',
    modal: 'studio',
    target: '.modal',
    text: 'Gaste inspiração em 5 manuscritos com níveis sem limite: produção global, poder de clique, inspiração, dados dourados e velocidade das tramas. Os níveis sobrevivem a todos os resets.',
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
    title: 'Conquistas',
    modal: 'achievements',
    target: '.modal',
    text: 'São 288 conquistas, cada uma valendo +2% de produção permanente. Use as abas por categoria, a busca e o filtro de bloqueadas para caçar as que faltam.',
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
