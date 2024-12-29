<script lang='ts'>
    /**
    * This component renders the UI for selecting which stat to graph
    */

    export let appState:AppState;

    import { createStatCatChangeAction } from "../scripts/Action";
    import { GRAPH_CATS } from "../scripts/const/stats";

    /**
     * The selected stat has changed
     */
    function onStatCatChange(ev:Event) {
        if(ev.target instanceof HTMLSelectElement) {
            let stat:GraphableStatCat = ev.target.options[ev.target.selectedIndex].value as GraphableStatCat;
            appState.publishEvent(createStatCatChangeAction({stat}));
        }
    }
</script>

<select name='stat' size='1' on:change={onStatCatChange}>
    {#each GRAPH_CATS as cat (cat)}
        <option selected={cat == appState.selectedStat} value="{cat}">
            {cat}
        </option>
    {/each}
</select>
