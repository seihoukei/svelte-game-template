import GAME_CONFIG from "config/game-config.js"
import State from "utility/state/state.js"

//todo: global

const GAME_SETTINGS = {
    dataFPS: {
        category: "general",
        displayName : "Refresh rate",
        defaultValue : GAME_CONFIG.timer.rate,
        global : true,
        values : [{
            value : 1,
        },{
            value : 5,
        },{
            value : 10,
        },{
            value : 30,
        },{
            value : 60,
        }],
    },
    autosaveInterval: {
        category: "general",
        displayName: "Autosave interval",
        defaultValue: GAME_CONFIG.state.autosaveInterval,
        global: true,
        values: [{
            displayName : "5 sec",
            value : 5000,
        },{
            displayName : "15 sec",
            value : 15000,
        },{
            displayName : "1 min",
            value : 60000,
        },{
            displayName : "5 min",
            value : 300000,
        },{
            displayName : "Never",
            value : 1e90,
        }]
    },
    actionsave: {
        category: "general",
        displayName: "Autosave game after important player actions",
        displayCondition : () => State.config.actionsaveEvents?.length > 0,
        defaultValue: GAME_CONFIG.state.actionsaveActive,
        toggle : true,
        global : true,
        values: [{
            value : false,
        }, {
            value : true,
        }],
    },
    
    ...GAME_CONFIG.settings.customSettings
}

export default GAME_SETTINGS
