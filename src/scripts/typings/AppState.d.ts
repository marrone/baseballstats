import PlayerStatsCollection from "../PlayerStatsCollection";
import { GraphableStatCat } from "./PlayerStats";

declare global { 

    type AppState = {
        publishEvent: (event:Action) => void,
        loading: boolean,
        loadingIndex: number,
        selectedPlayerIds: number[],
        playerSelectIndex: number,
        maxSelectedPlayers: number,
        players: PlayerMap | null,
        playersList: Player[] | null,
        playerStats: PlayerStatsCollection[],
        paCount: number,
        selectedStat: GraphableStatCat,
        selectedSplitStat: SplitStatCat | null,
        selectedSplitVal: number,
    }

}

export { type AppState };
