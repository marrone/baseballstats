<script lang='ts'>
    export let appState:AppState;

    import { extent, group, bisector, max } from 'd3-array';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { line, curveMonotoneX } from 'd3-shape';
    import { format } from "d3-format";
    import Line from './charts/Line.svelte';
    import Axis from './charts/Axis.svelte';
    import Grid from './charts/Grid.svelte';
    import Tooltip from "./charts/Tooltip.svelte";
    import { RATE_CATS } from "../scripts/const/stats";

    let colors = ['#1571fe', '#008800', '#93A893'];
    let dimensions = {
        width: 800,
        height: 500,
        margins: {top: 20, right: 20, bottom: 20, left: 50},
        innerHeight: 460,
        innerWidth: 730,
    };

    let rollingStats:PlayerStats[] = [];
    $: rollingStats = appState.playerStats?.rollingAvg(appState.paCount).toArray() || [];

    let xAccessor = (stats: PlayerStats):number => (new Date(stats.date)).getTime();
    let yAccessor = (stats: PlayerStats):number => stats[appState.selectedStat] as number; 
    $: yFormat = RATE_CATS.indexOf(appState.selectedStat) >= 0 ? format(".3f") : (d: any) => d;
    $: xScale = scaleLinear()
              .domain([xAccessor(rollingStats[0]), xAccessor(rollingStats[rollingStats.length-1])])
              .range([0, dimensions.innerWidth])
              .clamp(true);
    $: yScale = scaleLinear()
              .domain([0, max(rollingStats, yAccessor)!])
              .range([dimensions.innerHeight, 0])
              .nice();

    function chartLine(lineStats: PlayerStats[]):string {
        let lineRenderer = line<PlayerStats>()
            .x((d:PlayerStats) => xScale(xAccessor(d)))
            .y((d:PlayerStats) => yScale(yAccessor(d)))
            .curve(curveMonotoneX)
        return lineRenderer(lineStats) as string;
    }

	// tooltip
    $: tooltip = {left: 0, top: 0, stats: null};
    $: bisect = bisector<PlayerStats, number>(xAccessor).left;
    let handleMouseOver = (event: MouseEvent) => {
        let xInverted = xScale.invert(event.offsetX - dimensions.margins.left);
        let tooltipStats = rollingStats[bisect(rollingStats, xInverted, 0)];
        tooltip.stats = tooltipStats;
        tooltip.left = xScale(xAccessor(tooltipStats)) + dimensions.margins.left;
        tooltip.top = yScale(yAccessor(tooltipStats)) - 10;
    };
    let handleMouseLeave = () => { tooltip.stats = null; };
    //let handleMouseLeave = () => {};
</script>

<div class="chart-container">
    <div class="chart-body">
        <svg 
            class="chart" 
            style={`--chart-max-width: ${dimensions.width}px; --chart-max-height: ${dimensions.height}px;`}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet">
            <g transform={`translate(${dimensions.margins.left}, ${dimensions.margins.top})`}>
                <Grid scale={yScale} {dimensions} />
                <Line path={chartLine(rollingStats)} color={colors[0]} />
                <Axis orientation="y" scale={yScale} formatTick={yFormat} {dimensions} />
                {#if tooltip.stats}
                    <circle
                        cx={xScale(xAccessor(tooltip.stats))}
                        cy={yScale(yAccessor(tooltip.stats))}
                        r={5}
                        fill={colors[0]}
                        stroke="black" />
                {/if}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                <rect
                    width={dimensions.innerWidth}
                    height={dimensions.innerHeight}
                    on:mousemove={handleMouseOver}
                    on:mouseleave={handleMouseLeave}
                    fill="transparent" />
            </g>
        </svg>
        {#if tooltip.stats}
            <Tooltip {...tooltip} selectedStat={appState.selectedStat} {yFormat} {yAccessor} />
        {/if}
	</div>
</div>

<style lang="scss">
    .chart {
        width: 100%;
        height: 100%;
        max-width: var(--chart-max-width);
        max-height: var(--char-max-height);
    }

</style>
