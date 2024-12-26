<script lang='ts'>
    export let appState:AppState;
</script>

<div>
    {#if appState.playerStats}
        <pre>
        {JSON.stringify(appState.playerStats)}
        </pre>
    {/if}
</div>

<style lang="scss">
</style>
