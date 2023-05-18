<script>
    import SaveStateManager from "./SaveStateManager.svelte"
    import GameSettings from "components/engine/GameSettings.svelte"
    import GameBar from "components/engine/elements/GameBar.svelte"

    const DEFAULT_GAME_STATE = Object.freeze({
    })

    export let game = {}

    let state, gameId

    $: game.state = state
    $: game.id = gameId

    function metaFunction() {
        // form a metadata to access via saveInfo
        return {
            barValue : state?.bar?.value,
            barMax : state?.bar?.max,
        }
    }

    function offlineFunction(state, time) {
        //modify freshly loaded state according to offline time
        //executed before state is actually assigned to game.state
        state.bar.current += time

        return state
    }
</script>

<SaveStateManager bind:state
                  bind:id={gameId}
                  defaultState={DEFAULT_GAME_STATE}
                  {metaFunction}
                  {offlineFunction}
                  actionsaveEvents={["bar-maxed"]}
                  backupEvents={[]}
                  autosaveInterval={15000}
                  actionsaveInterval={2000}
                  prefix="Svelte_Game"
/>

{#key gameId}
    {#if state}
        <GameBar bind:bar={state.bar} />

        <GameSettings bind:settings={state.settings} />
    {/if}
{/key}
