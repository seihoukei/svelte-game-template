<script>
    import SettingWatcher from "config/SettingWatcher.svelte"
    import Settings from "utility/settings/settings.js"
    import GAME_SETTINGS from "utility/settings/game-settings.js"

    // Attach to Settings
    Settings.set = setSetting

    export let settings = {}

    // fill in defaults for new state or new settings for older loaded state
    // and override global settings if available
    settings = Object.assign({}, Settings.DEFAULTS, settings, Settings.loadGlobal())

    function setSetting(id, value = settings[id]) {
        settings[id] = value
        if (GAME_SETTINGS[id].global)
            Settings.saveGlobal(settings)
    }
</script>

<SettingWatcher {settings} />
