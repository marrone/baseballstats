<script lang="ts">
    /**
    * This component handles rendering a line on the chart
    */

    export let path = '';
    export let color = 'black';
    export let style = '';

    import { draw } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { onMount } from 'svelte';

    let loaded = false;
    onMount(() => { loaded = true; });
</script>

{#if loaded}
    <path 
        in:draw={{duration: 2000, easing: quintOut}}
		class="chart-line"
		d={path}
		{style}
		fill="transparent"
		stroke={color}
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
{/if}

<style lang='scss'>
    .chart-line {
        transition: all 0.3s ease-out;
    }
</style>
