<script lang='ts'>
    export let appState:AppState;

    import { extent, group, bisector, max } from 'd3-array';
    import { scaleLinear, scaleOrdinal } from 'd3-scale';
    import { line, curveMonotoneX } from 'd3-shape';
    import { format } from "d3-format";
    import Line from './charts/Line.svelte';
    import Axis from './charts/Axis.svelte';
    import Grid from './charts/Grid.svelte';
    import { RATE_CATS } from "../scripts/const/stats";

    let colorPalette = ['#34d399', '#C1EEFF', '#FCD757'];
    let dimensions = {
        width: 800,
        height: 600,
        margins: {top: 20, right: 20, bottom: 30, left: 50},
        innerHeight: 760,
        innerWidth: 720,
    };

    let avgStats:PlayerStats[] = [];
    $: avgStats = appState.playerStats?.rollingAvg(100).toArray() || [];

    let xAccessor = (stats: PlayerStats):Date => new Date(stats.date);
    let yAccessor = (stats: PlayerStats):number => stats[appState.selectedStat] as number; 
    //let xFormat = (d: any) => d;
    $: yFormat = RATE_CATS.indexOf(appState.selectedStat) >= 0 ? format(".3f") : (d: any) => d;

    $: xScale = scaleLinear()
              .domain([xAccessor(avgStats[0]), xAccessor(avgStats[avgStats.length-1])])
              .range([0, dimensions.innerWidth])
              .clamp(true);
    $: yScale = scaleLinear()
              .domain([0, max(avgStats, yAccessor)!])
              .range([dimensions.innerHeight, 0])
              .nice();

    function chartLine(lineStats: PlayerStats[]):string {
        let lineRenderer = line<PlayerStats>()
            .x((d:PlayerStats) => xScale(xAccessor(d)))
            .y((d:PlayerStats) => yScale(yAccessor(d)))
            .curve(curveMonotoneX)
        return lineRenderer(lineStats) as string;
    }

    function handleMouseOver() {}
    function handleMouseLeave() {}
</script>


<div class="chart-container">
    <div class="chart-body">
        <svg class="chart" width={dimensions.width} height={dimensions.height}>
            <g transform={`translate(${dimensions.margins.left}, ${dimensions.margins.top})`}>
                <Grid scale={yScale} {dimensions} />
                <Line path={chartLine(avgStats)} color={colorPalette[0]} />
<!--                 <Axis orientation="x" scale={xScale} formatTick={xFormat} {dimensions} /> -->
                <Axis orientation="y" scale={yScale} formatTick={yFormat} {dimensions} />
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
	</div>
</div>

<style lang="scss">
</style>
