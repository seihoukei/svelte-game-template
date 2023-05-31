import {writable} from "svelte/store"
import Trigger from "utility/trigger-svelte.js"

export default class Timer {
    static config = {
        rate : 10,
        boost : 1,
        maxTickTime : 3600,
        maxStepTime : 60,
        svelteTickEveryStep : false,
        event : "command-advance",
    }
    
    static rate = writable(10)
    
    static applyConfig(config) {
        Object.assign(this.config, config)
        this.rate.set(this.config.rate)
    }
    
    static cancelAdvance() {
        Trigger("internal-command-cancel-advance")
    }
}
