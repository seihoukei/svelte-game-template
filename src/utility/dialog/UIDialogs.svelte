<script>
    import Dialogs from "utility/dialog/dialogs.js"

    $: openDialogs = Dialogs.openDialogs

</script>

{#each $openDialogs as {type, data}}
    <svelte:component this={type} {data}/>
{/each}
