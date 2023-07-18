import UIMenuDialog from "components/ui/dialogs/menu/UIMenuDialog.svelte"
import UISettingsDialog from "components/ui/dialogs/settings/UISettingsDialog.svelte"
import UIBarTooltip from "components/ui/tooltips/UIBarTooltip.svelte"

const REGISTERED_UI_ELEMENTS = {
    tooltips: {
        "bar": UIBarTooltip,
    },
    
    dialogs: {
        "menu": UIMenuDialog,
        "settings": UISettingsDialog,
    },
}

export default REGISTERED_UI_ELEMENTS
