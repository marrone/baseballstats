<script lang='ts'>
    /**
     * This component renders the chart controls that the user uses to
     * configure what to graph including the selected stat, the PA count and spit stat
     */

    export let appState:AppState;

    import StatSelect from "./StatSelect.svelte";
    import SplitSelect from "./SplitSelect.svelte";
    import PASelect from "./PASelect.svelte";
</script>

{#if appState.playerStats}
    <div id='chart-controls'>
        <div class='control'>
            <p class='control__label'>Graph Stat:</p>
            <StatSelect {appState} />
        </div>
        <div class='control'>
            <p class='control__label'>Rolling Avg On:</p>
            <PASelect {appState} />
        </div>
        <div class='control'>
            <p class='control__label'>Split Stat:</p>
            <SplitSelect {appState} />
        </div>
    </div>
{/if}

<style lang="scss">
    #chart-controls {
        margin: 1em 0;
        align-content: end;
        display: flex;
        gap: 1em;
        justify-content: space-between;
    }
    .control {
        border: 1px solid gray;
        border-radius: 8px;
        position: relative;
        flex-basis: 33%;
        align-content: center;
        text-align: center;
        min-height: 106px;
    }
    .control__label {
        position: absolute;
        width: auto;
        left: 50%;
        top: -1em;
        background: white;
        text-align: center;
        transform: translate3d(-50%,0,0);
        padding: 4px;
        margin: 0;
        white-space: nowrap;
        font-size: 12px;
    }
</style>
