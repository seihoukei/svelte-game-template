<script>
    import Trigger from "@seihoukei/trigger-svelte"


    export let current = 0
    export let max = 10
    export let speed = 1
    export let outputSpeed = 1
    export let id
    export let completes = 0


    Trigger.on("command-advance", advance)
    Trigger.on("bar-status", barStatus)
    Trigger.modifies("bar-speed", barSpeed)

    function advance(time) {
        current += time * speed
        while (current >= max) {
            current -= max
            completes += 1
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
