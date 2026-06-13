import type { GameLanguage } from "./game/types";

export const LANGUAGES: { code: GameLanguage; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "pt", label: "Português", short: "PT" },
];

const en = {
  landing: {
    badge: "In-person party game",
    heroDesc:
      "One shared screen shows the board. Each spymaster scans a QR code to see the secret key on their phone. Give clues out loud, beat the timer.",
    classicPlayers: "4+ players",
    duetPlayers: "2 players",
    classicTitle: "Classic",
    classicDesc:
      "Red vs Blue. Two teams race to find all their agents — without touching the assassin.",
    duetTitle: "Duet",
    duetDesc:
      "Cooperative, 2 players. Work together to find all 15 agents before you hit an assassin.",
    playClassic: "Play Classic",
    playDuet: "Play Duet",
    languageLabel: "Language",
    steps: [
      {
        t: "Open the board",
        d: "Create a game and put the board on a TV or laptop.",
      },
      {
        t: "Scan to spy",
        d: "Each spymaster scans their team's QR code on a phone.",
      },
      {
        t: "Play",
        d: "Give clues aloud, tap cards to reveal, watch the timer.",
      },
    ],
  },
  hub: {
    readyTitleDuet: "Duet game ready",
    readyTitleClassic: "Game ready",
    readyDescDuet:
      "Open the board on your shared screen, then each player scans their QR code.",
    readyDescClassic:
      "Open the board on your shared screen, then have each spymaster scan their team's QR code on a phone. Keep this page private.",
    openBoard: "Open the board",
    footerDuet:
      "Each player should open their own link — they see different key cards.",
    footerClassic:
      "Anyone with a spymaster link can see that team's key, so only share each QR code with its spymaster.",
  },
  common: {
    playerA: "Player A",
    playerB: "Player B",
    redSpymaster: "Red spymaster",
    blueSpymaster: "Blue spymaster",
    copyLink: "Copy link",
    copied: "Copied!",
  },
  score: {
    redTurn: "Red team's turn",
    blueTurn: "Blue team's turn",
    playerATurn: "Player A's turn",
    playerBTurn: "Player B's turn",
    redWins: "Red wins",
    blueWins: "Blue wins",
    youWon: "You won! 🎉",
    gameOver: "Game over",
    red: "Red",
    blue: "Blue",
    ofLeft: "of {n} left",
    agents: "agents",
  },
  display: {
    settings: "Display settings",
    mode: "Display mode",
    auto: "Auto",
    autoDesc: "Match this screen",
    tv: "TV / Big screen",
    tvDesc: "Force large layout",
    phone: "Phone",
    phoneDesc: "Force compact layout",
    qrCodes: "QR codes",
  },
  spy: {
    keepHidden: "🤫 Keep this screen hidden",
    newGame: "New game",
    resetTimer: "Reset timer",
    gameOverHint: "Game over — tap New game to play again.",
    yourTurnHint: "Your turn — tap a card to reveal it on the board.",
    waiting: "Waiting for the other team…",
    pauseTimer: "Pause timer",
    startTimer: "Start timer",
    endTurn: "End turn",
    legendRed: "Red",
    legendBlue: "Blue",
    legendNeutral: "Neutral",
    legendAssassin: "Assassin",
    legendAgent: "Agent",
    legendBystander: "Bystander",
  },
};

export type Messages = typeof en;

const pt: Messages = {
  landing: {
    badge: "Jogo de festa presencial",
    heroDesc:
      "Uma tela compartilhada mostra o tabuleiro. Cada espião escaneia um QR code para ver a chave secreta no celular. Dê as dicas em voz alta e vença o cronômetro.",
    classicPlayers: "4+ jogadores",
    duetPlayers: "2 jogadores",
    classicTitle: "Clássico",
    classicDesc:
      "Vermelho vs Azul. Dois times correm para encontrar todos os seus agentes — sem tocar no assassino.",
    duetTitle: "Duet",
    duetDesc:
      "Cooperativo, 2 jogadores. Trabalhem juntos para encontrar os 15 agentes antes de acertar um assassino.",
    playClassic: "Jogar Clássico",
    playDuet: "Jogar Duet",
    languageLabel: "Idioma",
    steps: [
      {
        t: "Abra o tabuleiro",
        d: "Crie um jogo e coloque o tabuleiro numa TV ou notebook.",
      },
      {
        t: "Escaneie para espiar",
        d: "Cada espião escaneia o QR code do seu time no celular.",
      },
      {
        t: "Jogue",
        d: "Dê as dicas em voz alta, toque nas cartas e observe o tempo.",
      },
    ],
  },
  hub: {
    readyTitleDuet: "Jogo Duet pronto",
    readyTitleClassic: "Jogo pronto",
    readyDescDuet:
      "Abra o tabuleiro na tela compartilhada e cada jogador escaneia o seu QR code.",
    readyDescClassic:
      "Abra o tabuleiro na tela compartilhada e cada espião escaneia o QR code do seu time no celular. Mantenha esta página privada.",
    openBoard: "Abrir o tabuleiro",
    footerDuet:
      "Cada jogador deve abrir o seu próprio link — eles veem cartas-chave diferentes.",
    footerClassic:
      "Qualquer pessoa com o link de espião vê a chave daquele time, então compartilhe cada QR code apenas com o seu espião.",
  },
  common: {
    playerA: "Jogador A",
    playerB: "Jogador B",
    redSpymaster: "Espião vermelho",
    blueSpymaster: "Espião azul",
    copyLink: "Copiar link",
    copied: "Copiado!",
  },
  score: {
    redTurn: "Vez do time vermelho",
    blueTurn: "Vez do time azul",
    playerATurn: "Vez do Jogador A",
    playerBTurn: "Vez do Jogador B",
    redWins: "Vermelho venceu",
    blueWins: "Azul venceu",
    youWon: "Vocês venceram! 🎉",
    gameOver: "Fim de jogo",
    red: "Vermelho",
    blue: "Azul",
    ofLeft: "de {n} restantes",
    agents: "agentes",
  },
  display: {
    settings: "Configurações de tela",
    mode: "Modo de exibição",
    auto: "Automático",
    autoDesc: "Acompanhar esta tela",
    tv: "TV / Tela grande",
    tvDesc: "Forçar layout grande",
    phone: "Celular",
    phoneDesc: "Forçar layout compacto",
    qrCodes: "QR codes",
  },
  spy: {
    keepHidden: "🤫 Mantenha esta tela escondida",
    newGame: "Novo jogo",
    resetTimer: "Reiniciar cronômetro",
    gameOverHint: "Fim de jogo — toque em Novo jogo para jogar de novo.",
    yourTurnHint: "Sua vez — toque numa carta para revelá-la no tabuleiro.",
    waiting: "Aguardando o outro time…",
    pauseTimer: "Pausar cronômetro",
    startTimer: "Iniciar cronômetro",
    endTurn: "Encerrar a vez",
    legendRed: "Vermelho",
    legendBlue: "Azul",
    legendNeutral: "Neutro",
    legendAssassin: "Assassino",
    legendAgent: "Agente",
    legendBystander: "Civil",
  },
};

const messages: Record<GameLanguage, Messages> = { en, pt };

/** Return the message bundle for a language (falls back to English). */
export function t(language: GameLanguage | undefined): Messages {
  return messages[language ?? "en"] ?? en;
}

/** Replace {n} placeholders in a template string. */
export function fmt(template: string, n: number | string): string {
  return template.replace("{n}", String(n));
}
