/**
 * Names for the "how many of this building do you own" achievement ladder.
 * Order matches MILESTONE_TIERS below; the last entries are deliberately
 * over the top, because that is the point of an idle game.
 */
export const milestoneNames: Record<string, string[]> = {
  gameTable: ['Uma Mesa e Um Sonho', 'Sala Cheia', 'Casa das Mesas', 'Vila das Mesas', 'Cidade das Mesas', 'Império das Mesas'],
  dmScreen: ['Escudo de Papelão', 'Escudo Reforçado', 'Muralha do Mestre', 'Fortaleza do Mestre', 'Bastião do Mestre', 'Cidadela do Mestre'],
  snackBar: ['Pizza Fria', 'Balcão da Lanchonete', 'Rede de Lanchonetes', 'Império do Salgado', 'Federação do Lanche', 'Economia do Lanche'],
  paintingStudio: ['Primeira Miniatura', 'Estúdio Alugado', 'Galeria de Miniaturas', 'Academia de Pintura', 'Distrito dos Pincéis', 'Mundo Pintado'],
  tavern: ['Balcão de Madeira', 'Taverna da Esquina', 'Rede de Tavernas', 'Cidade Taverneira', 'Reino das Tavernas', 'Plano das Tavernas'],
  bard: ['Um Bardo e Um Alaúde', 'Trupe Viajante', 'Festival dos Bardos', 'Conservatório', 'Ópera Nacional', 'Canção do Mundo'],
  conventionHall: ['Salão Alugado', 'Convenção Regional', 'Convenção Nacional', 'Capital do RPG', 'Congresso Mundial', 'Dimensão da Convenção'],
  guild: ['Quadro de Missões', 'Guilda Local', 'Rede de Guildas', 'Conselho das Guildas', 'Federação de Aventureiros', 'Governo dos Aventureiros'],
  diceForge: ['Bigorna e Cinzel', 'Forja de Bairro', 'Complexo de Forjas', 'Distrito dos Dados', 'Indústria dos Dados', 'Lua dos Dados'],
  magicTower: ['Uma Torre', 'Torre do Mago Local', 'Círculo de Torres', 'Academia Arcana', 'Arquipélago Arcano', 'Céu Arcano'],
  arcaneLibrary: ['Estante Empoeirada', 'Biblioteca de Campanha', 'Grande Biblioteca', 'Labirinto de Livros', 'Mar de Pergaminhos', 'Biblioteca do Universo'],
  planarPortal: ['Fresta no Véu', 'Portal Estável', 'Rede de Portais', 'Encruzilhada de Planos', 'Avenida Planar', 'Metrópole dos Planos'],
  royalCrown: ['Coroa de Latão', 'Coroa Verdadeira', 'Trono Compartilhado', 'Dinastia do Rei-Rei', 'Era do Rei-Rei', 'Eternidade do Rei-Rei'],
  dragonLair: ['Um Covil', 'Covil Aquecido', 'Montanha do Dragão', 'Dragonato Próspero', 'Império Escamoso', 'Era dos Dragões'],
  fateThrone: ['Assento de Pedra', 'Trono do Destino', 'Sala dos Fios', 'Palácio do Destino', 'Conselho das Moiras', 'Onde Tudo Acontece'],
  witchHut: ['Caldeirão Pequeno', 'Cabana na Floresta', 'Círculo de Bruxas', 'Coven do Vale', 'Floresta Encantada', 'Reino das Bruxas'],
  battleArena: ['Ringue de Terra', 'Arena Municipal', 'Coliseu Regional', 'Liga dos Campeões', 'Circuito Mundial', 'Arena Eterna'],
  pirateAirship: ['Balão Remendado', 'Dirigível Pirata', 'Frota Aérea', 'Armada dos Céus', 'Império Aéreo', 'Céu Saqueado'],
  feyCourt: ['Círculo de Cogumelos', 'Corte Menor', 'Corte Feérica', 'Reino das Fadas', 'Império Feérico', 'Tudo é Feérico'],
  clockworkForge: ['Engrenagem Solta', 'Oficina Mecânica', 'Forja Automática', 'Complexo Industrial', 'Cidade-Fábrica', 'Máquina do Mundo'],
  skyCitadel: ['Torre nas Nuvens', 'Cidadela Celeste', 'Arquipélago Flutuante', 'Reino dos Céus', 'Império Celeste', 'Céu Construído'],
  undergroundBazaar: ['Banca Escondida', 'Bazar Subterrâneo', 'Mercado Profundo', 'Cidade Comercial', 'Rede de Contrabando', 'Economia Subterrânea'],
  godsArena: ['Altar de Combate', 'Arena dos Deuses', 'Panteão Lutador', 'Guerra Divina', 'Olimpo em Chamas', 'Fim dos Deuses'],
  moonLibrary: ['Livro na Lua', 'Biblioteca Lunar', 'Arquivo Selenita', 'Cidade dos Livros', 'Mar de Lua', 'Conhecimento Eterno'],
  titanForge: ['Martelo Titânico', 'Forja dos Titãs', 'Vulcão-Forja', 'Cadeia de Vulcões', 'Mundo Forjado', 'Bigorna Primordial'],
  dragonEmpire: ['Domínio Escamoso', 'Império do Dragão', 'Reino dos Wyrm', 'Era Escamosa', 'Continente do Dragão', 'Dragão do Mundo'],
  astralColosseum: ['Arena Estelar', 'Coliseu Astral', 'Liga das Estrelas', 'Galáxia de Combate', 'Torneio Cósmico', 'Universo em Combate'],
  worldSerpent: ['Escama Perdida', 'Serpente do Mundo', 'Anel do Mundo', 'Mapa Vivo', 'Horizonte Serpentino', 'O Mundo Inteiro'],
  storyForge: ['Primeira Página', 'Forja de Histórias', 'Fábrica de Tramas', 'Cidade dos Roteiristas', 'Multiverso Narrativo', 'Tudo é História'],
  diceSanctum: ['Dado Sagrado', 'Santuário dos Dados', 'Templo das Faces', 'Catedral do d20', 'Religião dos Dados', 'Fé nos Dados'],
  dreamGate: ['Sonho Repetido', 'Portão dos Sonhos', 'Estrada Onírica', 'Reino dos Sonhos', 'Oceano de Sonhos', 'Sonho Acordado'],
  inkOcean: ['Poça de Tinta', 'Oceano de Tinta', 'Maré de Palavras', 'Continente Escrito', 'Mundo Redigido', 'Tinta Infinita'],
  stoneColossus: ['Pedra em Pé', 'Colosso de Pedra', 'Guardião de Pedra', 'Muralha Viva', 'Montanha Andante', 'Era de Pedra'],
  timeVault: ['Ampulheta', 'Cofre do Tempo', 'Arquivo das Horas', 'Século Guardado', 'Milênio Seguro', 'Tempo Infinito'],
  universalTavern: ['Mesa Final', 'Taverna do Universo', 'Taverna Estelar', 'Taverna Multiversal', 'Taverna de Tudo', 'Fim de Tudo'],
};

/** How many units each milestone asks for; later buildings ask for less. */
export function milestoneTiers(index: number): number[] {
  if (index < 15) return [1, 10, 50, 100, 500, 1000];
  if (index < 25) return [1, 10, 50, 100, 250, 500];
  return [1, 5, 10, 25, 50, 100];
}
