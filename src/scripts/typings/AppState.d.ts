import PlayerStatsCollection from "../PlayerStatsCollection";

declare global { 

    type AppState = {
        publishEvent: (event:Action) => void,
        loading: boolean,
        selectedPlayerId: number,
        players: PlayerMap | null,
        playerStats: PlayerStatsCollection | null,
    }

}

export { type AppState };
