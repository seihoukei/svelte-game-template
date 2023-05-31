<script>
    import {onMount} from "svelte"
    import interactive from "utility/use-interactive.js"
    import DisplayString from "utility/display-string/display-string.js"
    import game from "stores/store-game.js"
    import State from "utility/state/state.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import UIDialog from "utility/dialog/UIDialog.svelte"
    import UIMenuDialogSaveSlot from "components/ui/dialogs/menu/UIMenuDialogSaveSlot.svelte"
    import GAME_CONFIG from "config/game-config.js"

    const SLOTS = [State.config.autosaveSlot,"SAVE1","SAVE2","SAVE3"]

    // svelte-ignore unused-export-let
    export let data = {}

    let saveText = ""

    $: state = $game?.state
    $: currentTime = state?.time ?? 0
    $: targetTime = state?.targetTime ?? 0
    $: catchingUp = targetTime - currentTime > 10

    function exportSave() {
        State.export()
    }

    function importSave(processOffline) {
        if (saveText === "")
            return

        State.import(saveText, processOffline)
        Dialogs.closeAll()
    }

    async function resetState() {
        if (!await Dialogs.confirm("Reset game?"))
            return
        State.reset()
        Dialogs.closeAll()
    }

    function close() {
        Dialogs.close("menu")
    }

    onMount(() => {
        State.updateSaveInfo(SLOTS)
    })

</script>

<UIDialog>
    <div class="relative vertical centered spaced flex container">
        <div class="centered flex title">
            {GAME_CONFIG.title}
        </div>
        <div class="close button"
             use:interactive
             on:basicaction={close}
        >
            X
        </div>

        <div class="stretched gapped em-padded em-rounded vertical flex dialog-supersection">
            <div class="centered flex time">
                Play time: {DisplayString.time(currentTime, DisplayString.TIME_FORMATS.LONG_3_ITEMS)}
                {#if catchingUp}
                    / {DisplayString.time(targetTime)}
                {/if}
            </div>

            <div class="stretched vertical flex saves">
                {#each SLOTS as slot}
                    <UIMenuDialogSaveSlot {slot} />
                {/each}
                <div class="horizontal centered flex dialog-section save">
                    <div class="button"
                         use:interactive
                         on:basicaction={exportSave}
                    >Export >></div>
                    <input class="savetext" placeholder="Paste save here" bind:value={saveText}/>
                    <div class="button"
                         use:interactive
                         on:basicaction={() => importSave(true)}
                         on:specialaction={() => importSave(false)}
                    >>> Import</div>
                </div>
                <div class="centered flex savehint">
                    Right-click/long-tap to load without adding offline time.
                </div>
            </div>

        </div>

        <div class="horizontal gapped flex buttons">
            <div class="button" use:interactive
                 on:basicaction={() => Dialogs.open("settings")}>Settings</div>
            <div class="button" use:interactive
                 on:basicaction={resetState}>Reset game</div>
        </div>
     </div>
</UIDialog>

<style>
    div.container {
        width: 30em;
        height: 30em;
        font-size: 3vmin;
        padding : 1em;
    }

    div.title {
        font-size: 5em;
    }

    div.saves {
        row-gap: 0.5em;
    }

    div.save {
        border-radius: 0.5em;
    }

    div.button {
        width: 7em;
        height: 1.5em;

        border-radius: 0.5em;
    }

    div.savehint {
        font-size: 0.75em;
    }

    input.savetext {
        font-size: 0.7em;
        width: 20em;
        height: 2em;
    }

    div.close.button {
        position: absolute;
        right : 0.5em;
        top : 0.5em;
        width : 1.5em;
        height : 1.5em;
    }

</style>
