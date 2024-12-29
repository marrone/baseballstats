<script lang="ts">
    /**
    * This component handles rendering the horizontal grid lines on the chart
    */

    export let scale: any;
    export let numberOfTicks = 4;
    export let stroke = 'rgba(0,0,0,0.2)';
    export let strokeWidth = 2;
    export let dimensions = {innerHeight: 0, innerWidth: 0};

    $: ticks = scale.ticks(numberOfTicks);
</script>

<g class="chart-grid chart-grid--y" transform={`translate(0, 0)`}>
	{#each ticks as tick}
		<line
            transform={`translate(0, ${scale(tick)})`}
			y2="0"
			x2={dimensions.innerWidth}
			stroke-width={strokeWidth}
			{stroke} />
	{/each}
</g>
