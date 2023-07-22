<script>
    import Dialogs from "utility/dialog/dialogs.js"
    import {onMount} from "svelte"

    export let cancellable = true

    let holder

    function close(event) {
        if (event.target === holder && cancellable) {
            Dialogs.close()
        }
    }

    function keypress(event) {
        if (cancellable && event.target === holder && event.key === "Escape") {
            Dialogs.close()
        }
    }

    onMount(() => {
        holder.focus()
    })

</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="absolute fullsize centered flex holder" on:click={close} bind:this={holder} tabindex="1" on:keydown={keypress}>
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
