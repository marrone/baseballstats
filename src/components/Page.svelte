<script lang='ts'>
    import { type Player } from "../scripts/types";
    import { type Action } from "../scripts/Action";

    export let loading:boolean = false;
    export let selectedPlayer = 0;
    export let players:Player[] | null = null;
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
