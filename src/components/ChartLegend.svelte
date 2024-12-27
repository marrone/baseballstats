<script lang='ts'>
    export let appState:AppState;
    
    import { colors, mergedColors } from "../scripts/const/colors";

    $: isSplit = appState.selectedSplitStat;
    $: player = appState.players && appState.selectedPlayerId ? appState.players[appState.selectedPlayerId] : null;
</script>

<div class='players'>
    {#if player}
        <div class='player'>
            <img 
                class='player__img' 
                alt="{player.playerFullName} photo" 
                src="{player.playerImage}" /> 
            <p class='player__name'>{player.playerFullName}</p>
            <div class='player__colors'>
                <div class='player__color'>
                    <span class='player__color-label' style={'--color: ' + (isSplit ? mergedColors[0] : colors[0])}></span>
                    {#if isSplit}
                        {#if appState.selectedSplitStat === "home"}
                            Away
                        {:else if appState.selectedSplitStat === "win"}
                            Loss
                        {:else}
                            %lt; {appState.selectedSplitVal}
                        {/if}
                    {/if}
                </div>
                {#if isSplit}
                    <div class='player__color'>
                        <span class='player__color-label' style={'--color: ' + mergedColors[1]}></span>
                        {#if isSplit}
                            {#if appState.selectedSplitStat === "home"}
                                Home
                            {:else if appState.selectedSplitStat === "win"}
                                Win
                            {:else}
                                %gt;= {appState.selectedSplitVal}
                            {/if}
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style lang='scss'>
    .players {
        display: flex;
        gap: 1em;
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
        height: 120px;
        margin: 0;
        display: block;
    }
    .player__name {
        margin: 0;
        position: absolute;
        width: 100%;
        bottom: 5px;
        left: 5px;
    }

    /*
    .player__color {
    }
    */
    .player__color-label {
        width: 12px; 
        height: 12px;
        display: inline-block;
        margin: 0 4px 0 0;
        background: var(--color);
        border-radius: 12px;
    }
</style>
