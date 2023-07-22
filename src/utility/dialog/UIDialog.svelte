<script>
    import Dialogs from "utility/dialog/dialogs.js"
    import {onDestroy, onMount} from "svelte"

    export let nocancel = false

    let dialog

    onMount(() => {
        dialog.showModal()
    })

    onDestroy(() => {
        dialog.close()
    })

    function closeDialog() {
        Dialogs.close()
    }

    function checkCancel(event) {
        if (nocancel)
            event.preventDefault()
    }

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog bind:this={dialog} on:close={closeDialog} on:cancel={checkCancel}>
    <slot />
</dialog>

<style>
    dialog::backdrop {
        background-color: #000000AA;
    }

    dialog {
        background-color: var(--ui-dialog-color);
        padding: 0;
        border : 0;
        color: var(--ui-dialog-text-color);
        overflow: hidden;
    }
</style>
