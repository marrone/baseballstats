<script lang='ts'>
    /**
    * This component represents a generic styled range slider element
    */

    export let range:number[] = [0,1];
    export let step:number = 1;
    export let val:number = 0;
    export let textVal:string = "";
    export let onChange:(val:number)=>void = ()=>{};
    export let color = "#0366d6";

    /**
     * The range value has changed. We are going to debounce it 
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

        debounceTimeout = setTimeout(() => {
            onChange(parseFloat(targ.value));
        }, 50);
    }
</script>

<div 
    class="range-slider" 
    style={`--min:${range[0]}; --max:${range[1]}; --step=${step}; --value:${val}; --text-value:"${textVal}"; --primary-color:${color}`}>
    <input 
         type="range" 
         min="{range[0]}" 
         max="{range[1]}" 
         step="{step}" 
         value="{val}" 
         on:input={handleRangeInput}/>
    <output></output>
    <div class='range-slider__progress'></div>
</div>

<style lang='scss'>
    /* range slider styles based on: https://codepen.io/vsync/pen/mdEJMLv */
    .range-slider {
        --primary-color: #0366d6;

        --value-offset-y: var(--ticks-gap);
        --value-active-color: white;
        --value-background: transparent;
        --value-background-hover: var(--primary-color);
        --value-font: 700 12px/1 arial;

        --fill-color: var(--primary-color);
        --progress-background: #eee;
        --progress-radius: 20px;
        --track-height: calc(var(--thumb-size) / 2);

        --min-max-font: 12px arial;
        --min-max-opacity: 0.5;
        --min-max-x-offset: 10%; 

        --thumb-size: 22px;
        --thumb-color: white;
        --thumb-shadow: 0 0 3px rgba(0, 0, 0, 0.4), 
            0 0 1px rgba(0, 0, 0, 0.5) inset,
            0 0 0 99px var(--thumb-color) inset;

        --thumb-shadow-active: 0 0 0 calc(var(--thumb-size) / 4) inset var(--thumb-color), 0 0 0 99px var(--primary-color) inset, 0 0 3px rgba(0, 0, 0, 0.4);

        --thumb-shadow-hover: var(--thumb-shadow);

        --ticks-thickness: 1px;
        --ticks-height: 5px;
        --ticks-gap: var(--ticks-height, 0);
        --ticks-color: silver;

        --step: 1;
        --ticks-count: calc(var(--max) - var(--min)) / var(--step);
        --maxTicksAllowed: 30;
        --too-many-ticks: min(1, max(var(--ticks-count) - var(--maxTicksAllowed), 0));
        /* manipulate the number of steps if too many ticks exist, so there would only be 2 */
        --x-step: max(var(--step), var(--too-many-ticks) * (var(--max) - var(--min))); 
        --tickInterval: 100 / ((var(--max) - var(--min)) / var(--step)) * var(--tickEvery, 1);
        --tickIntervalPerc: calc((100% - var(--thumb-size)) / ((var(--max) - var(--min)) / var(--x-step)) * var(--tickEvery, 1));

        /* default value ("--value" is used in single-range markup) */
        --value-a: clamp(var(--min), var(--value, 0), var(--max)); 
        --value-b: var(--value, 0); 
        --text-value-a: var(--text-value, "");

        --completed-a: calc((var(--value-a) - var(--min)) / (var(--max) - var(--min)) * 100);
        --completed-b: calc((var(--value-b) - var(--min)) / (var(--max) - var(--min)) * 100);
        --ca: min(var(--completed-a), var(--completed-b));
        --cb: max(var(--completed-a), var(--completed-b));

        --thumbs-too-close: clamp(-1, 1000 * (min(1, max(var(--cb) - var(--ca) - 5, -1)) + 0.001), 1);
        --thumb-close-to-min: min(1, max(var(--ca) - 2, 0)); 
        --thumb-close-to-max: min(1, max(98 - var(--cb), 0)); 

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
        width: 100%;
        max-width: 100%;
        height: max(var(--track-height), var(--thumb-size));
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
            top: calc(var(--ticks-gap) * var(--flip-y, 0) + var(--thumb-size) / 2 - var(--track-height) / 2);
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
            top: calc(50% - max(var(--track-height), var(--thumb-size)) / 2 + calc(var(--ticks-gap) / 2 * var(--flip-y, -1)));
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
                z-index: 2; 
                + output {
                    transition: 0s;
                }
            }

            &:nth-of-type(1) {
                --is-left-most: clamp(0, (var(--value-a) - var(--value-b)) * 99999, 1);
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
                --is-left-most: clamp(0, (var(--value-b) - var(--value-a)) * 99999, 1);
                & + output {
                    --value: var(--value-b);
                }
            }

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
