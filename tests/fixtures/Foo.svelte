<script lang="ts">
    export let name:string = 'World';

    function handleClick(ev:MouseEvent):void {
        if(ev.target instanceof HTMLElement) { ev.target.innerHTML = 'Click Moi'; }
    }
</script>

<style>
    p { color: green; }
</style>

<p>Hello {name}!</p>

<button on:click={handleClick}>Click Me</button>
