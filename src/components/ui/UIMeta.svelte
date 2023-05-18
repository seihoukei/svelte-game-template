<script>
    import Trigger from "utility/trigger-svelte.js"

    export let game

</script>

<div class="container">
    <button on:click={() => confirm("Reset game?") && Trigger("command-reset-game")}>Reset game</button>
</div>

<style>
    div.container {
        display: flex;
        width: 100vw;
    }
</style>
