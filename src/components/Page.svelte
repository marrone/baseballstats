<script lang='ts'>
    export let appState:AppState;

    import Loading from "./Loading.svelte";
    import PlayerSelect from "./PlayerSelect.svelte";
    import StatsChart from "./StatsChart.svelte";
    import StatSelect from "./StatSelect.svelte";
</script>

{#if appState.loading}
    <Loading />
{:else}
    <PlayerSelect {appState} />
    {#if appState.playerStats}
        <StatSelect {appState} />
        <StatsChart {appState} />
    {/if}
{/if}

<style lang="scss">
</style>
