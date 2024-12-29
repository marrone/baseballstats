import PlayerStatsCollection from "../PlayerStatsCollection";
import { GraphableStatCat } from "./PlayerStats";

declare global { 

    type AppState = {
        // basic event/action publisher the UI will use to publish events
        publishEvent: (event:Action) => void,
        // app loading indicator
        loading: boolean,
        // indicates which graph player index is loading
        loadingIndex: number,
        // the graphed player ids
        selectedPlayerIds: number[],
        // the index of the graphed player being selected/changed
        playerSelectIndex: number,
        // max number of players to graph
        maxSelectedPlayers: number,
        // player models lookup
        players: PlayerMap | null,
        // list version of the player models for iterating over
        playersList: Player[] | null,
        // graphhed player stats
        playerStats: PlayerStatsCollection[],
        // the PA count to compute rolling average on
        paCount: number,
        // the selected stat to graph
        selectedStat: GraphableStatCat,
        // the selected stat to split on
        selectedSplitStat: SplitStatCat | null,
        // the threshold value to split on
        selectedSplitVal: number,
    }

}

export { type AppState };
