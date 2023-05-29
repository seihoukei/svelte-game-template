<script>
    import UIDialog from "utility/dialog/UIDialog.svelte"
    import interactive from "utility/use-interactive.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import {onMount} from "svelte"

    export let data

    let input
    let inputText

    $: message = data?.message ?? ""
    $: buttons = data?.buttons ?? []
    $: isInput = data?.isInput ?? false
    $: isNumber = data?.isNumber ?? false
    $: inputHint = data?.inputHint ?? ""
    $: resolve = data?.resolve ?? noResolve

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

    onMount(() => {
        input?.focus?.()
        inputText = data?.defaultValue ?? ""
    })
</script>

<UIDialog modal>
    <div class="gapped padded vertical stretched flex dialog">
        <div class="centered flex dialog-supersection padded em-rounded message">
            {message}
        </div>
        {#if isInput}
            {#if isNumber}
                <input placeholder={inputHint}
                       type="number"
                       bind:this={input}
                       bind:value={inputText}
                />
            {:else}
                <input placeholder={inputHint}
                       bind:this={input}
                       bind:value={inputText}
                />
            {/if}
        {/if}
        <div class="horizontal centered spaced flex buttons">
            {#each buttons as button}
                <div class="button text"
                     class:disabled={button.validation && !button.validation(inputText ?? "")}
                     use:interactive
                     on:basicaction={() => returnResult(button)}
                >
                    {button.text}
                </div>
            {/each}
        </div>
    </div>
</UIDialog>

<style>
    div.dialog {
        font-size: 2em;
        min-width : 10em;
    }
    div.button {
        padding: 0.25em 1em;
        border-radius: 0.5em;
    }
    input {
        font-size: inherit;
    }
</style>
