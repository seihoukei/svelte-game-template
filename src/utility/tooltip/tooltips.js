import {writable} from "svelte/store"

export default class Tooltips {
    static config = {
        delay : 500,
    }
    
    static #tooltips = {}
    
    static #timeout = null
    
    static tooltip = writable({})
    
    static applyConfig(config) {
        Object.assign(this.config, config)
    }
    
    static register (type, element) {
        this.#tooltips[type] = element
    }
    
    static get(type) {
       return this.#tooltips[type] ?? null
    }
    
    static setTooltip(data, x, y) {
        clearTimeout(this.#timeout)
        this.#timeout = setTimeout(() => {
            clearTimeout(this.#timeout)
            this.tooltip.set({
                data, x, y
            })
        }, this.config.delay)
    }
    
    static resetTooltip(data) {
        clearTimeout(this.#timeout)
        this.tooltip.update(x => {
            if (x?.data === data) {
                return null
            }
            return x
        })
    }
    
    
}
