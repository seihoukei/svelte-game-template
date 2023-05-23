import {writable} from "svelte/store"

export default class Dialogs {
    static #dialogs = {}
    
    static openDialogs = writable([])
    
    static register(name, element) {
        this.#dialogs[name] = element
    }
    
    static open(name, data = null) {
        this.openDialogs.update(x => [...x, {
            type : this.#dialogs[name],
            data
        }])
    }
    
    static close(name = null) {
        this.openDialogs.update(x => {
            if (name !== null && x.at(-1)?.type !== this.#dialogs[name])
                return x
            
            return x.slice(0, -1)
        })
    }
    
    static closeAll() {
        this.openDialogs.set([])
    }
}
