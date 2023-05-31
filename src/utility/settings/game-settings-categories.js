import GAME_CONFIG from "config/game-config.js"

const GAME_SETTINGS_CATEGORIES = {
    general: {
        displayName : "General",
    },
    display: {
        displayName : "Display",
    },
    numbers: {
        displayName : "Numbers",
    },
    
    ...GAME_CONFIG.settings.customCategories
}

if (import.meta.env.MODE === "development") {
    Object.assign(GAME_SETTINGS_CATEGORIES, {
        debug: {
            displayName: "Debug",
        }
    })
}
export default GAME_SETTINGS_CATEGORIES
