<script lang="ts">
    /**
     * App.svelte represents the main controller. It handles initializing state, mounting the view,
     * handling events from the UI and routes to the appropriate handler to make requests and update the state.
     * The updated state is then passed back down to the view to re-render in a uni-directional control flow
     */

    // props
    import { type AppConfig } from "../scripts/config";
    export let config:AppConfig;

    // deps
    import DataService, { PlayersResponse } from "../scripts/DataService";
    import { type Action, type Payload, createErrorAction } from "../scripts/Action";
    import Page from "./Page.svelte";
    import { type Player, type PlayerStats } from "../scripts/types";
    import { EVENT_NAMES as EV } from "../scripts/const/events";

    // our routing function
    function handleAction(event:Action) {
        console.log("App handleAction", event);
        switch(event.type) {
            case EV.PLAYER_CHANGE: onPlayerChange(event.payload.playerId); break;
            case EV.ERROR: onError(event.payload.error); break; 
            case EV.ERROR_DISMISSED: onErrorDismissed(); break;     
        }
    }

    // our event handlers
    function onError(err: Error) {
        // @TODO
        console.log(err);
        alert("Sorry, an error occurred. Please try again later");
    }
    function onErrorDismissed() {
        // @TODO
    }
    function onPlayerChange(playerId:number) {
        if(playerId) { 
            viewModel.loading = true;
            dataService.getPlayerStats(playerId)
                .then(resp => {
                    viewModel.loading = false;
                    viewModel.playerStats = resp.stats;
                }).catch(err => handleAction(createErrorAction(err)));
        }
        else {
            viewModel.playerStats = null;
        }
        viewModel.selectedPlayer = playerId;
    }

    let viewModel: {
        publishEvent: (event:Action) => void,
        loading: boolean,
        selectedPlayer: number,
        players: Player[] | null,
        playerStats: PlayerStats[] | null,
    } = {       
        publishEvent: handleAction,
        loading: true,
        selectedPlayer: 0,
        players: null,
        playerStats: null
    };

    // we need to fetch the list of players to start
    let dataService = new DataService(config);
    dataService.getPlayers().then(resp => {
        viewModel.loading = false;
        viewModel.players = resp.players;
    }).catch(err => {
        handleAction(createErrorAction(err));
    });

</script>

<Page {...viewModel} />
