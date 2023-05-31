<script>
    import DisplayString from "utility/display-string/display-string.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import State from "utility/state/state.js"

    import game from "stores/store-game.js"
    import GAME_CONFIG from "config/game-config.js"

    $: state = $game?.state
    $: currentTime = state?.time ?? 0
    $: targetTime = state?.targetTime ?? 0
    $: catchingUp = targetTime - currentTime > 10

    async function reset() {
        if (await Dialogs.confirm("Reset game?")) {
            State.reset()
        }
    }
</script>

<div class="gapped flex meta">
    <button on:click={() => Dialogs.open("menu")}>Menu</button>
    <button on:click={reset}>Reset game</button>
    <span class="time">
        {DisplayString.time(currentTime, DisplayString.TIME_FORMATS.LONG_3_ITEMS)}
        {#if catchingUp}
            / {DisplayString.time(targetTime, DisplayString.TIME_FORMATS.LONG_3_ITEMS)}
        {/if}
    </span>
    <span class="title">
        {GAME_CONFIG.title}
    </span>
</div>

<style>
    div.meta {
        flex-direction: row-reverse;
    }

    span.title {
        flex-grow: 1;
    }
</style>
