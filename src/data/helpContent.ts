export interface HelpItem {
  label: string;
  text: string;
}

export interface HelpSection {
  id: string;
  title: string;
  icon: string;
  items: HelpItem[];
}

/** The written manual behind the Ajuda button: one section per game system. */
export const helpSections: HelpSection[] = [
  {
    id: 'inicio',
    title: 'Primeiros passos',
    icon: '/icons/table.svg',
    items: [
      { label: 'Hospedar sessões', text: 'Clique na mesa (ou no botão "Hospedar Sessão") para ganhar jogadores. Cada clique vale mais com fama, campanhas, bônus ativos e o dado equipado.' },
      { label: 'Produção automática', text: 'Construções geram recursos por segundo mesmo com a aba fechada, até o limite offline.' },
      { label: 'Ordem sugerida', text: 'Compre a primeira Mesa de Jogo, depois suba construções baratas e melhorias até destravar dados, inspiração e o Grimório.' },
    ],
  },
  {
    id: 'recursos',
    title: 'Os cinco recursos',
    icon: '/icons/players.svg',
    items: [
      { label: 'Jogadores', text: 'Moeda principal. Paga a maioria das construções e é a base do ganho de Destino.' },
      { label: 'Ouro', text: 'Paga construções caras e melhores. Vem de construções, cliques, D20 e eventos dourados.' },
      { label: 'Dados', text: 'Pagam rolagens de D20 e a aceleração de tramas no Grimório.' },
      { label: 'Inspiração', text: 'Paga sementes do Grimório e níveis do Estúdio de Ideias.' },
      { label: 'Destino', text: 'Só vem de campanhas, tramas e eventos. Compra bênçãos de prestígio e nunca é perdido ao resetar a campanha.' },
    ],
  },
  {
    id: 'construcoes',
    title: 'Construções',
    icon: '/icons/tavern.svg',
    items: [
      { label: '35 construções', text: 'Cada uma tem custo, recurso de custo e produção próprios. As primeiras pagam em jogadores, as últimas em ouro, dados ou inspiração.' },
      { label: 'Preço crescente', text: 'Cada unidade custa 15% mais que a anterior. Comprar em lote cobra exatamente a soma dessas unidades.' },
      { label: 'Desbloqueio', text: 'Construções novas aparecem ao cumprir requisitos de recursos ou de outras construções. A próxima bloqueada aparece como "???" com a dica do requisito.' },
    ],
  },
  {
    id: 'melhorias',
    title: 'Melhorias',
    icon: '/icons/scroll.svg',
    items: [
      { label: 'Compra única', text: 'Melhorias multiplam construções específicas ou o poder de clique. Cada uma aparece quando o requisito é cumprido.' },
      { label: 'Comprar tudo', text: 'O botão na aba Melhorias compra de uma vez todas as melhorias que você já pode pagar, da mais barata para a mais cara.' },
      { label: 'Somam com tudo', text: 'Multiplicadores de melhoria entram junto de fama, campanha, bônus, Estúdio e Lendas.' },
    ],
  },
  {
    id: 'lotes',
    title: 'Comprar, vender e lotes',
    icon: '/icons/gold.svg',
    items: [
      { label: 'Quantidades', text: 'x1, x10, x100 ou Max. Max compra o máximo que o seu saldo permite, limitado a 1.000 unidades por clique.' },
      { label: 'Vender', text: 'O modo Vender devolve 50% do valor já pago nas unidades vendidas. Útil para trocar de estratégia.' },
      { label: 'Detalhes', text: 'Passe o mouse sobre uma construção ou melhoria para ver produção por unidade, total atual e preço da próxima.' },
    ],
  },
  {
    id: 'conquistas',
    title: 'Conquistas e fama',
    icon: '/icons/trophy.svg',
    items: [
      { label: '288 conquistas', text: 'Cada conquista dá +2% de produção permanente (ou +4% com a bênção Fama Dobrada). Elas nunca são perdidas em resets.' },
      { label: 'Categorias', text: 'O navegador separa Geral, Construções, Prestígio, Editora, Grimório, Dados e Estúdio, com busca sem acento, filtro de bloqueadas e barra de progresso.' },
      { label: 'Marcos', text: 'Cada construção tem 6 marcos (até 1.000 unidades) e o Estúdio rende 9 conquistas próprias.' },
    ],
  },
  {
    id: 'dourados',
    title: 'Dados Dourados',
    icon: '/icons/golden-d20.svg',
    items: [
      { label: 'Aparecimento', text: 'Um D20 dourado surge a cada 60–150 segundos e fica 14 segundos na tela (21 com a bênção Ímã Dourado). Melhorias, dado equipado e Sorte Escrita encurtam o intervalo.' },
      { label: 'Sete efeitos', text: 'Frenesi da Taverna (produção x7 por 20s), Bênção do Mestre (produção e clique x3 por 15s), Fúria dos Dados (clique x777 por 12s), Sorte do Bardo (jogadores e ouro na hora), Chuva de Dados (6 dados), Especial de Construção (cópias grátis) e Jackpot do Dragão.' },
      { label: 'Chuva de dados', text: 'Cada dado da tempestade paga 30 segundos de jogadores, ouro, dados e inspiração. Clique em todos antes que sumam.' },
    ],
  },
  {
    id: 'd20',
    title: 'Minijogo de D20 e conjuntos',
    icon: '/icons/dice.svg',
    items: [
      { label: 'Custo', text: 'A rolagem custa dados (10 no início, subindo com o total de dados ganhos na vida). Vantagem rola dois d20 e usa o melhor, custando 2,5x.' },
      { label: 'Resultados', text: '1 falha crítica (nada), 2–10 ouro, 11–15 inspiração, 16–19 produção x3 por 20s, 20 crítico: produção x5 por 30s, +1 Destino e inspiração.' },
      { label: 'Conjuntos de dados', text: 'Seis dados colecionáveis: d4, d6, d8, d10, d12 e d20. Só um fica equipado; dados pequenos dão mais críticos e mais dados dourados, dados grandes dão cliques mais fortes.' },
    ],
  },
  {
    id: 'grimorio',
    title: 'Grimório de Tramas',
    icon: '/icons/scroll.svg',
    items: [
      { label: 'Páginas', text: 'São de 4 a 9 páginas, liberadas com campanhas e bênçãos. Plantar custa inspiração; colher rende recursos, bônus ou Destino.' },
      { label: 'Sinergia', text: 'Duas tramas iguais em páginas vizinhas crescem 40% mais rápido e rendem 50% mais na colheita.' },
      { label: 'Acelerar', text: 'Cinco dados adiantam 30 segundos de crescimento de uma trama.' },
      { label: 'Híbridos', text: 'Duas tramas diferentes e maduras em páginas vizinhas cruzam na colheita: 12 receitas fixas e um híbrido genérico, 13 no total. Híbridos descobertos ficam para sempre.' },
    ],
  },
  {
    id: 'estudio',
    title: 'Estúdio de Ideias',
    icon: '/icons/inspiration.svg',
    items: [
      { label: 'Cinco manuscritos', text: 'Rascunho Eterno (+5% produção global), Punho Criativo (+8% clique), Fluxo de Ideias (+10% inspiração), Sorte Escrita (+4% dados dourados) e Roteiro Afiado (+5% velocidade de trama).' },
      { label: 'Sem limite', text: 'Cada nível seguinte custa 1,5x a 1,8x mais inspiração. Não há nível máximo.' },
      { label: 'Permanente', text: 'Os níveis sobrevivem a campanhas e a publicações, e têm 9 conquistas próprias.' },
    ],
  },
  {
    id: 'prestigio',
    title: 'Prestígio: Destino e bênçãos',
    icon: '/icons/fate.svg',
    items: [
      { label: 'Ganho', text: 'Destino = raiz cúbica de (jogadores ganhos na campanha ÷ 100 mil). O primeiro ponto exige 100 mil jogadores e cada década seguinte vale cerca de 2,15x mais.' },
      { label: 'Reset de campanha', text: 'Zera jogadores, ouro, dados, inspiração, construções, melhorias e tramas plantadas. Mantém conquistas, bênçãos, Destino, dados, híbridos e Estúdio.' },
      { label: 'Bênçãos', text: 'São 46 bênçãos em 8 grupos (Fundação, Produção, Cliques, Sorte, Dados, Grimório, Tempo e Legado), cada uma mudando uma regra. Bênçãos e Destino nunca são perdidos em campanhas.' },
    ],
  },
  {
    id: 'publicar',
    title: 'Publicar a Campanha (Lendas)',
    icon: '/icons/crown.svg',
    items: [
      { label: 'Requisito', text: 'Dez campanhas concluídas na saga atual. A partir daí cada 5 campanhas valem 1 Lenda.' },
      { label: 'Lendas', text: 'São permanentes e nunca são gastas: cada uma dá +5% de produção global e +5% de ganho de Destino.' },
      { label: 'O que fica', text: 'Conquistas, dados e dado equipado, híbridos, níveis do Estúdio, Lendas, publicações, tempo de jogo e Destino total histórico.' },
      { label: 'O que some', text: 'Campanhas, multiplicador de campanha, bênçãos compradas, saldo de Destino, recursos, construções, melhorias e tramas plantadas.' },
    ],
  },
  {
    id: 'offline',
    title: 'Produção offline',
    icon: '/icons/players.svg',
    items: [
      { label: 'Acúmulo', text: 'Ao voltar, você recebe a produção do tempo em que ficou fora: até 8 horas normalmente, 24 horas com a bênção Mestre Ausente e 72 horas com Taverna dos Sonhos.' },
      { label: 'Eficiência', text: 'Sem bênção, o rendimento offline é 50% da produção normal; com Mestre Ausente sobe para 100% e com Taverna dos Sonhos para 150%.' },
      { label: 'Resumo', text: 'Um painel mostra exatamente quanto tempo rendeu e o que foi ganho.' },
    ],
  },
  {
    id: 'save',
    title: 'Save, opções e atalhos',
    icon: '/icons/gear.svg',
    items: [
      { label: 'Autosave', text: 'O progresso é salvo a cada 2 segundos e ao fechar a aba. O indicador "salvo" na barra superior confirma.' },
      { label: 'Exportar e importar', text: 'Em Opções você copia ou baixa o save em JSON e cola em outro navegador para continuar de onde parou.' },
      { label: 'Sons e reset', text: 'O painel também liga/desliga efeitos sonoros e apaga todo o progresso, sem desfazer.' },
      { label: 'Ajuda', text: 'O botão ? da barra superior abre este manual e permite rever o tour guiado quando quiser.' },
    ],
  },
];
