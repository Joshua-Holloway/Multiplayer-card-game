export interface Player{
    id: string;
    name: string;
    coins: number;
}

export interface GameState{
    players: Player[];
    currentPlayerId: string | null;
}

export type ClientMessage = 
    | {
        type: "join";
        name: string;
    }
    | {
        type: "take_coin";
    }

export type ServerMessage =
    | {
        type: "welcome";
        playerId: string;
    }
    | {
        type: "state";
        state: GameState;
    }
    | {
        type: "error";
        message: string;
    }