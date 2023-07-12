<script>
    import UIMeta from "./UIMeta.svelte"
    import game from "stores/store-game.js"
    import UIDialogs from "utility/dialog/UIDialogs.svelte"
    import UIToolTip from "utility/tooltip/UIToolTip.svelte"

    $: state = $game?.state ?? null
</script>

{#if import.meta.env.MODE === "development" && (!state || state?.settings?.debugInfo)}
    <pre class="debug">{JSON.stringify($game, null, 1).replace(/(\d+\.\d{1,2})\d+/g,"$1")}</pre>
{/if}

{#if state}

    <UIMeta />
    <div class="vertical gapped flex content">
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
</style>
