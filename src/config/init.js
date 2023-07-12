import UIMenuDialog from "components/ui/dialogs/menu/UIMenuDialog.svelte"
import UIModalDialog from "utility/dialog/UIModalDialog.svelte"
import UISettingsDialog from "components/ui/dialogs/settings/UISettingsDialog.svelte"

import DisplayString from "utility/display-string/display-string.js"
import Wakelock from "utility/wakelock.js"
import Dialogs from "utility/dialog/dialogs.js"
import Tooltips from "utility/tooltip/tooltips.js"
import State from "utility/state/state.js"
import Timer from "utility/timer/timer.js"
import Settings from "utility/settings/settings.js"

import GAME_CONFIG from "config/game-config.js"
import DISPLAY_STRING_FORMATS from "config/display-string-formats.js"

export default function init() {
    document.title = GAME_CONFIG.title
    
    Wakelock.enable()

    Dialogs.register("_modal_dialog", UIModalDialog)
    Dialogs.register("menu", UIMenuDialog)
    Dialogs.register("settings", UISettingsDialog)
    
    DisplayString.setTimeFormats(DISPLAY_STRING_FORMATS.TIME)
    DisplayString.setStringFormats(DISPLAY_STRING_FORMATS.STRING)
    DisplayString.setNumberFormats(DISPLAY_STRING_FORMATS.NUMBER)
    DisplayString.applyConfig(GAME_CONFIG.displayString)
    
    State.applyConfig(GAME_CONFIG.state)
    Timer.applyConfig(GAME_CONFIG.timer)
    Tooltips.applyConfig(GAME_CONFIG.tooltip)
    Settings.config.globalPrefix = GAME_CONFIG.settings.globalPrefix
}
