<script lang='ts'>
    /**
    * This component renders the UI for selecting the stat category to split on
    */

    export let appState:AppState;

    import { createSplitStatChangeAction } from "../scripts/Action";
    import { SPLIT_CATS, RATE_CATS } from "../scripts/const/stats";
    import { extent } from 'd3-array';
    import RangeSlider from "./RangeSlider.svelte";

    let selectedSplitStat = appState.selectedSplitStat;
    let selectedSplitVal = appState.selectedSplitVal;
    let getStep = () => selectedSplitStat && (RATE_CATS as readonly string[]).indexOf(selectedSplitStat) >= 0 ? .01 : 1;
    let splitStep = getStep();
    let range:[any, any] = [0,0];
    $: {
        // when the selected split stat changes, we need to recompute the threshold value range
        // based on the value range of the player stats for that selected stat category
        if(selectedSplitStat) { 
            range = [0,0];
            if(appState.playerStats.length > 0) {
                appState.playerStats.forEach(statsCollection => {
                    let extents = extent<PlayerStats,number>(
                        statsCollection.toArray(), 
                        (d:PlayerStats) => Number(d[appState.selectedSplitStat]));
                    range[0] = Math.min(range[0], extents[0]!);
                    range[1] = Math.max(range[1], extents[1]!);
                });
            }
            splitStep = getStep();
        }
    }
    
    function isBoolStat(selectedSplitStat:SplitStatCat) {
        return selectedSplitStat 
            && appState.playerStats.length > 0 
            && (typeof appState.playerStats[0].toArray()[0][selectedSplitStat]) === "boolean";
    }

    /**
     * The selected stat has changed
     */
    function onStatCatChange(ev:Event) {
        if(ev.target instanceof HTMLSelectElement) {
            let opt = ev.target.options[ev.target.selectedIndex].value;
            selectedSplitStat = opt ? opt as SplitStatCat : null;
            if(selectedSplitStat && isBoolStat(selectedSplitStat)) {
                selectedSplitVal = 1;
            }
            appState.publishEvent(createSplitStatChangeAction({stat:selectedSplitStat, splitVal:selectedSplitVal}));
        }
    }

    /**
     * The threshold value has changed. We are going to debounce it 
     * as it may change many times rapidly as the user slides the slider
     */
    function handleRangeInput(val:number) { 
        selectedSplitVal = val;
        appState.publishEvent(createSplitStatChangeAction({stat:selectedSplitStat, splitVal:selectedSplitVal}));
    }
</script>

<select name='splitstat' size='1' on:change={onStatCatChange}>
    <option value="">-- Split --</option>
    {#each SPLIT_CATS as cat (cat)}
        <option selected={cat == appState.selectedSplitStat} value="{cat}">
            {cat}
        </option>
    {/each}
</select>

{#if selectedSplitStat && !isBoolStat(selectedSplitStat)}
    <RangeSlider 
        {range} 
        step={splitStep} 
        val={selectedSplitVal} 
        textVal={""+selectedSplitVal+"+"} 
        onChange={handleRangeInput} />
{/if}
