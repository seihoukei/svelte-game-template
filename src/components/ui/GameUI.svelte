<script>
    import UIMeta from "./UIMeta.svelte"
    import UIBar from "components/ui/elements/UIBar.svelte"
    import DisplayString from "utility/display-string/display-string.js"
    import game from "stores/store-game.js"
    import UIDialogs from "utility/dialog/UIDialogs.svelte"
    import UIToolTip from "utility/tooltip/UIToolTip.svelte"
    import interactive from "utility/use-interactive.js"
    import Trigger from "utility/trigger-svelte.js"

    $: state = $game?.state ?? null
    $: bars = state?.bars ?? []

    function status() {
        console.log(Trigger.poll("bar-status"))
        console.log(Trigger.transform(1, "bar-speed"))
    }
</script>

{#if import.meta.env.MODE === "development" && (!state || state?.settings?.debugInfo)}
    <pre class="debug">{JSON.stringify($game, null, 1).replace(/(\d+\.\d{1,2})\d+/g,"$1")}</pre>
{/if}

{#if state}

    <UIMeta />
    <div class="vertical gapped flex content">
        <div class="icon-text"
             use:interactive
             on:basicaction={status}
        >
            {@html DisplayString.html(`You have ~logo~${bars.length} bars`)}
        </div>
        <div class="gapped stretched vertical flex bars">
            {#each bars as bar, index}
                <UIBar {bar} {index} />
            {/each}
        </div>
    </div>

    <UIDialogs />
    <UIToolTip />
{/if}

<style>
    pre.debug {
        position: absolute;
        left : 0;
        top : 20px;
        color: white;
        opacity: 0.3;
        pointer-events: none;
        font-size: 8px;
        z-index : 1000;
    }

    div.content {
        position: absolute;
        left: 1rem;
        top : 2rem;
        bottom : 1rem;
        right : 1rem;
    }

    div.icon-text {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
    }

    div.bars {
        overflow: hidden auto;
    }
</style>
