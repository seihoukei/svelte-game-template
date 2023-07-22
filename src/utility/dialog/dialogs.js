import {writable} from "svelte/store"

export default class Dialogs {
    static RESULTS = {
        NO : 0,
        YES : 1,
        CANCEL : 2,
        OK : 3,
        ALL : 4,
    }
    
    static BUTTONS = {
        OK : {
            text: "OK",
            result: this.RESULTS.OK,
        },
        CANCEL : {
            text : "Cancel",
            result : this.RESULTS.CANCEL
        },
        YES : {
            text: "Yes",
            result: this.RESULTS.YES
        },
        NO : {
            text : "No",
            result : this.RESULTS.NO
        },
        ALL : {
            text : "All",
            result : this.RESULTS.ALL
        },
    }
    
    static BUTTON_SETS = {
        OK : [
            this.BUTTONS.OK,
        ],
        OK_CANCEL : [
            this.BUTTONS.OK,
            this.BUTTONS.CANCEL,
        ],
        YES_NO : [
            this.BUTTONS.YES,
            this.BUTTONS.NO,
        ],
    }
    
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
    static cancel(name = null) {
        this.openDialogs.update(x => {
            if (name !== null && x.at(-1)?.type !== this.#dialogs[name])
                return x
    
            const dialog = x.at(-1)
            dialog?.data?.resolve(dialog?.data?.cancelValue ?? null)
    
            return x.slice(0, -1)
        })
    }
    
    static closeAll() {
        this.openDialogs.set([])
    }
    
    static async generic(data) {
        return new Promise(resolve =>
            this.open("_generic_dialog", {
                ...data,
                resolve,
            })
        )
    }
    
    static async confirm(prompt, {
        buttons = this.BUTTON_SETS.YES_NO,
        cancellable = true,
        cancelValue = null,
    } = {}) {
        return this.generic({
            message : prompt,
            buttons,
            cancellable,
            cancelValue,
        })
    }
    
    static async ask(prompt, {
        buttons = this.BUTTON_SETS.YES_NO,
        cancellable = true,
        cancelValue = null,
    } = {}) {
        return this.generic({
            message : prompt,
            buttons,
            cancellable, cancelValue,
        })
    }
    
    static async alert(message, {
        buttons = this.BUTTON_SETS.OK
    } = {}) {
        return this.generic({
            message,
            buttons,
        })
    }
    
    static async prompt(prompt, {
        defaultValue = "",
        inputHint = "",
        validation,
        cancellable = true,
        cancelValue = null,
    } = {}) {
        return this.generic({
            message: prompt,
            isInput : true,
            buttons : [{
                ...this.BUTTONS.OK,
                confirm : true,
                validation,
            },
                this.BUTTONS.CANCEL
            ],
            defaultValue, inputHint, cancellable, cancelValue
        })
    }
    
    static async promptNumber(prompt, {
        defaultValue = "",
        inputHint = "",
        validation,
        cancellable = true,
        cancelValue = null,
    } = {}) {
        return this.generic({
            message: prompt,
            isInput : true,
            isNumber : 1,
            buttons : [{
                ...this.BUTTONS.OK,
                confirm : true,
                validation,
            },
                this.BUTTONS.CANCEL
            ],
            defaultValue, inputHint, cancellable, cancelValue
        })
    }
}
