<script>
    import UIMeta from "./UIMeta.svelte"
    import UIBar from "components/ui/UIBar.svelte"
    import UIHover from "components/ui/UIHover.svelte"

    export let game
</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify(game, null, 1).replace(/(\d+\.\d{1,2})\d+/g,"$1")}</pre>
{/if}

{#if game?.state}

    <UIMeta {game}/>
    <div class="content">
        <UIBar bar={game.state.bar} />
    </div>

    <UIHover {game} />
{/if}

<style>
    pre.debug {
        position: absolute;
        left : 0;
        top : 20px;
        opacity: 0.5;
        pointer-events: none;
        font-size: 8px;
    }

    div.content {
        display: flex;
        flex-direction: column;
        margin: 50px 0;
    }
</style>
