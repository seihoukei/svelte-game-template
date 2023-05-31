<script>
    import Trigger from "utility/trigger-svelte.js"

    export let current = 0
    export let max = 10
    export let speed = 1
    export let outputSpeed = 1
    export let id

    Trigger.on("command-advance", advance)

    $: outputSpeed = speed * current / max

    function advance(time) {
        current += time * speed
        while (current >= max) {
            current -= max
            Trigger("bar-maxed", id)
        }
    }

</script>
