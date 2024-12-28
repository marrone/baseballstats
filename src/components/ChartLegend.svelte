<script lang='ts'>
    export let appState:AppState;
    
    import { colors, mergedColors } from "../scripts/const/colors";
    import { createPlayerSelectAction, createPlayerChangeAction } from "../scripts/Action";
    import Loading from "./Loading.svelte";
    import EditIcon from "./icons/Edit.svelte";
    import DeleteIcon from "./icons/Delete.svelte";

    $: isSplit = appState.selectedSplitStat;
    $: players = appState.players && appState.selectedPlayerIds 
               ? appState.selectedPlayerIds.map(id => appState.players![id]) 
               : [];

    function onAddPlayer() {
        appState.publishEvent(createPlayerSelectAction({index: players.length}));
    }

    function onEditPlayer(ev:Event) {
        if(ev.target instanceof HTMLButtonElement) { 
            let index = parseInt(ev.target.getAttribute('data-index') || "");
            if(!isNaN(index)) {
                appState.publishEvent(createPlayerSelectAction({index}));
            }
        }
    }

    function onDeletePlayer(ev:Event) {
        if(ev.target instanceof HTMLButtonElement) { 
            let index = parseInt(ev.target.getAttribute('data-index') || "");
            if(!isNaN(index)) {
                appState.publishEvent(createPlayerChangeAction({playerId: 0, playerIndex: index}));
            }
        }
    }
</script>

<div class='players'>
    {#each players as player, i (player.playerId)}
        <div class='player'>
            {#if appState.loading && appState.loadingIndex == i}
                <Loading />
            {:else}
                <img class='player__img' alt="{player.playerFullName} photo" src="{player.playerImage}" /> 
                <p class='player__name'>{player.playerFullName}</p>
                <div class='player__colors'>
                    <div class='player__color'>
                        <span class='player__color-label' style={'--color: ' + (isSplit ? mergedColors[i * 2] : colors[i])}></span>
                        {#if isSplit}
                            {#if appState.selectedSplitStat === "home"}
                                Away
                            {:else if appState.selectedSplitStat === "win"}
                                Loss
                            {:else}
                                &lt; {appState.selectedSplitVal}
                            {/if}
                        {/if}
                    </div>
                    {#if isSplit}
                        <div class='player__color'>
                            <span class='player__color-label' style={'--color: ' + mergedColors[i * 2 + 1]}></span>
                            {#if isSplit}
                                {#if appState.selectedSplitStat === "home"}
                                    Home
                                {:else if appState.selectedSplitStat === "win"}
                                    Win
                                {:else}
                                    {appState.selectedSplitVal}+
                                {/if}
                            {/if}
                        </div>
                    {/if}
                </div>
                <button class='player__delete' data-index={i} on:click={onDeletePlayer}>
                    <DeleteIcon />
                </button>
                <button class='player__edit' data-index={i} on:click={onEditPlayer}>
                    <EditIcon />
                </button>
            {/if}
        </div>
    {/each}
    {#if !players || players.length < appState.maxSelectedPlayers}
        <div class='player'>
            {#if appState.loading && players && appState.loadingIndex == players.length}
                <Loading />
            {:else}
                <button on:click={onAddPlayer} class='add-player-btn'>+</button>
            {/if}
        </div>
    {/if}
</div>

<style lang='scss'>
    .players {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 0.25em;
        justify-content: space-between;
    }
    .player {
        position: relative;
        overflow: hidden;
        border-radius: 8px;
        border: 2px solid black;
        margin: 0.5em;
        font-size: 12px;
        color: white;
        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
        height: 120px;
    }
    .player__colors {
        width: 100%;
        position: absolute;
        top: 5px;
        left: 5px;
        display: inline-flex;
        flex-direction: column;
    }
    .player__img {
        width: 120px;
        height: auto;
        max-width: 100%;
        margin: 0 auto;
        display: block;
    }
    .player__name {
        margin: 0;
        position: absolute;
        width: 100%;
        bottom: 5px;
        left: 5px;
    }

    .player__color-label {
        width: 12px; 
        height: 12px;
        display: inline-block;
        margin: 0 4px 0 0;
        background: var(--color);
        border-radius: 12px;
    }

    .player__delete, .player__edit {
        border: 0;
        width: 20px;
        height: 20px;
        position: absolute;
        right: 3px;
        border: 1px solid black;
        border-radius: 4px;
        background: white;
    }
    .player__edit { top: 3px; }
    .player__delete { top: 28px; }
    .player__delete :global(svg), .player__edit :global(svg) {
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .add-player-btn {
        width: 100%;
        height: 120px;
        max-width: 100%;
        cursor: pointer;
        display: block;
        text-transform: none;
        border: 0;
        margin: 0;
        appearance: none;
        touch-action: manipulation; 
        font-size: 40px;
        color: white;
        font-weight: bold;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-image: url(data:image/jpeg;base64,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);
    }
</style>
