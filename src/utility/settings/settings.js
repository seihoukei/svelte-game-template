import GAME_SETTINGS from "utility/settings/game-settings.js"
import GAME_SETTINGS_CATEGORIES from "utility/settings/game-settings-categories.js"

export default class Settings {
    static DEFAULTS = this.#getDefaults()
    static GLOBAL_SETTINGS_LIST = this.#getGlobalList()
    static CATEGORY_LIST = Object.keys(GAME_SETTINGS_CATEGORIES)
    static CATEGORY_SETTINGS_LIST = this.#getCategoryLists()
    
    static config = {
        globalPrefix: "Game",
    }
    
    static #getDefaults() {
        const result = {}
        for (const [id, data] of Object.entries(GAME_SETTINGS)) {
            result[id] = data.defaultValue ?? data.values?.[0] ?? 0
        }
        return result
    }
    
    static #getCategoryLists() {
        const result = {}
        for (const category of this.CATEGORY_LIST) {
            result[category] = Object.keys(GAME_SETTINGS)
                .filter(x => GAME_SETTINGS[x]?.category === category)
        }
        return result
    }
    
    static #getGlobalList() {
        return Object.keys(GAME_SETTINGS)
            .filter(x => GAME_SETTINGS[x].global)
    }
    
    static loadGlobal() {
        return JSON.parse(localStorage[`${this.config.prefix}_settings`] ?? "{}")
    }
    
    static saveGlobal(settings) {
        const globalSettings = {}
        for (const item of this.GLOBAL_SETTINGS_LIST) {
            globalSettings[item] = settings[item] ?? GAME_SETTINGS[item].defaultValue
        }
        localStorage[`${this.config.prefix}_Settings`] = JSON.stringify(globalSettings)
    }
}
