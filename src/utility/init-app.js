import UIModalDialog from "utility/dialog/UIModalDialog.svelte"

import DisplayString from "utility/display-string/display-string.js"
import Wakelock from "utility/wakelock.js"
import Dialogs from "utility/dialog/dialogs.js"
import Tooltips from "utility/tooltip/tooltips.js"
import State from "utility/state/state.js"
import Timer from "utility/timer/timer.js"
import Settings from "utility/settings/settings.js"

import GAME_CONFIG from "config/game-config.js"
import REGISTERED_UI_ELEMENTS from "config/registered-ui-elements.js"

export default function initApp() {
    document.title = GAME_CONFIG.title
    
    if (GAME_CONFIG.wakelock?.enabled)
        Wakelock.enable()
    
    Dialogs.register("_modal_dialog", UIModalDialog)
    for (const [name, component] of Object.entries(REGISTERED_UI_ELEMENTS.dialogs ?? {})) {
        Dialogs.register(name, component)
    }
    
    for (const [name, component] of Object.entries(REGISTERED_UI_ELEMENTS.tooltips ?? {})) {
        Tooltips.register(name, component)
    }
    
    DisplayString.setTimeFormats(GAME_CONFIG.displayStringFormats?.TIME ?? {})
    DisplayString.setStringFormats(GAME_CONFIG.displayStringFormats?.STRING ?? {})
    DisplayString.setNumberFormats(GAME_CONFIG.displayStringFormats?.NUMBER ?? {})
    DisplayString.applyConfig(GAME_CONFIG.displayString)
    
    State.applyConfig(GAME_CONFIG.state)
    Timer.applyConfig(GAME_CONFIG.timer)
    Tooltips.applyConfig(GAME_CONFIG.tooltip)
    Settings.config.globalPrefix = GAME_CONFIG.settings.globalPrefix
}
