<script lang='ts'>
    import { type Player } from "../scripts/types";

    export let loading:boolean = false;
    export let players:Player[] | null = null;
</script>

{#if loading}
    <p>Loading...</p>
{:else}
    <select name='player' size='1'>
        {#if players}
            {#each players as player (player.playerId)}
                <option value={player.playerId}>{player.playerFullName}</option>
            {/each}
        {:else}
            <p>No players retreived</p>
        {/if}
    </select>
{/if}

<style lang="scss">
    p { color: blue; }
</style>
