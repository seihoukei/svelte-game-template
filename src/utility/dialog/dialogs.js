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
    
    static closeAll() {
        this.openDialogs.set([])
    }
    
    static async modal(data) {
        return new Promise(resolve =>
            this.open("_modal_dialog", {
                ...data,
                resolve,
            })
        )
    }
    
    static async confirm(prompt, buttons = this.BUTTON_SETS.YES_NO) {
        return this.modal({
            message : prompt,
            buttons,
        })
    }
    
    static async ask(prompt, buttons = this.BUTTON_SETS.YES_NO) {
        return this.modal({
            message : prompt,
            buttons,
        })
    }
    
    static async alert(message, buttons = this.BUTTON_SETS.OK) {
        return this.modal({
            message,
            buttons,
        })
    }
    
    static async prompt(prompt, defaultValue = "", inputHint = "", validation) {
        return this.modal({
            message: prompt,
            isInput : true,
            buttons : [{
                text: "OK",
                validation,
                result: this.RESULTS.OK
            },{
                text : "Cancel",
                result : this.RESULTS.CANCEL
            }],
            defaultValue, inputHint,
        })
    }
    
    static async promptNumber(prompt, defaultValue = "", inputHint = "", validation) {
        return this.modal({
            message: prompt,
            isInput : true,
            isNumber : 1,
            buttons : [{
                text: "OK",
                confirm : true,
                validation,
                result: this.RESULTS.OK
            },{
                text : "Cancel",
                result : this.RESULTS.CANCEL
            }],
            defaultValue, inputHint,
        })
    }
}
