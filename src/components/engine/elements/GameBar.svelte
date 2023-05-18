<script>
    import Trigger from "utility/trigger-svelte.js"

    export let bar = {
        current : 0,
        max : 10,
    }

    Trigger.on("command-tick", advance)

    function advance(time) {
        if (!bar)
            return

        bar.current += time
        while (bar.current >= bar.max) {
            bar.current -= bar.max
            bar.max *= 2
            Trigger("bar-maxed")
        }
    }

</script>
