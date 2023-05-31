<script>
    import GameBar from "components/engine/elements/GameBar.svelte"
    import Trigger from "utility/trigger-svelte.js"

    export let bars = [{
        current : 0,
        max : 10,
    }]

    Trigger.on("bar-maxed", barMaxed)

    function barMaxed(id) {
        if (id === bars.length - 1) {
            bars.push({
                current : 0,
                max : 10 + bars.length,
            })
        }
    }

</script>

{#each bars as bar, index}
    <GameBar id={index}
             bind:current={bar.current}
             bind:max={bar.max}
             bind:outputSpeed={bar.outputSpeed}
             speed={bars[index-1]?.outputSpeed ?? 1}
    />
{/each}
