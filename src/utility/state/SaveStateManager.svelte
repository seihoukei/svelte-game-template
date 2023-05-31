<script>
    import State from "utility/state/state.js"

    import {onMount} from "svelte"
    import Trigger from "utility/trigger-svelte.js"
    import SaveProcessor from "utility/state/save-processor.js"
    import svelteInterval from "utility/svelte-interval.js"

    const PRIORITY_FIRST = -Infinity
    const PRIORITY_LAST = Infinity

    export let state = Object.create(null)
    export let id = Math.random()
    export let metaFunction = null
    export let offlineFunction = null
    export let versionFunction = null

    $: saveInfo = State.saveInfo

    let lastSaved = performance.now()
    let saveTimeout = null

    //commands from State
    Trigger.on("internal-command-save-game", saveGame)
    Trigger.on("internal-command-load-game", loadGame)
    Trigger.on("internal-command-import-save", loadData)
    Trigger.on("internal-command-export-save", exportSave)
    Trigger.on("internal-command-reset-game", resetGame)

    for (const event of State.config.actionsaveEvents) {
        Trigger.on(event, planActionsave)
            .setPriority(PRIORITY_LAST)
    }

    for (const event of State.config.backupEvents) {
        Trigger.on(event, backupSave, event)
            .setPriority(PRIORITY_FIRST)
    }

    const autosaveInterval = State.autosaveInterval
    const saveInterval = svelteInterval(saveGame, $autosaveInterval)
    $: saveInterval.changeInterval($autosaveInterval)

    async function saveGame(slot = State.config.autosaveSlot) {
        clearTimeout(saveTimeout)
        saveTimeout = null
        lastSaved = performance.now()   //in case save compression gets stuck somehow

        const saveData = await prepareSave()
        lastSaved = performance.now()
        localStorage[State.getSlotName(slot)] = saveData

        State.updateSaveInfo([slot])
        Trigger("game-saved", slot)
    }

    function planActionsave() {
        if (saveTimeout || !State.config.actionsaveActive)
            return
        const sinceLastSave = performance.now() - lastSaved
        if (sinceLastSave > State.config.actionsaveInterval) {
            saveGame()
            return
        }
        saveTimeout = setTimeout(saveGame, State.config.actionsaveInterval - sinceLastSave)
    }

    function backupSave(reason = null) {
        saveGame(reason === null
            ? State.config.backupSlot
            : `${State.config.backupSlot}_${reason}`
        )
    }

    function loadGame(slot, offlineTime = true) {
        const saveData = localStorage[State.getSlotName(slot)]
        loadData(saveData, offlineTime)
    }

    function resetGame() {
        state = Object.create(null)
        id = Math.random()
        Object.assign(state, structuredClone(State.config.defaultState))
    }


    function loadData(data, offlineTime = true) {
        resetGame()
        const saveData = data?.split(".")?.at(-1) ?? null
        if (!saveData)
            return
        const save = SaveProcessor.decode(saveData)
        if (save?._meta) {
            let loadedState = save.state
            loadedState = versionFunction?.(loadedState, save._meta.version) ?? loadedState
            if (offlineTime)
                offlineFunction?.(loadedState, (Date.now() - save._meta.date) / 1000)
            Object.assign(state, loadedState)
        } else {
            Object.assign(state, save)
        }
    }

    async function prepareSave() {
        //this is available after unpacking the save and used by loadData
        const saveData = await SaveProcessor.encodeAsync({
            _meta: {
                version : State.config.saveVersion,
                date : Date.now(),
            },
            state
        })

        //this is available without unpacking the save and used by saveInfo
        const userMeta = metaFunction?.() ?? {}
        const meta = btoa(JSON.stringify({
            _version : State.config.saveVersion,
            _date : Date.now(),
            ...userMeta
        }))

        return `${meta}.${saveData}`
    }

    async function exportSave() {
        navigator.clipboard?.writeText?.(await prepareSave())
            .then(() => alert("Copied to clipboard"))
            .catch(() => alert("Export failed"))
    }

    onMount(() => {
        loadGame()
    })


</script>
