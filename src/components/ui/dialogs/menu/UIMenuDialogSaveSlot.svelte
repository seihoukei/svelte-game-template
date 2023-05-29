<script>
    import State from "utility/state/state.js"
    import interactive from "utility/use-interactive.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import DisplayString from "utility/display-string/display-string.js"

    export let slot

    const saveInfo = State.saveInfo
    $: info = $saveInfo[slot]

    function save() {
        State.save(slot)
    }

    function load(processOffline = true) {
        State.load(slot, processOffline)
        Dialogs.closeAll()
    }


</script>

<div class="horizontal centered flex dialog-section save">
    <div class="button"
         use:interactive
         on:basicaction={() => save()}
    >
        {#if slot !== State.config.autosaveSlot}
            Save >>
        {:else}
            Autosave
        {/if}
    </div>
    <div class="centered flex saveinfo">
        {#if info?._date}
            {new Date(info?._date).toLocaleDateString().replace(/\d\d(\d\d)/, "$1")} {new Date(info?._date).toLocaleTimeString()}
            |
            {DisplayString.time(info?.time, DisplayString.TIME_FORMATS.LONG_3_ITEMS)}
            |
            {"???"}%
        {:else}
            -- empty --
        {/if}
    </div>
    <div class="button"
         use:interactive
         on:basicaction={() => load()}
         on:specialaction={() => load(false)}
    > >> Load</div>
</div>

<style>
    div.save {
        border-radius: 0.5em;
    }

    div.button {
        width: 7em;
        height: 1.5em;

        border-radius: 0.5em;
    }

    div.saveinfo {
        font-size: 0.7em;
        width: 20em;
        height: 2em;
    }

</style>
