<script>
    import {onDestroy, tick} from "svelte"
    import Trigger from "@seihoukei/trigger-svelte"

    import Timer from "utility/timer/timer.js"

    export let time = 0
    export let targetTime = 0
    export let milestoneFunction = null

    let interval = null
    let lastTime = performance.now()

    let advancing = false
    let breakAdvance = false

    // Attach to Timer
    Timer.cancelAdvance = cancelAdvance

    $: rate = Timer.rate
    $: updateInterval($rate)
    $: tickProcessingTime = Math.max(1000 / $rate - 1, 1)

    function updateInterval(rate) {
        if (interval)
            clearInterval(interval)

        interval = setInterval(gameTick, 1000 / rate)
    }

    async function advance(tickTime) {
        targetTime += tickTime
        if (advancing)
            return

        advancing = true
        breakAdvance = false
        const advanceStart = performance.now()

        let timeToProcess = Math.min(targetTime - time, Timer.config.maxTickTime)

        while (timeToProcess > 0 && !breakAdvance && (performance.now() - advanceStart < tickProcessingTime)) {
            const milestones = milestoneFunction?.() ?? []
            const step = Math.min(timeToProcess, Timer.config.maxStepTime, ...milestones)
            Trigger(Timer.config.event, step)
            time += step
            timeToProcess -= step

            if (Timer.config.svelteTickEveryStep)
                await tick()
        }

        advancing = false
        breakAdvance = false
    }

    function gameTick() {
        const now = performance.now()
        const delta = (now - lastTime) / 1000
        const boostedDelta = delta * Timer.config.boost

        advance(boostedDelta)

        lastTime = now
    }

    function cancelAdvance() {
        breakAdvance = true
    }

    onDestroy(() => {
        clearInterval(interval)
    })
</script>
