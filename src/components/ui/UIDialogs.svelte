<script>
    import Trigger from "utility/trigger-svelte.js"

    export let dialogs
    export let game

    Trigger.on("command-close-dialog", closeDialog)
    Trigger.on("command-close-dialogs", closeDialogs)
    Trigger.on("command-open-dialog", openDialog)

    function openDialog(id, data = null) {
        stack.push({id, data})
    }

    function closeDialog() {
        stack.pop()
    }

    function closeDialogs() {
        stack.length = 0
    }

    let stack = []
</script>

{#each stack as {id, data}}
    <svelte:component this={dialogs[id]} {game} {data}/>
{/each}
