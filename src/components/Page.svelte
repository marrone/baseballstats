<script lang='ts'>
    export let appState:AppState;

    import Loading from "./Loading.svelte";
    import PlayerSelect from "./PlayerSelect.svelte";
    import ChartLegend from "./ChartLegend.svelte";
    import ChartControls from "./ChartControls.svelte";
    import StatsChart from "./StatsChart.svelte";
</script>

<section id='main'>
    {#if appState.loading}
        <Loading />
    {:else}
        <PlayerSelect {appState} />
        {#if appState.playerStats}
            <ChartLegend {appState} />
            <ChartControls {appState} />
            <StatsChart {appState} />
        {/if}
    {/if}
</section>

<style lang="scss">
    :global(body) {
        padding: 50px 0 0 0;
        text-align: center;
    }
    #main {
        max-width: 800px;
        margin: auto;
        text-align: left;
    }
</style>
