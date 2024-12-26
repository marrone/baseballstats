<script lang='ts'>
    export let appState:AppState;

    import { createStatCatChangeAction } from "../scripts/Action";
    import { GRAPH_CATS } from "../scripts/const/stats";

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
