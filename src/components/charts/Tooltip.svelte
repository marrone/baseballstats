<script lang="ts">
    /**
    * This component renders the chart tooltip when mousing over a node on the lines
    */

    export let left = 0;
    export let top = 0;
    export let offsetX = 30;
    export let offsetY = -10;
    export let selectedStat:string;
    export let stats:PlayerStats[] | null;
    export let yFormat: any;
    export let yAccessor: any;
    export let colors:string[];

    import { fade } from 'svelte/transition';
    import { formatDate } from "../../scripts/util";
</script>

{#if stats}
    <div in:fade class="chart-tooltip" style="top: {top + offsetY}px; left: {left + offsetX}px;">
        {#if stats && stats.length > 0 && stats[0]}
            <p class="chart-tooltip__label">
                Last Date: {formatDate(stats[0].date)}
            </p>
        {/if}
        <div class="chart-tooltip__body">
            <ul class="chart-tooltip__info">
                {#each stats as lineStats, i}
                    {#if lineStats}
                        <li>
                            <span class='chart-tooltip__color' style={'--color: ' + colors[i]}></span>
                            {lineStats.playerFullName}
                            {selectedStat}: 
                            {yFormat(yAccessor(lineStats))} ({lineStats.PA} PA)
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
    </div>
{/if}

<style>
    .chart-tooltip {
        position: absolute;
        z-index: 2;
        left: 50%;
        top: 50%;
        background: #ffffef;
        border-radius: 4px;
        transform: translate3d(0, -100%, 0);
        transition: top 0.3s ease-out, left 0.3s ease-out;
        transition-delay: 50ms;
        pointer-events: none;
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        padding: 0.5em;
    }
    .chart-tooltip__label {
        font-weight: bold;
    }
    .chart-tooltip__info {
        list-style: none;
        display: block;
        margin: 0 0 1em;
        padding: 0;
        font-size: 12px;
    }
    .chart-tooltip__color {
        width: 12px; 
        height: 12px;
        display: inline-block;
        margin: 0 4px 0 0;
        background: var(--color);
        border-radius: 12px;
    }
</style>
