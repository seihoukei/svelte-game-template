<script>
    import Dialogs from "utility/dialog/dialogs.js"

    export let modal = false

    let holder

    function close(event) {
        if (event.target === holder && !modal) {
            Dialogs.close()
        }
    }

</script>

<div class="absolute fullsize centered flex holder" on:click={close} bind:this={holder}>
    <div class="dialog">
        <slot />
    </div>
</div>

<style>
    div.holder {
        background-color: #000000AA;
    }

    div.dialog {
        background-color: var(--ui-dialog-color);
    }
</style>
