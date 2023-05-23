<script>
    import {onMount} from "svelte"
    import interactive from "utility/use-interactive.js"
    import DisplayString from "utility/display-string.js"
    import game from "stores/store-game.js"
    import State from "utility/state/state.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import UIDialog from "utility/dialog/UIDialog.svelte"

    const SLOTS = ["","SAVE1","SAVE2","SAVE3"]

    export let data

    const saveInfo = State.saveInfo

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

    function resetState() {
        if (!confirm("Reset game?"))
            return
        State.reset()
        Dialogs.closeAll()
    }

    function save(slot) {
        State.save(slot)
    }

    function load(slot, processOffline = true) {
        State.load(slot, processOffline)
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
    <div class="container">
        <div class="title">
            Game title
        </div>
        <div class="close button"
             use:interactive
             on:basicaction={close}
        >
            X
        </div>

        <div class="time">
            Play time: {DisplayString.time(currentTime)}
            {#if catchingUp}
                / {DisplayString.time(targetTime)}
            {/if}
        </div>
        <div class="saves">
            {#each SLOTS as slot}
                {@const info = $saveInfo[slot]}
                <div class="save">
                    {#if slot !== ""}
                        <div class="button"
                             use:interactive
                             on:basicaction={() => save(slot)}
                        >Save >> </div>
                    {:else}
                        <div class="autosave">
                            Autosave:
                        </div>
                    {/if}
                    <div class="saveinfo">
                        {#if info?._date}
                            {new Date(info?._date).toLocaleDateString()} {new Date(info?._date).toLocaleTimeString()}
                            |
                            {DisplayString.time(info?.time)}
                            |
                            {"???"}%
                        {:else}
                            -- empty --
                        {/if}
                    </div>
                    <div class="button"
                         use:interactive
                         on:basicaction={() => load(slot)}
                         on:specialaction={() => load(slot, false)}
                    > >> Load</div>
                </div>
            {/each}
            <div class="save">
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
            <div class="savehint">
                Right-click/long-tap to load without adding offline time.
            </div>
        </div>
        <div class="buttons">
            <div class="button" use:interactive
                 on:basicaction={resetState}>Reset game</div>
        </div>
     </div>
</UIDialog>

<style>
    div.container {
        position: relative;
        width: 30em;
        height: 30em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
    }

    div.title {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 5em;
    }

    div.time {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    div.saves {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
        row-gap: 0.5em;
    }

    div.save {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: var(--ui-dialog-section-color);
        border-radius: 1em;
    }

    div.button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 7em;
        height: 1.5em;
        background-color: var(--ui-button-color);
        transition: background-color 0.2s;
        border-radius: 0.5em;
    }

    div.button:hover {
        cursor: pointer;
        background-color: var(--ui-button-hover-color);
    }

    div.autosave {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 7em;
        height: 1.5em;
        background-color: var(--ui-button-disabled-color);
        border-radius: 0.5em;
    }

    div.saveinfo {
        font-size: 0.75em;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20em;
        height: 2em;
    }

    div.savehint {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
    }

    input.savetext {
        font-size: 0.75em;
        width: 20em;
        height: 2em;
        border: none;
        color: inherit;
        text-align: center;
        background-color: var(--ui-dialog-section-color);
    }

    div.close.button {
        position: absolute;
        right : 0.5em;
        top : 0.5em;
        width : 1.5em;
        height : 1.5em;
    }

</style>
