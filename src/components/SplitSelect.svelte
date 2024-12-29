<script lang='ts'>
    /**
    * This component renders the UI for selecting the stat category to split on
    */

    export let appState:AppState;

    import { createSplitStatChangeAction } from "../scripts/Action";
    import { SPLIT_CATS, RATE_CATS } from "../scripts/const/stats";
    import { extent } from 'd3-array';

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
    let debounceTimeout = 0;
    function handleRangeInput(ev:Event) { 
        clearTimeout(debounceTimeout);
        let targ = ev.target;
        if(!targ || !(targ instanceof HTMLInputElement) || !targ.parentNode) { return; }

        let parentStyle = (targ.parentNode as HTMLElement).style;
        parentStyle.setProperty('--value', targ.value); 
        parentStyle.setProperty('--text-value', ">= " + targ.value);

        selectedSplitVal = parseFloat(targ.value);
        debounceTimeout = setTimeout(() => {
            appState.publishEvent(createSplitStatChangeAction({stat:selectedSplitStat, splitVal:selectedSplitVal}));
        }, 50);
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
    <div 
        class="range-slider" 
        style={`--min:${range[0]}; --max:${range[1]}; --step=${splitStep}; --value:${selectedSplitVal}; --text-value:">= ${selectedSplitVal}"`}>
        <input 
             type="range" 
             min="{range[0]}" 
             max="{range[1]}" 
             step="{splitStep}" 
             value="{selectedSplitVal}" 
             on:input={handleRangeInput}/>
        <output></output>
        <div class='range-slider__progress'></div>
    </div>
{/if}

<style lang='scss'>
/* range slider styles based on: https://codepen.io/vsync/pen/mdEJMLv */
.range-slider {
    --primary-color: #0366d6;

    --value-offset-y: var(--ticks-gap);
    --value-active-color: white;
    --value-background: transparent;
    --value-background-hover: var(--primary-color);
    --value-font: 700 12px/1 Arial;

    --fill-color: var(--primary-color);
    --progress-background: #eee;
    --progress-radius: 20px;
    --track-height: calc(var(--thumb-size) / 2);

    --min-max-font: 12px Arial;
    --min-max-opacity: 0.5;
    --min-max-x-offset: 10%; // 50% to center

    --thumb-size: 22px;
    --thumb-color: white;
    --thumb-shadow: 0 0 3px rgba(0, 0, 0, 0.4), 
        0 0 1px rgba(0, 0, 0, 0.5) inset,
        0 0 0 99px var(--thumb-color) inset;

    --thumb-shadow-active: 0 0 0 calc(var(--thumb-size) / 4) inset var(--thumb-color),
        0 0 0 99px var(--primary-color) inset, 
        0 0 3px rgba(0, 0, 0, 0.4);

    --thumb-shadow-hover: var(--thumb-shadow);

    --ticks-thickness: 1px;
    --ticks-height: 5px;
    --ticks-gap: var(--ticks-height, 0);
    --ticks-color: silver;

    --step: 1;
    --ticks-count: Calc(var(--max) - var(--min)) / var(--step);
    --maxTicksAllowed: 30;
    --too-many-ticks: Min(1, Max(var(--ticks-count) - var(--maxTicksAllowed), 0));
    /* manipulate the number of steps if too many ticks exist, so there would only be 2 */
    --x-step: Max(var(--step), var(--too-many-ticks) * (var(--max) - var(--min))); 
    --tickInterval: 100/ ((var(--max) - var(--min)) / var(--step)) * var(--tickEvery, 1);
    --tickIntervalPerc: calc((100% - var(--thumb-size)) / ((var(--max) - var(--min)) / var(--x-step)) * var(--tickEvery, 1));

    /* default value ("--value" is used in single-range markup) */
    --value-a: Clamp(var(--min), var(--value, 0), var(--max)); 
    --value-b: var(--value, 0); // default value
    --text-value-a: var(--text-value, "");

    --completed-a: calc((var(--value-a) - var(--min)) / (var(--max) - var(--min)) * 100);
    --completed-b: calc((var(--value-b) - var(--min)) / (var(--max) - var(--min)) * 100);
    --ca: Min(var(--completed-a), var(--completed-b));
    --cb: Max(var(--completed-a), var(--completed-b));

    /*  breakdown of the below super-complex brain-breaking CSS math:
        "clamp" is used to ensure either "-1" or "1"
        "calc" is used to inflat the outcome into a huge number, to get rid of any value between -1 & 1
        if absolute diff of both completed % is above "5" (%)
        ".001" bumps the value just a bit, to avoid a scenario where calc resulted in "0" (then clamp will also be "0")
     */
    --thumbs-too-close: Clamp(-1, 1000 * (Min(1, Max(var(--cb) - var(--ca) - 5, -1)) + 0.001), 1);
    --thumb-close-to-min: Min(1, Max(var(--ca) - 2, 0)); // 2% threshold
    --thumb-close-to-max: Min(1, Max(98 - var(--cb), 0)); // 2% threshold

    @mixin thumb {
        appearance: none;
        height: var(--thumb-size);
        width: var(--thumb-size);
        transform: var(--thumb-transform);
        border-radius: var(--thumb-radius, 50%);
        background: var(--thumb-color);
        box-shadow: var(--thumb-shadow);
        border: none;
        pointer-events: auto;
        transition: 0.1s;
    }

    display: inline-block;
    width: 200px;
    height: Max(var(--track-height), var(--thumb-size));
    margin: 1.5em 0 0 0;

    position: relative;
    top: 7px;
    z-index: 1;

    &__progress {
        --start-end: calc(var(--thumb-size) / 2);
        --clip-end: calc(100% - (var(--cb)) * 1%);
        --clip-start: calc(var(--ca) * 1%);
        --clip: inset(-20px var(--clip-end) -20px var(--clip-start));
        position: absolute;
        left: var(--start-end);
        right: var(--start-end);
        top: calc(
            var(--ticks-gap) * var(--flip-y, 0) + var(--thumb-size) / 2 -
            var(--track-height) / 2
                );
        height: calc(var(--track-height));
        background: var(--progress-background, #eee);
        pointer-events: none;
        z-index: -1;
        border-radius: var(--progress-radius);

        /* fill area */
        &::before {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            clip-path: var(--clip);
            top: 0;
            bottom: 0;
            background: var(--fill-color, black);
            box-shadow: var(--progress-flll-shadow);
            z-index: 1;
            border-radius: inherit;
        }

        /* shadow-effect */
        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            box-shadow: var(--progress-shadow);
            pointer-events: none;
            border-radius: inherit;
        }
    }

    & > input {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: var(--thumb-size);
        margin: 0;
        position: absolute;
        left: 0;
        top: calc(
            50% - Max(var(--track-height), var(--thumb-size)) / 2 +
            calc(var(--ticks-gap) / 2 * var(--flip-y, -1))
            );
        cursor: -webkit-grab;
        cursor: grab;
        outline: none;
        background: none;

        &:not(:only-of-type) {
            pointer-events: none;
        }

        &::-webkit-slider-thumb {
            @include thumb;
        }
        &::-moz-range-thumb {
            @include thumb;
        }
        &::-ms-thumb {
            @include thumb;
        }

        &:hover {
            --thumb-shadow: var(--thumb-shadow-hover);
            & + output {
                --value-background: var(--value-background-hover);
                --y-offset: -5px;
                color: var(--value-active-color);
                box-shadow: 0 0 0 3px var(--value-background);
            }
        }

        &:active {
            --thumb-shadow: var(--thumb-shadow-active);
            cursor: grabbing;
            z-index: 2; // when sliding left thumb over the right or vice-versa, make sure the moved thumb is on top
                + output {
                transition: 0s;
            }
        }

        &:nth-of-type(1) {
            --is-left-most: Clamp(0, (var(--value-a) - var(--value-b)) * 99999, 1);
            & + output {
                &:not(:only-of-type) {
                    --flip: calc(var(--thumbs-too-close) * -1);
                }

                --value: var(--value-a);
                --x-offset: calc(var(--completed-a) * -1%);
                &::after {
                    content: var(--prefix, "") var(--text-value-a) var(--suffix, "");
                }
            }
        }

        &:nth-of-type(2) {
            --is-left-most: Clamp(0, (var(--value-b) - var(--value-a)) * 99999, 1);
            & + output {
                --value: var(--value-b);
            }
        }

        // non-multiple range should not clip start of progress bar
            &:only-of-type {
            ~ .range-slider__progress {
                --clip-start: 0;
            }
        }

        & + output {
            --flip: -1;
            --x-offset: calc(var(--completed-b) * -1%);
            --pos: calc(((var(--value) - var(--min)) / (var(--max) - var(--min))) * 100%);

            white-space: nowrap;
            pointer-events: none;
            position: absolute;
            z-index: 5;
            background: var(--value-background);
            border-radius: 10px;
            padding: 2px 4px;
            left: var(--pos);
            transform: translate(
                var(--x-offset),
                calc(150% * var(--flip) - (var(--y-offset, 0px) + var(--value-offset-y)) * var(--flip)));
            transition: all 0.12s ease-out, left 0s;

            &::after {
                content: var(--prefix, "") var(--text-value-b) var(--suffix, "");
                font: var(--value-font);
            }
        }
    }
}
</style>
