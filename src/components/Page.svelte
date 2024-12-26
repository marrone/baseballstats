<script lang='ts'>
    export let appState:AppState;

    import Loading from "./Loading.svelte";
    import PlayerSelect from "./PlayerSelect.svelte";
    import StatsChart from "./StatsChart.svelte";
</script>

{#if appState.loading}
    <Loading />
{:else}
    <PlayerSelect {appState} />
    <StatsChart {appState} />
{/if}

<style lang="scss">
</style>
