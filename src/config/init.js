import UIMenuDialog from "components/ui/dialogs/UIMenuDialog.svelte"
import UIBarTooltip from "components/ui/tooltips/UIBarTooltip.svelte"

import DisplayString from "../utility/display-string.js"
import Wakelock from "../utility/wakelock.js"
import Dialogs from "utility/dialog/dialogs.js"
import Tooltips from "utility/tooltip/tooltips.js"
import State from "utility/state/state.js"

import GAME_CONFIG from "config/game-config.js"
import Timer from "utility/timer/timer.js"

export default function init() {
    Wakelock.enable()
    
    DisplayString.addReplacer({
            search: /~(.*?)~/g,
            html:`<span class="$1 inline-icon"></span>`,
            text:`$1`,
        })
    
    Dialogs.register("menu", UIMenuDialog)
    
    Tooltips.register("bar", UIBarTooltip)
    
    State.applyConfig(GAME_CONFIG.state)
    Timer.applyConfig(GAME_CONFIG.timer)
    Tooltips.applyConfig(GAME_CONFIG.tooltip)
}
