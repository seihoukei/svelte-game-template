const GAME_CONFIG = {
    state: {
        defaultState : Object.freeze({
        
        }),

        savePrefix: "Svelte_Game",
        saveVersion: 1,
        
        // important events to autosave game shortly after
        actionsaveEvents: ["bar-maxed"],
        // important events to create a backup before
        autobackupEvents: [],
        
        autosaveInterval: 60000,
        // minimum time between saves (with actionsaves)
        minimumInterval: 2000,
    },
    
    timer: {
        maxTickTime: 3600,
        maxStepTime: 60,
        rate : 30,
        boost : 1,
    },
    
    tooltip: {
        delay : 500,
    },
}

export default GAME_CONFIG
