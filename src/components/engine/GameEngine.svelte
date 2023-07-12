<script>
    import SaveStateManager from "utility/state/SaveStateManager.svelte"
    import GameSettings from "utility/settings/GameSettings.svelte"
    import GameTimer from "utility/timer/GameTimer.svelte"

    import game from "stores/store-game.js"

    let state, gameId

    $: $game.state = state
    $: $game.id = gameId

    function milestoneFunction() {
        //get time to events that affect calculations in a major way
        return []
    }

    function metaFunction() {
        // form a metadata to access via saveInfo
        return {
            time : state?.targetTime,

        }
    }

    function versionFunction(data, version) {
        //update save from different version
        return data
    }

    function offlineFunction(state, time) {
        //modify freshly loaded state according to offline time
        //executed before state is actually assigned to game.state
        state.targetTime += time

        return state
    }
</script>

<SaveStateManager bind:state
                  bind:id={gameId}
                  {metaFunction}
                  {offlineFunction}
                  {versionFunction}
/>

{#key gameId}
    {#if state}

        <GameSettings bind:settings={state.settings} />
        <GameTimer {milestoneFunction}
                   bind:time={state.time}
                   bind:targetTime={state.targetTime}
        />
    {/if}
{/key}
