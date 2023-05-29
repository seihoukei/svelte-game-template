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

export default GAME_SETTINGS_CATEGORIES
