<script>
    import {onDestroy} from "svelte"
    import Trigger from "utility/trigger-svelte.js"
    import Timer from "utility/timer/timer.js"

    export let time = 0
    export let targetTime = 0
    export let milestoneFunction = null

    let interval = null
    let lastTime = performance.now()

    $: rate = Timer.rate
    $: updateInterval($rate)

    function updateInterval(rate) {
        if (interval)
            clearInterval(interval)

        interval = setInterval(tick, 1000 / rate)
    }

    function advance(tickTime) {
        targetTime += tickTime
        let timeToProcess = Math.min(targetTime - time, Timer.config.maxTickTime)

        while (timeToProcess > 0) {
            const milestones = milestoneFunction?.() ?? []
            const step = Math.min(timeToProcess, Timer.config.maxStepTime, ...milestones)
            Trigger(Timer.config.event, step)
            time += step
            timeToProcess -= step
        }
    }

    function tick() {
        const now = performance.now()
        const delta = (now - lastTime) / 1000
        const boostedDelta = delta * Timer.config.boost

        advance(boostedDelta)

        lastTime = now
    }

    onDestroy(() => {
        clearInterval(interval)
    })
</script>
