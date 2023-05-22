<script>
    import UIDialog from "components/ui/dialogs/UIDialog.svelte"
    import Trigger from "utility/trigger-svelte.js"
    import {onMount} from "svelte"
    import interactive from "utility/interactive.js"
    import DisplayString from "utility/display-string.js"

    const SLOTS = ["","SAVE1","SAVE2","SAVE3"]

    Trigger.on("save-info-updated", updateSaveInfo)

    export let game
    export let data

    let saveText = ""
    let slotInfo = {}

    $: currentTime = game?.state?.time ?? 0
    $: targetTime = game?.state?.targetTime ?? 0
    $: catchingUp = targetTime - currentTime > 10

    function exportSave() {
        Trigger("command-export-save")
    }

    function importSave(processOffline) {
        if (saveText === "")
            return

        Trigger("command-import-save", saveText, processOffline)
        Trigger("command-close-dialogs")
    }

    function resetState() {
        if (!confirm("Reset game?"))
            return
        Trigger("command-reset-game")
    }

    function save(slot) {
        Trigger("command-save-game", slot)
    }

    function load(slot, offlineTime = true) {
        Trigger("command-load-game", slot, offlineTime)
        Trigger("command-close-dialogs")
    }

    function updateSaveInfo(info) {
        slotInfo = info
    }

    function close() {
        Trigger("command-close-dialog")
    }

    onMount(() => {
        Trigger("command-update-save-info", SLOTS)
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
                        {#if slotInfo[slot]?._date}
                            {new Date(slotInfo[slot]?._date).toLocaleDateString()} {new Date(slotInfo[slot]?._date).toLocaleTimeString()}
                            |
                            {DisplayString.time(slotInfo[slot]?.time)}
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
