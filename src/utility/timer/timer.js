import {writable} from "svelte/store"

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

    //replaced by GameTimer instance
    static cancelAdvance() {}
}
