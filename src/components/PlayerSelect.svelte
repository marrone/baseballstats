<script lang='ts'>
    import { type Player } from "../scripts/types";
    import { type Action } from "../scripts/Action";

    export let selectedPlayer = 0;
    export let players:Player[] | null = null;
    export let publishEvent:((event:Action) => void) = (ev:Action) => {};

    import { createPlayerChangeAction } from "../scripts/Action";

    function onPlayerChanged(ev:Event) {
        console.log("PlayerSelect onPlayerChanged", ev);
        let playerId = 0;
        if(ev.target instanceof HTMLSelectElement) { 
            playerId = parseInt(ev.target.options[ev.target.selectedIndex].value);
        }
        publishEvent(createPlayerChangeAction({playerId}));
    }

</script>

{#if players}
    <select name='player' size='1' on:change={onPlayerChanged}>
        <option value=''>-- Select Player --</option>
        {#each players as player (player.playerId)}
            <option selected={player.playerId == selectedPlayer} value={player.playerId}>{player.playerFullName}</option>
        {/each}
    </select>
{:else}
    <p>No players retreived</p>
{/if}
