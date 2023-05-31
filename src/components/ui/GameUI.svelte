<script>
    import UIMeta from "./UIMeta.svelte"
    import UIBar from "components/ui/elements/UIBar.svelte"
    import DisplayString from "utility/display-string/display-string.js"
    import game from "stores/store-game.js"
    import UIDialogs from "utility/dialog/UIDialogs.svelte"
    import UIToolTip from "utility/tooltip/UIToolTip.svelte"

    $: state = $game?.state ?? null

</script>

{#if import.meta.env.MODE === "development" && (!state || state.settings.debugInfo)}
    <pre class="debug">{JSON.stringify($game, null, 1).replace(/(\d+\.\d{1,2})\d+/g,"$1")}</pre>
{/if}

{#if state}

    <UIMeta />
    <div class="content">
        <UIBar bar={state.bar} />
        <div class="icon-text">
            {@html DisplayString.html(`You have ~logo~${state.bar?.count} from maxed out bars`)}
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
        display: flex;
        flex-direction: column;
        align-items: stretch;
        margin: 50px 0;
    }

    div.icon-text {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;

    }
</style>
