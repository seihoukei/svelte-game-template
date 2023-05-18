<script>
    import {onDestroy, onMount} from "svelte"
    import SaveProcessor from "utility/save-processor.js"
    import Trigger from "utility/trigger-svelte.js"

    const AUTOSAVE_SLOT = `_Autosave`
    const BACKUP_SLOT = `_BACKUP`
    const PRIORITY_FIRST = -Infinity
    const PRIORITY_LAST = Infinity

    export let state = Object.create(null)
    export let id = Math.random()
	export let prefix = "Svelte_Game"
    export let defaultState = {}
    export let autosaveInterval = 60000
    export let actionsaveInterval = 5000
    export let metaFunction = null
    export let offlineFunction = null

    export let actionsaveEvents = []
    export let backupEvents = []

    let saveInfo = {}

    let lastSaved = performance.now()
    let saveTimeout = null

    Trigger.on("command-save-game", saveGame)
    Trigger.on("command-load-game", loadGame)
    Trigger.on("command-import-save", loadData)
    Trigger.on("command-export-save", exportSave)
    Trigger.on("command-reset-game", resetGame)
    Trigger.on("command-update-save-info", updateInfo)

    for (const event of actionsaveEvents) {
        Trigger.on(event, planSave)
            .setPriority(PRIORITY_LAST)
    }
    for (const event of backupEvents) {
        Trigger.on(event, backupSave, event)
            .setPriority(PRIORITY_FIRST)
    }

    $: updateInterval(autosaveInterval)

    function getSlotName(slot = AUTOSAVE_SLOT) {
        if (slot === "")
            slot = AUTOSAVE_SLOT
        return `${prefix}_Save_${slot}`
    }

    async function saveGame(slot = AUTOSAVE_SLOT) {
        clearTimeout(saveTimeout)
        saveTimeout = null
        lastSaved = performance.now()   //in case save compression gets stuck somehow

        const saveData = await prepareSave()
        lastSaved = performance.now()
        localStorage[getSlotName(slot)] = saveData
        updateInfo([slot])

        Trigger("game-saved", slot)
    }

    function planSave() {
        if (saveTimeout)
            return
        const sinceLastSave = performance.now() - lastSaved
        if (sinceLastSave > actionsaveInterval) {
            saveGame()
            return
        }
        saveTimeout = setTimeout(saveGame, actionsaveInterval - sinceLastSave)
    }

    function backupSave(reason = null) {
        saveGame(reason === null
            ? BACKUP_SLOT
            : `${BACKUP_SLOT}_${reason}`
        )
    }

    function loadGame(slot, offlineTime = true) {
        const saveData = localStorage[getSlotName(slot)]
        loadData(saveData, offlineTime)
        Trigger("game-loaded", slot)
    }

    function resetGame() {
        state = Object.create(null)
        id = Math.random()
        Object.assign(state, defaultState)
        Trigger("game-reset")
    }

    let interval = null
    function updateInterval(time) {
        if (interval)
            clearInterval(interval)
        interval = setInterval(saveGame, time)
    }

    function loadData(data, offlineTime = true) {
        const saveData = data?.split(".")?.at(-1) ?? null
        if (!saveData)
            return
        resetGame()
        const save = SaveProcessor.decode(saveData)
        if (save?._meta) {
            const loadedState = save.state
            if (offlineTime)
                offlineFunction?.(loadedState, (Date.now() - save._meta.date) / 1000)
            Object.assign(state, loadedState)
        } else {
            Object.assign(state, save)
        }
    }

    async function prepareSave() {
        const saveData = await SaveProcessor.encodeAsync({
            _meta: {
                date : Date.now(),
            },
            state
        })

        const userMeta = metaFunction?.() ?? {}
        const meta = btoa(JSON.stringify({
            _version : 1,
            _date : Date.now(),
            ...userMeta
        }))

        return `${meta}.${saveData}`
    }

    function getMetaData(slot = AUTOSAVE_SLOT) {
        const data = localStorage[getSlotName(slot)]
        const meta = data?.split(".")?.[0] ?? null
        if (!meta || meta === data)
            return {}
        return JSON.parse(atob(meta))
    }

    async function exportSave() {
        navigator.clipboard?.writeText?.(await prepareSave())
            .then(() => alert("Copied to clipboard"))
            .catch(() => alert("Export failed"))
    }

    function updateInfo(slots) {
        for (const slot of slots) {
            saveInfo[slot] = getMetaData(slot)
        }
        Trigger("save-info-updated", saveInfo)
    }

    onMount(() => {
        loadGame()
    })

    onDestroy(() => {
        clearInterval(interval)
    })

</script>
