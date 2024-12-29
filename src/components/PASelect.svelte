<script lang='ts'>
    /**
    * This component renders the UI control for selecting the PA count
    * used for the computing the rolling average
    */

    export let appState:AppState;

    import { createPACountChangeAction } from "../scripts/Action";

    /**
     * The selected PA count value has changed
     */
    function onPACountChange(ev:Event) {
        if(ev.target instanceof HTMLSelectElement) {
            let paCount:number = parseInt(ev.target.options[ev.target.selectedIndex].value)!;
            appState.publishEvent(createPACountChangeAction({paCount}));
        }
    }

    const options = [50, 100, 200];
</script>

<select name='paCount' size='1' on:change={onPACountChange}>
    {#each options as paCount (paCount)}
        <option selected={paCount == appState.paCount} value="{paCount}">
            {paCount} PA
        </option>
    {/each}
</select>
