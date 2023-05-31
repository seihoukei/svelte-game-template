<script>
    import DisplayString from "utility/display-string/display-string.js"
    import game from "stores/store-game.js"

    export let data

    $: index = data

    $: state = $game?.state ?? {}
    $: bar = state?.bars[index] ?? {}
    $: lastBar = state?.bars[index - 1] ?? {}
</script>

Bar #{data}

Progress: {DisplayString.number(bar.current ?? 0)} / {DisplayString.shortNumber(bar.max ?? 0)} ({DisplayString.percentage(bar.current / bar.max || 0)})
Current Speed: {DisplayString.number(lastBar.outputSpeed ?? 0)}
Output Speed: {DisplayString.number(bar.outputSpeed ?? 0)}
