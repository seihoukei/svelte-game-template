<script>
    import DisplayString from "../../utility/display-string.js"
    import game from "stores/store-game.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import State from "utility/state/state.js"

    $: state = $game?.state
    $: currentTime = state?.time ?? 0
    $: targetTime = state?.targetTime ?? 0
    $: catchingUp = targetTime - currentTime > 10
</script>

<div class="container">
    <button on:click={() => Dialogs.open("menu")}>Menu</button>
    <button on:click={() => confirm("Reset game?") && State.reset()}>Reset game</button>
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
