<script lang='ts'>
    /**
    * This component renders the player select dialog
    */

    export let appState:AppState;

    import { createPlayerChangeAction, createPlayerSelectDismissAction } from "../scripts/Action";
    import Loading from "./Loading.svelte";

    let dialog:HTMLDialogElement | null = null;

    // when the playerSelectIndex has a value, we should show the dialog
    $: if(appState.playerSelectIndex >= 0 && dialog) { dialog.showModal(); }

    /**
     * A player has been selected in the dialog
     */
    function onPlayerChanged(ev:Event) {
        let playerId = 0;
        if(ev.target instanceof HTMLInputElement) { 
            playerId = parseInt(ev.target.value);
        }
        appState.publishEvent(createPlayerChangeAction({playerId, playerIndex: appState.playerSelectIndex}));
        onCloseDialog();
    }

    /**
     * The dialog was dismissed
     */
    function onCloseDialog() {
        if(dialog) { 
            if(dialog.close) { dialog.close(); }
            else { dialog.open = false; }
        }
        appState.publishEvent(createPlayerSelectDismissAction());
    }
</script>

<dialog bind:this={dialog}>
    <button class="close-dialog" on:click={onCloseDialog}>Close</button>
    {#if appState.playersList}
        <div class='players'>
        {#each appState.playersList as player (player.playerId)}
            {#if appState.selectedPlayerIds.indexOf(player.playerId) < 0}
                <div class='player'>
                    <label class='player__label'>
                        <input 
                            class='player__input'
                            type='radio' 
                            name='player'
                            value="{player.playerId}"
                            checked={appState.selectedPlayerIds.indexOf(player.playerId) > 0} 
                            on:change={onPlayerChanged} />
                        <img 
                            loading="lazy" 
                            class='player__img' 
                            alt='{player.playerFullName} photo' 
                            src='{player.playerImage}' />
                        <span class='player__name'>
                            {player.playerFullName}
                        </span>
                    </label>
                </div>
            {/if}
        {/each}
        </div>
    {:else if appState.loading}
        <Loading />
    {/if}
</dialog>

<style lang='scss'>
    ::backdrop {
        background-image: linear-gradient(45deg, #d09f0b, dodgerblue, green);
        opacity: 0.75;
    }
    dialog { 
        position: relative; 
        width: 714px; 
        max-width: 90vw; 
        padding: 40px;
        border: 2px solid black;
        border-radius: 8px;
        box-sizing: border-box;
    }

    .close-dialog { position: absolute; right: 8px; top: 8px; }

    .players {
        max-height: 60vh;
        overflow: auto;
        padding: 1em;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5em;
    }

    .player {
        margin: 0;
        border: 1px solid black;
        border-radius: 4px;
        padding: .25em;
        overflow: hidden;
        position: relative;
        text-align: left;
    }
    .player__label {
        cursor: pointer;
    }
    .player__input {
        position: absolute;
        left: -100%;
        top: -1em;
    }
    .player__img {
        display: inline-block;
        margin: 0 0.5em 0 0;
        height: 60px;
        width: 60px;
    }
    .player__name {
        display: inline-block;
        height: 60px;
        vertical-align: text-bottom;
    }
</style>
