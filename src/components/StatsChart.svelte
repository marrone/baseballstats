<script lang='ts'>
    export let appState:AppState;

    import { bisector, max } from 'd3-array';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { line, curveMonotoneX } from 'd3-shape';
    import { format } from "d3-format";
    import Line from './charts/Line.svelte';
    import Axis from './charts/Axis.svelte';
    import Grid from './charts/Grid.svelte';
    import Tooltip from "./charts/Tooltip.svelte";
    import { RATE_CATS } from "../scripts/const/stats";

    let dimensions = {
        width: 800,
        height: 500,
        margins: {top: 20, right: 20, bottom: 20, left: 50},
        innerHeight: 460,
        innerWidth: 730,
    };
    let colors = ['#1571fe', '#008800', '#93A893'];

    // reactively compute the rolling stats to graph
    let rollingStats:PlayerStats[][] = [];
    $: {
        if(appState.playerStats) { 
            let statsCollections = [appState.playerStats];
            if(appState.selectedSplitStat) { 
                statsCollections = appState.playerStats.split(appState.selectedSplitStat, appState.selectedSplitVal);
            }
            rollingStats = statsCollections.map(s => s.rollingAvg(appState.paCount).toArray()).filter(s => s.length > 0);
        }
    }

    // our graphing functions for what to graph, scale, and format
    let xAccessor = (stats: PlayerStats):number => (new Date(stats.date)).getTime();
    let yAccessor = (stats: PlayerStats):number => stats[appState.selectedStat] as number; 
    let decimalFormat = format(".3f");
    let rateFormat = (d:any) => decimalFormat(d).replace(/^0/,'');
    $: yFormat = RATE_CATS.indexOf(appState.selectedStat) >= 0 ? rateFormat : (d: any) => d;
    $: xScale = scaleLinear()
              .domain([
                    rollingStats.length ? Math.min(...rollingStats.map(r => xAccessor(r[0]))) : 0,
                    rollingStats.length ? Math.max(...rollingStats.map(r => xAccessor(r[r.length-1]))) : 0,
               ])
              .range([0, dimensions.innerWidth])
              .clamp(true);
    $: yScale = scaleLinear()
              .domain([0, Math.max(...rollingStats.map(r => max(r, yAccessor)!))])
              .range([dimensions.innerHeight, 0])
              .nice();

    // helper to produce the path string for the line in the chart
    function chartLine(lineStats: PlayerStats[]):string {
        if(lineStats.length === 0) { return ""; }
        let lineRenderer = line<PlayerStats>()
            .x((d:PlayerStats) => xScale(xAccessor(d)))
            .y((d:PlayerStats) => yScale(yAccessor(d)))
            .curve(curveMonotoneX)
        return lineRenderer(lineStats) as string;
    }

	// tooltip
    let tooltip:{left:number, top:number, stats:PlayerStats[]|null} = {left: 0, top: 0, stats: null};
    let bisect = bisector<PlayerStats, number>(xAccessor).left;
    let handleMouseOver = (event: MouseEvent) => {
        let xScaleInvert = xScale.invert(event.offsetX - dimensions.margins.left);
        let tooltipStats = rollingStats.map(r => r[bisect(r, xScaleInvert, 0)]);
        tooltip.stats = tooltipStats;
        if(!tooltip.stats || tooltip.stats.length == 0) { 
            tooltip.stats = null;
            return;
        }
        tooltip.left = xScale(xAccessor(tooltipStats.filter(s=>!!s)[0])) + dimensions.margins.left;
        tooltip.top = yScale(max(tooltipStats.filter(s=>!!s), yAccessor)!);
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
                {#each rollingStats as lineStats, index (lineStats[lineStats.length-1].uid)}
                    <Line path={chartLine(lineStats)} color={colors[index]} />
                {/each}
                <Axis orientation="y" scale={yScale} formatTick={yFormat} {dimensions} />
                {#if tooltip.stats}
					{#each tooltip.stats as toolStats, i}
                        {#if toolStats}
                            <circle
                                cx={xScale(xAccessor(toolStats))}
                                cy={yScale(yAccessor(toolStats))}
                                r={5}
                                fill={colors[i]}
                                stroke="black" />
                        {/if}
					{/each}
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
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        font-size: 12px;
    }

</style>
