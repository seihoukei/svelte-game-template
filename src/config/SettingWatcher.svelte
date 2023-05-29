<script>
    import GAME_CONFIG from "config/game-config.js"
    import Timer from "utility/timer/timer.js"
    import DisplayString from "utility/display-string/display-string.js"
    import Tooltips from "utility/tooltip/tooltips.js"
    import State from "utility/state/state.js"

    export let settings = {}

    // Custom setttings watchers go here
    // First decouple primitive value from settings object:
    // $: <variable> = settings.<name> ?? <default value>
    // Then apply setting
    // $: doSomething(<variable>)
    // This way value is only applied when it actually changes

    // Common settings watchers
    $: dataFPS = settings.dataFPS ?? GAME_CONFIG.timer.rate
    $: Timer.applyConfig({
        rate : dataFPS
    })

    $: tooltipDelay = settings.tooltipDelay ?? GAME_CONFIG.tooltip.delay
    $: Tooltips.applyConfig({
        delay : tooltipDelay
    })

    $: autosaveInterval = settings.autosaveInterval ?? GAME_CONFIG.state.autosaveInterval
    $: State.applyConfig({
        autosaveInterval,
    })

    //TODO apply number display settings
    $: DisplayString.applyConfig({

    })


</script>
