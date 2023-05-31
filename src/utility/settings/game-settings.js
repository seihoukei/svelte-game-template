import GAME_CONFIG from "config/game-config.js"
import State from "utility/state/state.js"

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
    
//    numberPostfixes : this.NUMBER_POSTFIXES.DEFAULT,
    numberPostfixes : {
        category: "numbers",
        displayName: "Number postfixes",
        defaultValue: GAME_CONFIG.displayString.numberPostfixes,
        global: true,
        values: [{
            value: "NONE",
            displayName: "None",
        },{
            value: "DEFAULT",
            displayName: "K, M, B, T, ...",
        },{
            value: "LETTERS",
            displayName: "A, B, C, D, ...",
        }]
    },
    numberEThreshold : {
        category: "numbers",
        displayName: "Switch to E notation at numbers above",
        defaultValue: GAME_CONFIG.displayString.numberEThreshold,
        global: true,
        values: [{
            value: 3,
            displayName: "e3 (1K)",
        },{
            value: 6,
            displayName: "e6 (1M)",
        },{
            value: 9,
            displayName: "e9 (1B)",
        },{
            value: 12,
            displayName: "e12 (1T)",
        },{
            value: 15,
            displayName: "e15 (1Qa)",
        },{
            value: 300,
            displayName: "Never",
        }]
    },
    numberEFractionThreshold : {
        category: "numbers",
        displayName: "Switch to E notation at numbers below",
        defaultValue: GAME_CONFIG.displayString.numberEFractionThreshold,
        global: true,
        values: [{
            value: 0,
            displayName: "0",
        },{
            value: -1,
            displayName: "0.1",
        },{
            value: -2,
            displayName: "0.01",
        },{
            value: -3,
            displayName: "0.001",
        },{
            value: -4,
            displayName: "0.0001",
        }]
    },
    numberDynamicDigits : {
        category: "numbers",
        displayName: "Dynamic decimal digits amount",
        defaultValue: GAME_CONFIG.displayString.numberDynamicDigits,
        toggle : true,
        global : true,
        values: [{
            value : false,
        }, {
            value : true,
        }],
    },
    
    numberSignificantFigures : {
        category: "numbers",
        displayName: "Significant figures to display (if shortened)",
        displayCondition : (settings) => settings?.numberDynamicDigits,
        defaultValue: GAME_CONFIG.displayString.numberDigits,
        global : true,
        values: [{
            value : 1,
        }, {
            value : 2,
        }, {
            value : 3,
        }, {
            value : 4,
        }],
    },
    
    numberDecimalDigits : {
        category: "numbers",
        displayName: "Decimal digits to display",
        displayCondition : (settings) => !settings?.numberDynamicDigits,
        defaultValue: GAME_CONFIG.displayString.numberDigits,
        global : true,
        values: [{
            value : 0,
        }, {
            value : 1,
        }, {
            value : 2,
        }, {
            value : 3,
        }, {
            value : 4,
        }],
    },
    
    numberShowTrailingZeroes : {
        category: "numbers",
        displayName: "Display trailing zeroes",
        defaultValue: !GAME_CONFIG.displayString.numberCutTrailingZeroes,
        toggle : true,
        global : true,
        values: [{
            value : false,
        }, {
            value : true,
        }],
    },
    
    numberEStep : {
        category: "numbers",
        displayName: "E notation",
        defaultValue: GAME_CONFIG.displayString.numberEStep,
        global : true,
        values: [{
            value : 1,
            displayName: "Scientific",
        }, {
            value : 3,
            displayName: "Engineering",
        }],
    },
    
    numberEPlus : {
        category: "numbers",
        displayName: "Display + for positive E values",
        defaultValue: GAME_CONFIG.displayString.numberEPlus,
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
