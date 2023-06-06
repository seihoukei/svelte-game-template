<script>
    import Trigger from "utility/trigger-svelte.js"
    import Transform from "utility/transform-svelte.js"

    export let current = 0
    export let max = 10
    export let speed = 1
    export let outputSpeed = 1
    export let id

    Trigger.on("command-advance", advance)
    Trigger.on("bar-status", barStatus)
    Transform.on("bar-speed", barSpeed)

    function advance(time) {
        current += time * speed
        while (current >= max) {
            current -= max
            Trigger("bar-maxed", id)
        }
        outputSpeed = speed * current / max
    }

    function barStatus() {
        return current / max
    }

    function barSpeed(input) {
        return input * current / max
    }
</script>
