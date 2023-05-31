<script>
    import DisplayString from "utility/display-string/display-string.js"
    import game from "stores/store-game.js"

    export let data

    $: index = data ?? 0

    $: bars = $game?.state?.bars ?? []
    $: bar = bars[index] ?? {}
    $: lastBar = bars[index - 1] ?? {}
    $: time = $game?.state?.time ?? 0

    $: current = bar.current ?? 0
    $: max = bar.max ?? 0
    $: progress = bar.current / bar.max || 0 //NaN safeguard
    $: speed = lastBar.outputSpeed ?? 0
    $: currentTime = time - bar.lastReset
    $: ETA = currentTime / current * (max - current) || 0
</script>

Bar #{index + 1}

Progress: {DisplayString.number(current)} / {DisplayString.shortNumber(max)} ({DisplayString.percentage(progress)})
Speed: {DisplayString.number(speed)}
Time since zero: {DisplayString.time(currentTime, DisplayString.TIME_FORMATS.SHORT_DURATION)}
ETA: {DisplayString.time(ETA, DisplayString.TIME_FORMATS.SHORT_DURATION)}
