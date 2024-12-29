<script lang='ts'>
    /**
    * Top level view component. Lays out the page and various components of the app
    */

    export let appState:AppState;

    import Loading from "./Loading.svelte";
    import PlayerSelect from "./PlayerSelect.svelte";
    import ChartLegend from "./ChartLegend.svelte";
    import ChartControls from "./ChartControls.svelte";
    import StatsChart from "./StatsChart.svelte";
    import Export from "./Export.svelte";
</script>

<section id='main'>
    {#if appState.loading && (!appState.playersList || appState.playersList.length === 0)}
        <Loading />
    {:else}
        <ChartLegend {appState} />
        <ChartControls {appState} />
        <StatsChart {appState} />
        <Export {appState} />
    {/if}
</section>

<PlayerSelect {appState} />

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
