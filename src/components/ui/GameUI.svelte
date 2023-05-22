<script>
    import UIMeta from "./UIMeta.svelte"
    import UIBar from "components/ui/elements/UIBar.svelte"
    import UIDialogs from "components/ui/UIDialogs.svelte"
    import UIMenu from "components/ui/dialogs/UIMenu.svelte"
    import UIHover from "components/ui/UIHover.svelte"
    import DisplayString from "utility/display-string.js"

    const UI_DIALOGS = {
        menu : UIMenu,
    }

    export let game

</script>

{#if import.meta.env.MODE === "development"}
    <pre class="debug">{JSON.stringify(game, null, 1).replace(/(\d+\.\d{1,2})\d+/g,"$1")}</pre>
{/if}

{#if game?.state}

    <UIMeta {game}/>
    <div class="content">
        <UIBar bar={game.state.bar} />
        <div class="icon-text">
            {@html DisplayString.html(`You have ~logo~${game.state.bar?.count} from maxed out bars`)}
        </div>
    </div>

    <UIDialogs {game} dialogs={UI_DIALOGS}/>

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
