<script>
    import Trigger from "utility/trigger-svelte.js"
    import DisplayString from "utility/display-string.js"

    export let game

    $: currentTime = game?.state?.time ?? 0
    $: targetTime = game?.state?.targetTime ?? 0
    $: catchingUp = targetTime - currentTime > 10
</script>

<div class="container">
    <button on:click={() => Trigger("command-open-dialog", "menu")}>Menu</button>
    <button on:click={() => confirm("Reset game?") && Trigger("command-reset-game")}>Reset game</button>
    <span class="time">
        {DisplayString.time(currentTime)}
        {#if catchingUp}
            / {DisplayString.time(targetTime)}
        {/if}
    </span>
</div>

<style>
    div.container {
        display: flex;
        column-gap: 1em;
        width: 100vw;
    }
</style>
