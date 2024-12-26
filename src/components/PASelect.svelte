<script lang='ts'>
    export let appState:AppState;

    import { createPACountChangeAction } from "../scripts/Action";

    function onPACountChange(ev:Event) {
        if(ev.target instanceof HTMLSelectElement) {
            let paCount:number = parseInt(ev.target.options[ev.target.selectedIndex].value)!;
            appState.publishEvent(createPACountChangeAction({paCount}));
        }
    }

    const options = [50, 100, 200];
</script>

<select name='paCount' size='1' on:change={onPACountChange}>
    {#each options as paCount (paCount)}
        <option selected={paCount == appState.paCount} value="{paCount}">
            {paCount} PA
        </option>
    {/each}
</select>
