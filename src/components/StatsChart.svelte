<script lang='ts'>
    /**
    * This component renders the graph
    */

    export let appState:AppState;

    import { bisector, max } from 'd3-array';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { line, curveMonotoneX } from 'd3-shape';
    import { format } from "d3-format";
    import Line from './charts/Line.svelte';
    import Axis from './charts/Axis.svelte';
    import Grid from './charts/Grid.svelte';
    import Tooltip from "./charts/Tooltip.svelte";
    import RangeSlider from "./RangeSlider.svelte";
    import { RATE_CATS } from "../scripts/const/stats";
    import { colors, mergedColors } from "../scripts/const/colors";
    import { formatDate } from "../scripts/util";

    // dimensions of our chart
    let dimensions = {
        width: 800,
        height: 500,
        margins: {top: 20, right: 20, bottom: 20, left: 50},
        innerHeight: 460,
        innerWidth: 730,
    };

    // reactively compute the rolling stats to graph
    $: isSplit = !!appState.selectedSplitStat;
    let rollingStats:PlayerStats[][] = [];
    $: {
        if(appState.playerStats.length > 0) { 
            let statsCollections = appState.playerStats;
            if(appState.selectedSplitStat) { 
                statsCollections = appState.playerStats
                    .flatMap(s => s.split(appState.selectedSplitStat!, appState.selectedSplitVal));
            }
            rollingStats = statsCollections.map(s => s.rollingAvg(appState.paCount).toArray());
        }
        else { 
            rollingStats = [];
        }
    }

    // our graphing functions for what to graph, scale, and format
    let xAccessor = (stats: PlayerStats):number => (new Date(stats.date)).getTime();
    let yAccessor = (stats: PlayerStats):number => stats[appState.selectedStat] as number; 
    let decimalFormat = format(".3f");
    let rateFormat = (d:any) => decimalFormat(d).replace(/^0/,'');
    $: yFormat = RATE_CATS.indexOf(appState.selectedStat) >= 0 ? rateFormat : (d: any) => d;
    $: xDomain = [rollingStats.length ? Math.min(...rollingStats.map(r => r.length ? xAccessor(r[0]) : 0)) : 0,
                  rollingStats.length ? Math.max(...rollingStats.map(r => r.length ? xAccessor(r[r.length-1]) : 0)) : 0];
    $: xScale = scaleLinear().domain(xDomain).range([0, dimensions.innerWidth]).clamp(true);
    $: yDomain = [0, Math.max(...rollingStats.map(r => r.length ? max(r, yAccessor)! : 0))];
    $: yScale = scaleLinear().domain(yDomain).range([dimensions.innerHeight, 0]).nice();

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
        let tooltipStats = rollingStats.filter(r => r.length > 0).map(r => r[bisect(r, xScaleInvert, 0)]);
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

    // marker line
    let markerTimestamp = 0;
    let markerDateString = "";
    let markerLine = "";
    const markerColor = "#464040";
    function handleMarkerChange(val:number) {
        markerTimestamp = val;
        if(markerTimestamp <= xDomain[0] || markerTimestamp >= xDomain[1]) { 
            markerTimestamp = 0; 
            markerDateString = "";
            markerLine = "";
        }
        else { 
            markerDateString = formatDate(markerTimestamp);
            let markerLineRenderer = line<number>()
                .x((d:number) => xScale(d))
                .y((d:number, i:number) => i * dimensions.innerHeight);
            markerLine = markerLineRenderer([markerTimestamp, markerTimestamp]) as string;
        }
    }
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
                {#if markerLine}
                    <path d={markerLine} stroke="{markerColor}" stroke-width="1" stroke-dasharray="35,10" />
                {/if}
                {#each rollingStats as lineStats, index (lineStats.length ? lineStats[lineStats.length-1].uid : index)}
                    <Line path={chartLine(lineStats)} color={isSplit ? mergedColors[index] : colors[index]} />
                {/each}
                <Axis orientation="y" scale={yScale} formatTick={yFormat} {dimensions} />
                {#if tooltip.stats}
					{#each tooltip.stats as toolStats, i}
                        {#if toolStats}
                            <circle
                                cx={xScale(xAccessor(toolStats))}
                                cy={yScale(yAccessor(toolStats))}
                                r={5}
                                fill={isSplit ? mergedColors[i] : colors[i]}
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
            <Tooltip 
                {...tooltip} 
                colors={isSplit ? mergedColors : colors}
                selectedStat={appState.selectedStat} 
                {yFormat} 
                {yAccessor} />
        {/if}
	</div>

    {#if rollingStats && rollingStats.length}
        <div class='marker-slider'>
            <RangeSlider 
                range={xDomain}
                step={60*60*24*1000} 
                val={markerTimestamp} 
                textVal={markerDateString} 
                color={markerColor}
                onChange={handleMarkerChange} />
            <span class='marker-slider__info'>Optionally mark a date</span>
        </div>
    {/if}
</div>

<style lang="scss">
    .chart-container {
        position: relative;
    }
    .chart {
        width: 100%;
        height: 100%;
        max-width: var(--chart-max-width);
        max-height: var(--char-max-height);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        font-size: 12px;
    }

    .marker-slider__info {
        margin: 1em 0 0;
        display: block;
        font-size: 12px;
    }
</style>
