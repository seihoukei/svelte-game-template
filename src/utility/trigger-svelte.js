import {onDestroy, onMount} from "svelte"

class TriggerEventHandler {
    #event = null
    args = []
    callback = null
    once = false
    #priority = 0
    
    constructor(event = null, callback = null, args = []) {
        if (event === null) {
            throw new Error("Trigger can't have empty event")
        }
        if (callback === null) {
            throw new Error("Trigger can't have empty callback")
        }
        
        this.#event = event
        this.callback = callback
        this.args = args
    }
    
    getEvent() {
        return this.#event
    }
    
    cancel() {
        Trigger.cancelHandler(this)
        this.#event = null
    }
    
    execute(...args) {
        if (this.once)
            Trigger.cancelHandler(this)
        return this.callback(...this.args, ...args)
    }
    
    setPriority(priority) {
        this.#priority = priority
        Trigger.updatePriorities(this.#event)
        return this
    }
    
    getPriority() {
        return this.#priority
    }
}

const Trigger = Object.assign(function(event, ...args) {
    Trigger._processHandlers(event, args)
    
}, {
    _handlers : new Map(),
    
    _prioritiesUsed : false,
    
    _processHandlers(event, args) {
        const handlers = this._handlers.get(event) ?? []
        for (let handler of handlers) {
            handler.execute(...args)
        }
    },
    
    attachHandler(handler) {
        const event = handler.getEvent()
        const eventHandlers = this._handlers.get(event) ?? []
        eventHandlers.push(handler)
        if (this._prioritiesUsed)
            this.updatePriorities(handler)
        this._handlers.set(event, eventHandlers)
    },
    
    collect(event, ...args) {
        const handlers = this._handlers.get(event) ?? []
        const results = []
        for (const handler of handlers) {
            results.push(handler.execute(...args))
        }
        return results
    },
    
    cancelHandler(handler) {
        const event = handler.getEvent()
        const eventHandlers = this._handlers.get(event)
        this._handlers.set(event, eventHandlers.filter(x => x !== handler))
    },
    
    createEventHandler (event, callback, ...args) {
        const handler = new TriggerEventHandler(event, callback, args)
        this.attachHandler(handler)
        return handler
    },
    
    updatePriorities(event) {
        this._prioritiesUsed = true
        const handlers = this._handlers.get(event) ?? []
        handlers.sort((x, y) => x.getPriority() - y.getPriority())
    },
    
    on(event, callback, ...args) {
        const promise = new Promise(resolve => {
            let handler = null
    
            onMount(() => {
                handler = this.createEventHandler(event, callback, ...args)
                resolve(handler)
            })
    
            onDestroy(() => {
                handler?.cancel?.()
            })
        })
        
        promise.setPriority = (priority) => promise.then(x => x.setPriority(priority))
        
        return promise
    },
    
    async once (event, callback, ...args) {
        const handler = await this.on(event, callback, ...args)
        handler.once = true
        return handler
    },
    
})

export default Trigger
