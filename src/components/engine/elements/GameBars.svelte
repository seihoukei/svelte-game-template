<script>
    import GameBar from "components/engine/elements/GameBar.svelte"
    import Trigger from "@seihoukei/trigger-svelte"

    import game from "stores/store-game.js"

    export let bars = [{
        current : 0,
        max : 10,
        lastReset : 0,
    }]

    Trigger.on("bar-maxed", barMaxed)

    function barMaxed(id) {
        const now = $game?.state?.time
        bars[id].lastReset = now
        if (id === bars.length - 1) {
            bars.push({
                current : 0,
                max : 10 * 2 ** bars.length,
                lastReset : now,
                completes : 0,
            })
        }
    }

</script>

{#each bars as bar, index}
    <GameBar id={index}
             bind:current={bar.current}
             bind:max={bar.max}
             bind:outputSpeed={bar.outputSpeed}
             bind:resetTime={bar.resetTime}
             bind:completes={bar.completes}
             speed={bars[index-1]?.outputSpeed ?? 1}
    />
{/each}
