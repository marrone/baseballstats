<script lang="ts">
	export let left = 0;
	export let top = 0;
	export let offsetX = 10;
	export let offsetY = 10;
    export let selectedStat:string;
    export let stats:PlayerStats;
    export let yFormat: any;
    export let yAccessor: any;

	import { fade } from 'svelte/transition';
</script>

<div in:fade class="chart-tooltip" style="top: {top - offsetY}px; left: {left - offsetX}px;">
    <p class="chart-tooltip__label">
        {selectedStat}: {yFormat(yAccessor(stats))}
    </p>
    <div class="chart-tooltip__body">
        <ul class="chart-tooltip__info">
            <li>
                <span class="chart-tooltip__info-label">Last Date:</span>
                {(new Date(stats.date)).toLocaleDateString("en-US", {weekday:'short', year:'numeric', month:'short', day:'numeric'})}
            </li>
            <li>
                <span class="chart-tooltip__info-label">PA:</span>
                {stats.PA}
            </li>
        </ul>
    </div>
</div>

<style>
	.chart-tooltip {
        position: absolute;
        left: 50%;
        top: 50%;
        background: #ffffef;
        border-radius: 4px;
        transform: translate3d(-50%, -50%, 0);
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
    }
    .chart-tooltip__info-label {
        display: inline-block;
        width: 6em;
        margin: 0 8px 0 0;
    }
</style>
