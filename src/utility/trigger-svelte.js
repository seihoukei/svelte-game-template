import {onDestroy, onMount} from "svelte"

class TriggerHandler {
    priority = 0
    once = false
    cancelled = false
    
    constructor(list, callback, args = []) {
        this.list = list
        this.args = args
        this.callback = callback
    }
    
    execute(args) {
        if (this.once)
            this.cancel()
        
        return this.callback(...this.args, ...args)
    }
    
    apply(input, args) {
        if (this.once)
            this.cancel()
        
        return this.callback(input, ...this.args, ...args)
    }
    
    cancel() {
        this.cancelled = true
        this.list.queuePurge()
        return this
    }
    
    setPriority(value = 0) {
        this.priority = value
        this.list.queuePriorityUpdate()
        return this
    }
    
    setOnce(value = true) {
        this.once = value
        return this
    }
}


class TriggerHandlerList {
    #handlers = []
    #usesPriorities = false
    #needsPriorityUpdate = false
    #needsPurge = false
    
    constructor(trigger) {
        this.trigger = trigger
    }
    
    addHandler(callback, args) {
        const handler = new TriggerHandler(this, callback, args)
        this.#handlers.push(handler)
        
        if (this.#usesPriorities)
            this.queuePriorityUpdate()
        
        return handler
    }
    
    execute(args) {
        if (this.#needsPriorityUpdate)
            this.#updatePriorities()
        
        for (const handler of this.#handlers)
            if (!handler.cancelled)
                handler.execute(args)
    }
    
    poll(args) {
        this.#updatePriorities()
        
        const result = []
        for (const handler of this.#handlers)
            if (!handler.cancelled)
                result.push(handler.execute(args))
        
        this.#purge()
        
        return result
    }
    
    transform(input, args) {
        if (this.#needsPriorityUpdate)
            this.#updatePriorities()
        
        let result = input
        for (const handler of this.#handlers)
            if (!handler.cancelled)
                result = handler.apply(input, args)
        
        return result
    }
    
    clear() {
        for (const handler of this.#handlers)
            handler.cancel()
        this.#handlers.clear()
    }
    
    queuePriorityUpdate() {
        this.#needsPriorityUpdate = true
        this.#usesPriorities = true
    }
    
    queuePurge() {
        this.#needsPurge = true
    }
    
    #updatePriorities() {
        if (!this.#needsPriorityUpdate)
            return
        
        this.#purge()
        
        this.#handlers.sort((x,y) => x.priority - y.priority)
        this.#needsPriorityUpdate = false
    }
    
    #purge() {
        if (!this.#needsPurge)
            return
        
        this.#handlers = this.#handlers.filter(x => !x.cancelled)
        this.#needsPurge = false
    }
}

const handlers = new Map()
const modifiers = new Map()

function getHandlerList(lists, trigger, create = false) {
    const list = lists.get(trigger)
    if (list)
        return list
    
    if (!create)
        return null
    
    const newList = new TriggerHandlerList(trigger)
    lists.set(trigger, newList)
    
    return newList
}

function createHandler(lists, trigger, callback, ...args) {
    const list = getHandlerList(lists, trigger, true)
    const handler = list.addHandler(callback, args)
    return handler
}

function createSvelteHandler(lists, trigger, callback, ...args) {
    const promise = new Promise(resolve => {
        let handler = null
        
        onMount(() => {
            handler = createHandler(lists, trigger, callback, ...args)
            resolve(handler)
        })
        
        onDestroy(() => {
            handler?.cancel?.()
        })
    })
    
    // for seamless chaining
    promise.setPriority = (priority = 0) => {
        promise.then(x => x.setPriority(priority))
        return promise
    }

    promise.setOnce = (value = true) => {
        promise.then(x => x.setOnce(value))
        return promise
    }

    promise.cancel = () => {
        promise.then(x => x.cancel())
        return promise
    }
    
    return promise
}

const Trigger = Object.assign(function(trigger, ...args) {
    Trigger.execute(trigger, ...args)
    
}, {
    
    // executors
    
    execute(trigger, ...args) {
        getHandlerList(handlers, trigger)?.execute(args)
    },
    
    poll(trigger, ...args) {
        return getHandlerList(handlers, trigger)?.poll(args) ?? []
    },
    
    transform(input, trigger, ...args) {
        return getHandlerList(modifiers, trigger)?.transform(input, args) ?? input
    },
    
    // svelte constructors
    
    handle(trigger, callback, ...args) {
        return createSvelteHandler(handlers, trigger, callback, ...args)
    },
    
    modify(trigger, callback, ...args) {
        return createSvelteHandler(modifiers, trigger, callback, ...args)
    },
    
    // vanilla constructors
    
    createHandler(trigger, callback, ...args) {
        return createHandler(handlers, trigger, callback, ...args)
    },
    
    createModifier(trigger, callback, ...args) {
        return createHandler(modifiers, trigger, callback, ...args)
    },
    
    // general use
    
    createTrigger() {
        return function trigger (...args) {
            Trigger(trigger, ...args)
        }
    },
    
    clearTrigger(trigger) {
        getHandlerList(handlers, trigger, false).clear()
        handlers.delete(trigger)
    
        getHandlerList(modifiers, trigger, false).clear()
        modifiers.delete(trigger)
    },
    
    // shorthands
    
    on(trigger, callback, ...args) { //identical to handle
        return createSvelteHandler(handlers, trigger, callback, ...args)
    },
    
    once(trigger, callback, ...args) {
        return createSvelteHandler(handlers, trigger, callback, ...args).setOnce()
    },
})

export default Trigger
