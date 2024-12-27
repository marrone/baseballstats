import PlayerStatsCollection from "../PlayerStatsCollection";
import { GraphableStatCat } from "./PlayerStats";

declare global { 

    type AppState = {
        publishEvent: (event:Action) => void,
        loading: boolean,
        selectedPlayerId: number,
        players: PlayerMap | null,
        playerStats: PlayerStatsCollection | null,
        paCount: number,
        selectedStat: GraphableStatCat,
        selectedSplitStat: SplitStatCat | null,
        selectedSplitVal: number,
    }

}

export { type AppState };
