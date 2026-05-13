export interface BabylonMeshProps {
    spin: number;
    pos?: [number, number, number];
}

export interface GameData {
    gameStage: GameLoop | undefined;
    gameTimer: number;
    winningNumber: number | undefined;
    winners: Winner[];
    balances?: Record<string, number>;
}

export enum GameLoop {
    PLACE_BET = "HAGA SU APUESTA AHORA",
    NO_MORE_BETS = "NO MAS APUESTA",
    SPIN_WHEEL = "GIRAR LA RULETA",
    WINNER = "GANADOR",
    EMPTY_BOARD = "LIMPIAR EL TABLERO",
}

export interface Winner {
    playerId: string;
    win: number;
}

export interface Bet {
    betAmount: number;
    betSpot: string;
    betChips: any;
    betLocation: { x: number; y: number };
}

export interface ClientData {
    playerId: string;
    bets: Bet[];
}
