<script lang='ts'>
    export let appState:AppState;

    import Loading from "./Loading.svelte";
    import PlayerSelect from "./PlayerSelect.svelte";
    import StatsChart from "./StatsChart.svelte";
    import StatSelect from "./StatSelect.svelte";
    import SplitSelect from "./SplitSelect.svelte";
    import PASelect from "./PASelect.svelte";
    import ChartLegend from "./ChartLegend.svelte";
</script>

<section id='main'>
    {#if appState.loading}
        <Loading />
    {:else}
        <PlayerSelect {appState} />
        {#if appState.playerStats}
            <ChartLegend {appState} />
            <div id='chart-controls'>
                <StatSelect {appState} />
                <PASelect {appState} />
                <SplitSelect {appState} />
            </div>
            <StatsChart {appState} />
        {/if}
    {/if}
</section>

<style lang="scss">
    :global(body) {
        padding: 100px 0 0 0;
        text-align: center;
    }
    #main {
        max-width: 800px;
        margin: auto;
        text-align: left;
    }
    #chart-controls {
        margin: 1em 0;
        align-content: end;
    }
</style>
