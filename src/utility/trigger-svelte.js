import {onDestroy, onMount} from "svelte"

const Trigger = Object.assign(function(event, ...args) {
    Trigger.trigger(event, ...args)
    
}, {
    Handler : class TriggerHandler {
        priority = 0
        once = false
        cancelled = false
        
        constructor(event, callback, args = []) {
            this.event = event
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
            this.event.queuePurge()
            return this
        }
        
        setPriority(value = 0) {
            this.priority = value
            this.event.queuePriorityUpdate()
            return this
        }
        
        setOnce(value = true) {
            this.once = value
            return this
        }
    },
    
    Event : class TriggerEvent {
        #handlers = []
        #usesPriorities = false
        #needsPriorityUpdate = false
        #needsPurge = false
        
        constructor(event) {
            this.event = event
        }
        
        addHandler(callback, args) {
            const handler = new Trigger.Handler(this, callback, args)
            this.#handlers.push(handler)
            
            if (this.#usesPriorities)
                this.queuePriorityUpdate()
            
            return handler
        }
        
        trigger(args) {
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
    },
    
    _handlers : new Map(),
    _modifiers : new Map(),

    _registerHandler(list, event, callback, ...args) {
        const triggerEvent = list.get(event) ?? new Trigger.Event(event)
        list.set(event, triggerEvent)
        const handler = triggerEvent.addHandler(callback, args)
        return handler
    },

    _registerSvelteHandler(list, event, callback, ...args) {
        const promise = new Promise(resolve => {
            let handler = null
        
            onMount(() => {
                handler = this._registerHandler(list, event, callback, ...args)
                resolve(handler)
            })
        
            onDestroy(() => {
                handler?.cancel?.()
            })
        })
    
        // for seamless chaining
        promise.setPriority = (priority = 0) => promise.then(x => x.setPriority(priority))
        promise.setOnce = (value = true) => promise.then(x => x.setOnce(value))
        promise.cancel = () => promise.then(x => x.cancel())
    
        return promise
    },
    
    trigger(event, ...args) {
        this._handlers.get(event)?.trigger(args)
    },
    
    poll(event, ...args) {
        return this._handlers.get(event)?.poll(args) ?? []
    },
    
    transform(input, event, ...args) {
        return this._modifiers.get(event)?.transform(input, args) ?? input
    },
    
    handle(event, callback, ...args) {
        return this._registerSvelteHandler(this._handlers, event, callback, ...args)
    },
    
    modify(event, callback, ...args) {
        return this._registerSvelteHandler(this._modifiers, event, callback, ...args)
    },
    
    createHandler(event, callback, ...args) {
        return this._registerHandler(this._handlers, event, callback, ...args)
    },
    
    createModifier(event, callback, ...args) {
        return this._registerHandler(this._modifiers, event, callback, ...args)
    },
    
    clearEvent(event) {
        this._handlers?.get(event).clear()
        this._handlers.delete(event)
        
        this._modifiers?.get(event).clear()
        this._modifiers.delete(event)
    },
    
    on(event, callback, ...args) { //identical to handle
        return this._registerSvelteHandler(this._handlers, event, callback, ...args)
    },
    
    once(event, callback, ...args) {
        return this._registerSvelteHandler(this._handlers, event, callback, ...args).setOnce()
    },
})

export default Trigger
