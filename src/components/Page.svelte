<script lang='ts'>
    export let loading:boolean = false;
    export let selectedPlayer:number = 0;
    export let players:PlayerMap | null = null;
    export let publishEvent:((event:Action) => void) = (ev:Action) => {};

    import Loading from "./Loading.svelte";
    import PlayerSelect from "./PlayerSelect.svelte";
</script>

{#if loading}
    <Loading />
{:else}
    <PlayerSelect {selectedPlayer} {players} {publishEvent} />
{/if}

<style lang="scss">
</style>
