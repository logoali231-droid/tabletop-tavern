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
      { label: '45 construções', text: 'Cada uma tem custo, recurso de custo e produção próprios. As primeiras pagam em jogadores, as últimas em ouro, dados ou inspiração.' },
      { label: 'A última é você', text: 'A construção final da lista é sempre "Você": custa uma fortuna em ouro, exige a Mesa Infinita e uma campanha publicada, e produz os cinco recursos, incluindo Destino. Novas construções entram sempre antes dela.' },
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
      { label: '368 conquistas', text: 'Cada conquista dá +2% de produção permanente (ou +4% com a bênção Fama Dobrada). Elas nunca são perdidas em resets.' },
      { label: 'Categorias', text: 'O navegador separa Geral, Construções, Prestígio, Editora, Artífice, Sinergias, Grimório, Dados e Estúdio, com busca sem acento, filtro de bloqueadas e barra de progresso.' },
      { label: 'Marcos', text: 'Cada construção tem 6 marcos (até 1.000 unidades) e o Estúdio rende 9 conquistas próprias.' },
      { label: 'Sinergias', text: 'Conjuntos temáticos de construções (Mesa Posta, Arsenal Arcano, Corte Feérica...) dão bônus global permanente enquanto você tiver pelo menos uma de cada.' },
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
      { label: 'Desbloqueio por prestígio', text: 'Só o d4 vem de graça. Cada dado novo é liberado por campanhas concluídas: d6 com 1, d8 com 2, d10 com 3, d12 com 5 e d20 com 8. O painel mostra a dica de cada um; o que já foi desbloqueado nunca é perdido, nem ao publicar.' },
    ],
  },
  {
    id: 'grimorio',
    title: 'Grimório de Tramas',
    icon: '/icons/scroll.svg',
    items: [
      { label: 'Páginas', text: 'São de 4 a 9 páginas, liberadas com campanhas e bênçãos. Plantar custa inspiração; colher rende recursos, bônus ou Destino.' },
      { label: 'Tempo de cada trama', text: 'Cada semente tem o seu ritmo: de 2 minutos (Rumor de Taverna) a 30 minutos (Lenda Eterna); híbridos ficam entre 5 e 35 minutos. Sinergia, bênçãos e Roteiro Afiado encurtam o relógio.' },
      { label: 'Preço que acompanha', text: 'O custo em inspiração é o maior entre o preço base e uma fatia da produção de ideias por segundo. Assim a colheita nunca vira troco: quem produz mais ideias paga mais e recebe mais.' },
      { label: 'Maldições', text: 'Mapa Rasgado, Maldição Antiga, Profecia Maldita e Maldição Eterna cortam a produção de ideias enquanto crescem (25% a 60%, somando no máximo 70%). O cartão e a página mostram o corte.' },
      { label: 'Sinergia', text: 'Duas tramas iguais em páginas vizinhas crescem 40% mais rápido e rendem 50% mais na colheita.' },
      { label: 'Acelerar', text: 'Cinco dados adiantam 30 segundos de crescimento de uma trama.' },
      { label: 'Híbridos', text: 'Duas tramas diferentes e maduras em páginas vizinhas cruzam na colheita: 12 receitas fixas e um híbrido genérico, 13 no total. Híbridos descobertos ficam para sempre.' },
      { label: 'Tutorial próprio', text: 'Na primeira visita o Grimório abre um tour de 9 passos só dele; o botão Tutorial no topo do painel repete quando quiser, sem mexer no tour principal.' },
    ],
  },
  {
    id: 'estudio',
    title: 'Estúdio de Ideias',
    icon: '/icons/inspiration.svg',
    items: [
      { label: 'Cinco manuscritos', text: 'Rascunho Eterno (+5% produção global), Punho Criativo (+8% clique), Fluxo de Ideias (+10% inspiração), Sorte Escrita (+4% dados dourados) e Roteiro Afiado (+5% velocidade de trama, até +100%).' },
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
      { label: 'Destino passivo', text: 'Construções que rendem Destino têm teto: no máximo 1/30 do que a campanha atual renderia por segundo. Resets continuam sendo a fonte principal.' },
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
      { label: 'O que fica', text: 'Conquistas, dados e dado equipado, híbridos, níveis do Estúdio, Lendas, sagas publicadas, pontos e nós da Editora, tempo de jogo e Destino total histórico.' },
      { label: 'Pontos da Editora', text: 'Cada publicação rende 3 pontos para gastar na Árvore da Editora. As conquistas e o prédio "Você" contam sagas publicadas, então gastar pontos nunca regride progresso.' },
      { label: 'O que some', text: 'Campanhas, multiplicador de campanha, bênçãos compradas, saldo de Destino, recursos, construções, melhorias e tramas plantadas.' },
    ],
  },
  {
    id: 'editora',
    title: 'Árvore da Editora',
    icon: '/icons/scroll.svg',
    items: [
      { label: 'Como paga', text: 'Cada saga publicada rende 3 pontos da Editora. Publicações e pontos são coisas separadas: o contador de sagas nunca diminui, só o saldo de pontos.' },
      { label: 'Os três ramos', text: 'Economia (produção global, ouro, dados e jogadores), Destino (+20% Destino, Mesas ao Vivo melhores, +1 Lenda por publicação) e Início (recursos iniciais, produção x3 por 90s e +1 página no Grimório).' },
      { label: 'Permanência', text: 'Os 10 nós são comprados uma vez e valem para sempre, inclusive depois de publicar outra saga. Não há reset que os remova.' },
      { label: 'Conquistas', text: 'Comprar 1, 5 e os 10 nós rende três conquistas na aba Editora.' },
    ],
  },
  {
    id: 'artifice',
    title: 'Dados de Artífice e maestria',
    icon: '/icons/artificer.svg',
    items: [
      { label: 'Como consegue', text: 'Um Dado de Artífice é pago a cada 12 horas de jogo. É um recurso passivo e raro: o relógio só anda com o jogo aberto, e o painel mostra quanto falta para o próximo.' },
      { label: 'O que compra', text: 'Cada dado compra um nível de maestria numa construção que você já possui. Cada nível dobra a produção daquela construção: 1 nível = x2, 2 níveis = x4, e assim até 5 níveis (x32).' },
      { label: 'Custo crescente', text: 'O nível 1 custa 1 dado, o 2 custa 2, o 3 custa 3, o 4 custa 4 e o 5 custa 5 — 15 dados para levar uma construção até a maestria máxima.' },
      { label: 'Permanente', text: 'Maestria e saldo de dados sobrevivem a campanhas, publicações, importação de save e a qualquer reset. Os goblins também podem deixar um Dado de Artífice no baú.' },
    ],
  },
  {
    id: 'pestes',
    title: 'Goblins na Taverna (pestes)',
    icon: '/icons/goblin.svg',
    items: [
      { label: 'Aparecimento', text: 'Depois dos primeiros mil jogadores, um goblin aparece a cada 2,5–5 minutos e fica grudado no canto da tela. Fechar um painel ou abrir o tutorial pausa o aparecimento.' },
      { label: 'O que ele faz', text: 'Enquanto o goblin estiver ali, a produção passiva de jogadores cai 10%. Nada mais é afetado e nenhum progresso é perdido.' },
      { label: 'Como expulsar', text: 'Clique no goblin 5 vezes. Os pontinhos mostram o quanto falta; ao expulsar, ele deixa um baú de ouro e dados proporcional ao tempo que ficou (até 10 minutos), com 15% de chance de vir um Dado de Artífice.' },
      { label: 'Conquistas', text: 'Expulsar 1, 10 e 50 goblins rende três conquistas, e o contador é permanente.' },
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
    id: 'sinergias',
    title: 'Sinergias de construções',
    icon: '/icons/table.svg',
    items: [
      { label: 'Como ativam', text: 'Cada sinergia pede pelo menos uma unidade de três construções específicas. Enquanto as três existirem, o bônus é permanente e entra no multiplicador global.' },
      { label: 'As oito sinergias', text: 'Mesa Posta (+15%), Arsenal Arcano (+20%), Corte Feérica (+20%), Além do Véu (+25%), Forja do Mundo (+25%), Alta Sociedade (+20%), Bestiário (+30%) e A Mesa de Tudo (+50%).' },
      { label: 'Onde ver', text: 'A faixa de sinergias fica no topo da aba Construções: chips dourados estão ativos, chips apagados mostram no tooltip quais construções faltam.' },
    ],
  },
  {
    id: 'mesas',
    title: 'Mesas ao Vivo (chefes)',
    icon: '/icons/dice.svg',
    items: [
      { label: 'Como aparecem', text: 'Depois dos primeiros jogadores, um chefe surge a cada 4–8 minutos e fica 45 segundos. Fechar um painel ou abrir o tutorial pausa o relógio.' },
      { label: 'Fases e escudo', text: 'A mesa tem três fases (100%, 66% e 33% do HP). Chefes Couraçados abrem cada fase com um escudo de 25% do HP: Atacar só gasta o escudo, então Provocar resolve.' },
      { label: 'Provocar e foco', text: 'Provocar custa 8 dados, quebra o escudo, zera o combo e soma 1 Foco. Cada Foco dá +30% de dano pelo resto da mesa — trocar combo por foco é a decisão central da luta.' },
      { label: 'Ritual do Mestre', text: 'Uma vez por fase, 35 dados compram um Ritual que causa 6x o ataque básico e ignora o escudo. Guarde dados para a fase 3.' },
      { label: 'Afinidades', text: 'Cada chefe tem uma regra extra: Couraçado (escudo em cada fase), Regenerador (recupera 1% do HP por segundo) ou Acelerado (relógio 30% mais rápido; a fase 3 acelera mais 25%).' },
      { label: 'Recompensa', text: 'Vitória rende 3 minutos de produção de jogadores, ouro, dados e inspiração vezes um bônus pela pressa (até +50%), +2 Destino (+1 se vencer na metade do tempo) e o Troféu da Mesa (produção x3 por 30s). Se o tempo acabar, o chefe vai embora sem prêmio.' },
      { label: 'Conquistas', text: 'Vença 1, 10 e 50 Mesas ao Vivo. O contador é permanente e sobrevive a resets.' },
    ],
  },
  {
    id: 'familiar',
    title: 'Familiar: XP e auras',
    icon: '/icons/lute.svg',
    items: [
      { label: 'XP sempre', text: 'Pip ganha 0,4 XP por segundo com o jogo aberto, +1 por clique, +20 por trama colhida, +120 por Mesa ao Vivo vencida, +400 por campanha e +800 por publicação. O XP nunca é perdido em resets.' },
      { label: 'Nível', text: 'O nível sobe a cada 25·(N−1)² de XP, até o nível 30. Não há custo nem botão: o familiar cresce sozinho conforme você joga.' },
      { label: 'Auras', text: 'São quatro e só uma fica ativa. Aura de Ideias (nível 4, inspiração), Aura de Fortuna (nível 8, ouro), Aura de Fama (nível 14, jogadores) e Aura do Destino (nível 20, Destino passivo). Trocar é de graça.' },
      { label: 'Escala', text: 'Cada aura começa em +15% a +30% e ganha mais 1% a 3% por nível acima do desbloqueio. O painel mostra o bônus exato antes de você escolher.' },
    ],
  },
  {
    id: 'festival',
    title: 'Festivais do mês real',
    icon: '/icons/crown.svg',
    items: [
      { label: 'Um por mês', text: 'O festival segue o calendário de verdade: janeiro dá +25% jogadores, agosto dobra os cliques, dezembro dá +30% ouro e +15% jogadores, e assim por diante. A troca acontece sozinha no dia 1º.' },
      { label: 'Pontos', text: 'Você ganha 0,4 ponto por segundo jogando, +1 por clique, +10 por colheita, +20 por Dado Dourado e +50 por Mesa ao Vivo vencida.' },
      { label: 'Três metas', text: 'Brinde (250 pontos), Banquete (700) e Coroa (1600). Cada meta é resgatada uma vez por mês e paga recursos, bênção, Destino e até um Dado de Artífice.' },
      { label: 'Zera no mês novo', text: 'Pontos e metas resgatadas viram no dia 1º; os prêmios já recebidos ficam com você. O painel mostra o próximo festival.' },
    ],
  },
  {
    id: 'panteao',
    title: 'Panteão dos Deuses',
    icon: '/icons/fate.svg',
    items: [
      { label: 'Dois assentos', text: 'Sete deuses, dois assentos. Todos os deuses são desbloqueados com Destino total histórico: Fortuna com 1, Chronos com 5, Mnemosine com 10, Tique com 20, Nix com 35, Ares com 50 e Dionísio com 70.' },
      { label: 'Buff e debuff', text: 'Todo deus dá um bônus forte e corta outro recurso. Fortuna dá +50% ouro e −20% inspiração; Ares dá +70% jogadores e deixa os cliques em x0,6. Não existe deus sem preço.' },
      { label: 'Combinação', text: 'Os dois assentos multiplicam entre si. Dois deuses de ouro somam bônus, mas também somam os cortes; o painel mostra o efeito combinado antes de confirmar.' },
      { label: 'Permanente', text: 'Os deuses sentados sobrevivem a campanhas, publicações e importação de save. Trocar é de graça e não custa Destino.' },
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
