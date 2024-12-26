<script lang='ts'>
    export let appState:AppState;

    import { createPlayerChangeAction } from "../scripts/Action";

    function onPlayerChanged(ev:Event) {
        let playerId = 0;
        if(ev.target instanceof HTMLSelectElement) { 
            playerId = parseInt(ev.target.options[ev.target.selectedIndex].value);
        }
        appState.publishEvent(createPlayerChangeAction({playerId}));
    }
</script>

{#if appState.players}
    <select name='player' size='1' on:change={onPlayerChanged}>
        <option value=''>-- Select Player --</option>
        {#each Object.values(appState.players) as player (player.playerId)}
            <option 
                selected={player.playerId == appState.selectedPlayerId} 
                value="{player.playerId}">
            {player.playerFullName}
            </option>
        {/each}
    </select>
{:else}
    <p>No players retreived</p>
{/if}
