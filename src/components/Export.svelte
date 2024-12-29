<script lang='ts'>
    /**
    * This component provide a button to download the chart as an svg image file
    */

    export let appState:AppState;

    import { onMount } from "svelte";

    let featureSupported = false;

    function onExport() {
        let svg = document.querySelector('svg.chart');
        if(!svg) { return; }
        let data = (new XMLSerializer()).serializeToString(svg);
        let svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
        let saveNode = document.createElement("a");
        saveNode.href = URL.createObjectURL(svgBlob);
        saveNode.download = "StatsChart";
        saveNode.click();
    }

    onMount(() => {
        try {
            if(typeof XMLSerializer != "undefined") {
                featureSupported = true;
            }
        } catch(err) {} // eslint-disable-line @typescript-eslint/no-unused-vars
    });
</script>

{#if featureSupported && appState.playerStats && appState.playerStats.length > 0}
    <button class='export-btn' on:click={onExport}>Export Chart Image</button>
{/if}

<style lang='scss'>
    .export-btn { margin: 1em 0 0 0; }
</style>
