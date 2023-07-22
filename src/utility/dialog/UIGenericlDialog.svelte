<script>
    import UIDialog from "utility/dialog/UIDialog.svelte"
    import Dialogs from "utility/dialog/dialogs.js"
    import {onMount} from "svelte"

    export let data

    let dialog
    let input
    let inputText
    let nocancel

    $: message = data?.message ?? ""
    $: buttons = data?.buttons ?? []
    $: isInput = data?.isInput ?? false
    $: isNumber = data?.isNumber ?? false
    $: inputHint = data?.inputHint ?? ""
    $: resolve = data?.resolve ?? noResolve
    $: nocancel =  !(data?.cancellable ?? true)

    function noResolve() {
        throw new Error("No resolve function for dialog")
    }

    function returnResult(button) {
        if (button.validation && !button.validation(inputText ?? ""))
            return

        if (isInput) {
            resolve(button.confirm
                ? inputText
                : null)
        } else {
            resolve(button.result)
        }

        Dialogs.close()
    }

    function keypress(event) {
        if (event.target !== input && event.target !== dialog)
            return

        const keyButton = buttons.find(button => button.key && button.key.toLowerCase() === event.key.toLowerCase())
        if (keyButton)
            returnResult(keyButton)
    }

    onMount(() => {
        dialog?.focus?.()
        input?.focus?.()
        inputText = data?.defaultValue ?? ""
    })
</script>

<UIDialog {nocancel}>
    <div class="gapped padded vertical stretched flex dialog" on:keydown={keypress} bind:this={dialog} tabindex="1">
        <div class="centered flex dialog-supersection padded em-rounded message">
            {message}
        </div>
        {#if isInput}
            {#if isNumber}
                <input placeholder={inputHint}
                       type="number"
                       bind:this={input}
                       bind:value={inputText}
                       on:keydown={keypress}
                />
            {:else}
                <input placeholder={inputHint}
                       bind:this={input}
                       bind:value={inputText}
                       on:keydown={keypress}
                />
            {/if}
        {/if}
        <div class="horizontal centered spaced flex buttons">
            {#each buttons as button, index}
                <button
                    class:disabled={button.validation && !button.validation(inputText ?? "")}
                    on:click={() => returnResult(button)}
                >
                    {button.text}
                </button>
            {/each}
        </div>
    </div>
</UIDialog>

<style>
    div.dialog {
        font-size: 2em;
        min-width : 10em;
    }
    input {
        font-size: inherit;
    }
</style>
