import {writable} from "svelte/store"

export default class State {
    static config = {
        autosaveSlot: `_Autosave`,
        backupSlot: `_BACKUP`,
        defaultState: {},
        actionsaveActive: true,
        actionsaveEvents: [],
        backupEvents: [],
        autosaveInterval: 60000,
        actionsaveInterval: 2000,
        savePrefix: "Game",
        saveVersion: 1,
    }
    static saveInfo = writable({})
    static autosaveInterval = writable(this.config.autosaveInterval)
    
    static applyConfig(config) {
        Object.assign(this.config, config)
        this.autosaveInterval.set(this.config.autosaveInterval)
    }
    
    static getSlotName(slot = this.config.autosaveSlot) {
        return `${this.config.savePrefix}_Save_${slot}`
    }
    
    static getMetaData(slot) {
        const data = localStorage[this.getSlotName(slot)]
        
        const meta = data?.split(".")?.[0] ?? null
        if (!meta || meta === data)
            return {}
        return JSON.parse(atob(meta))
    }
    
    static updateSaveInfo(slots) {
        this.saveInfo.update(x => {
            for (const slot of slots) {
                x[slot] = this.getMetaData(slot)
            }
            return x
        })
    }
    
    //replaced by SaveStateManager instance
    static save(slot) {}
    static load(slot, procesOffline) {}
    static import(data, processOffline) {}
    static export() {}
    static reset() {}
}
