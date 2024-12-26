<script lang="ts">
	export let orientation = 'x';
	export let scale: any;
	export let label: string | undefined = undefined;
	export let formatTick = (d: any) => d;
	export let tickLength = 10;
	export let numberOfTicks = 4;
	export let hideAxisLine = false;
	export let hideTicks = false;
	export let tickValues: any[] = [];
	export let bottom = 0;
	export let left = 0;
	export let style = '';
    export let dimensions = {innerHeight:0, innerWidth:0};

	$: ticks = tickValues.length
		? tickValues
		: scale.ticks
		? scale.ticks(numberOfTicks)
		: scale.domain();
	$: padding = scale.bandwidth ? scale.bandwidth() / 2 : 0;
</script>

<g class="chart-axis chart-axis--{orientation}"
	transform={`translate(${left}, ${orientation == 'x' ? dimensions.innerHeight - bottom : 0})`}>
	{#if !hideAxisLine}
		<line
			class="chart-axis__line"
			x2={orientation == 'x' ? dimensions.innerWidth : 0}
			y2={orientation == 'y' ? dimensions.innerHeight : 0} />
	{/if}
	{#each ticks as tick, i}
		<g transform={`translate(${(orientation == 'x' ? [scale(tick) + padding, 0] : [0, scale(tick) + padding]).join(', ')})`}>
			<text
				class="chart-axis__tick"
				x={orientation === 'y' ? -16 : 0}
				y={orientation === 'x' ? 25 : 0}
				text-anchor={orientation == 'y' ? 'end' : 'middle'}
				alignment-baseline="middle"
				{style}>
				    {formatTick(tick)}
			</text>
			{#if !hideTicks}
                <line 
                    x2={orientation == 'x' ? 0 : -tickLength} 
                    y2={orientation == 'y' ? 0 : tickLength} />
			{/if}
		</g>
	{/each}
	{#if label}
        <text 
            class="chart-axis__label"
			text-anchor={orientation == 'y' ? 'middle' : 'middle'}
			alignment-baseline="after-edge"
            style="transform: translate({(orientation == 'x' ? [dimensions.innerWidth / 2, 60] : [0, 0]).join('px,')}px)">
			    {label}
		</text>
	{/if}
</g>
