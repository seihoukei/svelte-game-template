<script>
    import DisplayString from "utility/display-string/display-string.js"
    import game from "stores/store-game.js"

    export let data

    $: state = $game?.state ?? {}
    $: bar = state?.bar ?? {}
</script>

Bar

Data: {DisplayString.number(data.current)} / {DisplayString.shortNumber(data.max)}
State: {DisplayString.number(bar.current ?? 0)} / {DisplayString.shortNumber(bar.max ?? 0)} ({DisplayString.percentage(bar.current / bar.max || 0)})
