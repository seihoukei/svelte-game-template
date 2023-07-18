import UIMenuDialog from "components/ui/dialogs/menu/UIMenuDialog.svelte"
import UISettingsDialog from "components/ui/dialogs/settings/UISettingsDialog.svelte"

const REGISTERED_UI_ELEMENTS = {
    tooltips: {
    
    },
    
    dialogs: {
        "menu": UIMenuDialog,
        "settings": UISettingsDialog,
    },
}

export default REGISTERED_UI_ELEMENTS
