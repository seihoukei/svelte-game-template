<script>
    import SaveStateManager from "./SaveStateManager.svelte"
    import GameSettings from "components/engine/GameSettings.svelte"
    import GameBar from "components/engine/elements/GameBar.svelte"
    import Trigger from "utility/trigger-svelte.js"

    const DEFAULT_GAME_STATE = Object.freeze({
        time : 0,
        targetTime : 0,
    })
    const MAX_TICK_TIME = 10000
    const MAX_STEP_TIME = MAX_TICK_TIME

    const GAME_SAVE_PREFIX = "Svelte_Game"
    const SAVE_VERSION = 1
    // important events to autosave game shortly after
    const ACTIONSAVE_EVENTS = ["bar-maxed"]
    // important events to create a backup before
    const AUTOBACKUP_EVENTS = []
    const AUTOSAVE_INTERVAL = 60000
    // minimum time between saves after important actions
    const ACTIONSAVE_INTERVAL = 2000

    Trigger.on("command-tick", tick)

    export let game = {}

    let state, gameId

    $: game.state = state
    $: game.id = gameId

    function getMilestones() {
        //get time to events that affect calculations in a major way
        return []
    }

    function tick(time) {
        state.targetTime += time
        let timeToProcess = Math.min(state.targetTime - state.time, MAX_TICK_TIME)

        while (timeToProcess > 0) {
            const milestones = getMilestones()
            const step = Math.min(timeToProcess, MAX_STEP_TIME, ...milestones)
            Trigger("command-advance", step)
            state.time += step
            timeToProcess -= step
        }
    }

    function metaFunction() {
        // form a metadata to access via saveInfo
        return {
            barValue : state?.bar?.value,
            barMax : state?.bar?.max,
            time : state.targetTime,
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
                  defaultState={DEFAULT_GAME_STATE}
                  {metaFunction}
                  {offlineFunction}
                  {versionFunction}
                  actionsaveEvents={ACTIONSAVE_EVENTS}
                  backupEvents={AUTOBACKUP_EVENTS}
                  autosaveInterval={AUTOSAVE_INTERVAL}
                  actionsaveInterval={ACTIONSAVE_INTERVAL}
                  prefix={GAME_SAVE_PREFIX}
                  version={SAVE_VERSION}
/>

{#key gameId}
    {#if state}
        <GameBar bind:bar={state.bar} />

        <GameSettings bind:settings={state.settings} />
    {/if}
{/key}
