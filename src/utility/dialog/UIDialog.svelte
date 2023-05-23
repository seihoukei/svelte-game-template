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

<div class="holder" on:click={close} bind:this={holder}>
    <div class="dialog">
        <slot />
    </div>
</div>

<style>
    div.holder {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top : 0;

        background-color: #000000AA;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 3vmin;
    }

    div.dialog {
        background-color: var(--ui-dialog-color);
    }
</style>
