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

    // local vars
    let dataService = new DataService(config);
    // the view model
    let appState: AppState = {       
        publishEvent: handleAction,
        loading: true,
        loadingIndex: 0,
        selectedPlayerIds: [],
        playerSelectIndex: -1,
        maxSelectedPlayers: 5,
        players: null,
        playersList: null,
        playerStats: [],
        paCount: 100,
        selectedStat: "AVG",
        selectedSplitStat: null,
        selectedSplitVal: 0,
    };

    // our routing function
    function handleAction(event:Action) {
        console.log("App handleAction", event);
        switch(event.type) {    
            case EV.PA_COUNT_CHANGE: onPACountChange(event.payload.paCount); break;
            case EV.PLAYER_CHANGE: onPlayerChange(event.payload.playerId, event.payload.playerIndex); break;
            case EV.PLAYER_SELECT: onPlayerSelect(event.payload.index); break;
            case EV.PLAYER_SELECT_DISMISS: onPlayerSelectDismiss(); break;
            case EV.STAT_CAT_CHANGE: onStatCatChange(event.payload.stat); break;
            case EV.SPLIT_STAT_CHANGE: onSplitStatChange(event.payload.stat, event.payload.splitVal); break;
            case EV.ERROR: onError(event.payload.error); break; 
            case EV.ERROR_DISMISSED: onErrorDismissed(); break;     
        }
    }

    // our action/event handlers
    function onError(err: Error) {
        // @TODO
        console.log(err);
        alert("Sorry, an error occurred. Please try again later");
    }
    function onErrorDismissed() {
        // @TODO
    }

    function onPlayerChange(playerId:number, i:number) {
        // adding or changing a player at a given index
        if(playerId) { 
            appState.loading = true;
            appState.loadingIndex = i;
            dataService.getPlayerStats(playerId)
                .then(resp => {
                    appState.loading = false;
                    appState.selectedPlayerIds[i] = playerId;
                    appState.playerStats[i] = new PlayerStatsCollection(resp.stats.map(s => new PlayerStats(s)));
                }).catch(err => handleAction(createErrorAction(err)));
        }
        // removing a player at an index
        else {
            appState.selectedPlayerIds = [...appState.selectedPlayerIds.slice(0,i), ...appState.selectedPlayerIds.slice(i)];
            appState.playerStats = [...appState.playerStats.slice(0,i), ...appState.playerStats.slice(i)];
        }
    }

    function onPlayerSelect(index:number) {
        if(index < appState.maxSelectedPlayers) { 
            appState.playerSelectIndex = index;
        }
    }

    function onPlayerSelectDismiss() {
        appState.playerSelectIndex = -1;
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

    // we need to fetch the list of players to start
    dataService.getPlayers().then(resp => {
        appState.loading = false;
        appState.playersList = resp.players.sort((a,b) => a.playerFullName < b.playerFullName ? -1 : 1);
        appState.players = {};
        resp.players.forEach(p => appState.players![p.playerId] = p);
    }).catch(err => {
        handleAction(createErrorAction(err));
    });

</script>

<Page {appState} />
