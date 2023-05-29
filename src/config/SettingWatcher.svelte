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

    $: numberPostfixes = settings.numberPostfixes ?? GAME_CONFIG.displayString.numberPostfixes
    $: numberEThreshold = settings.numberEThreshold ?? GAME_CONFIG.displayString.numberEThreshold
    $: numberEFractionThreshold = settings.numberEFractionThreshold ?? GAME_CONFIG.displayString.numberEFractionThreshold
    $: numberEStep = settings.numberEStep ?? GAME_CONFIG.displayString.numberEStep
    $: numberEPlus = settings.numberEPlus ?? GAME_CONFIG.displayString.numberEPlus
    $: numberDynamicDigits = settings.numberDynamicDigits ?? GAME_CONFIG.displayString.numberDynamicDigits
    $: numberSignificantFigures = settings.numberSignificantFigures ?? GAME_CONFIG.displayString.numberDigits
    $: numberDecimalDigits = settings.numberDecimalDigits ?? GAME_CONFIG.displayString.numberDigits
    $: numberShowTrailingZeroes = settings.numberShowTrailingZeroes ?? !GAME_CONFIG.displayString.numberCutTrailingZeroes

    $: DisplayString.applyConfig({
        numberPostfixes,
        numberEThreshold,
        numberEFractionThreshold,
        numberEStep,
        numberEPlus,
        numberDynamicDigits,
        numberDigits : numberDynamicDigits ? numberSignificantFigures : numberDecimalDigits,
        numberCutTrailingZeroes : !numberShowTrailingZeroes,
    })

</script>
