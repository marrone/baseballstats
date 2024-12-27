<script lang="ts">
    /**
     * App.svelte represents the main controller. It handles initializing state, mounting the view,
     * handling events from the UI and routes to the appropriate handler to make requests and update the state.
     * The updated state is then passed back down to the view to re-render in a uni-directional control flow
     */

    // props
    export let config:AppConfig;

    // deps
    import DataService, { PlayersResponse } from "../scripts/DataService";
    import { type Action, type Payload, createErrorAction } from "../scripts/Action";
    import PlayerStats from "../scripts/PlayerStats";
    import PlayerStatsCollection from "../scripts/PlayerStatsCollection";
    import Page from "./Page.svelte";
    import { EVENT_NAMES as EV } from "../scripts/const/events";

    // our routing function
    function handleAction(event:Action) {
        console.log("App handleAction", event);
        switch(event.type) {    
            case EV.PA_COUNT_CHANGE: onPACountChange(event.payload.paCount); break;
            case EV.PLAYER_CHANGE: onPlayerChange(event.payload.playerId); break;
            case EV.STAT_CAT_CHANGE: onStatCatChange(event.payload.stat); break;
            case EV.SPLIT_STAT_CHANGE: onSplitStatChange(event.payload.stat, event.payload.splitVal); break;
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
            appState.loading = true;
            dataService.getPlayerStats(playerId)
                .then(resp => {
                    appState.loading = false;
                    appState.playerStats = new PlayerStatsCollection(resp.stats.map(s => new PlayerStats(s)));
                }).catch(err => handleAction(createErrorAction(err)));
        }
        else {
            appState.playerStats = null;
        }
        appState.selectedPlayerId = playerId;
    }

    function onStatCatChange(stat:GraphableStatCat) {
        appState.selectedStat = stat;
    }

    function onSplitStatChange(stat:SplitStatCat|null, splitVal:number) {
        appState.selectedSplitStat = stat;
        appState.selectedSplitVal = splitVal;
    }

    function onPACountChange(paCount:number) {
        appState.paCount = paCount;
    }

    // the view model
    let appState: AppState = {       
        publishEvent: handleAction,
        loading: true,
        selectedPlayerId: 0,
        players: null,
        playerStats: null,
        paCount: 100,
        selectedStat: "AVG",
        selectedSplitStat: null,
        selectedSplitVal: 0,
    };

    // we need to fetch the list of players to start
    let dataService = new DataService(config);
    dataService.getPlayers().then(resp => {
        appState.loading = false;
        appState.players = {};
        resp.players.forEach(p => appState.players![p.playerId] = p);
    }).catch(err => {
        handleAction(createErrorAction(err));
    });

</script>

<Page {appState} />
