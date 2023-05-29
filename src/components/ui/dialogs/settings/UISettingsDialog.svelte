<script>
    import UIDialog from "utility/dialog/UIDialog.svelte"
    import Settings from "utility/settings/settings.js"
    import interactive from "utility/use-interactive.js"
    import GAME_SETTINGS_CATEGORIES from "utility/settings/game-settings-categories.js"
    import Dialogs from "utility/dialog/dialogs.js"
    import UISettingsDialogSetting from "components/ui/dialogs/settings/UISettingsDialogSetting.svelte"
    import DisplayString from "utility/display-string/display-string.js"
    import svelteInterval from "utility/svelte-interval.js"

    const NUMBERS_CATEGORY = "numbers"
    export let data

    let category = Settings.CATEGORY_LIST[0]
    $: settingsList = Settings.CATEGORY_SETTINGS_LIST[category] ?? []

    let previewNumber = 123456789

    const previewInterval = svelteInterval(updatePreview, 1000)

    function updatePreview(direction = 1) {
        previewNumber *= 10 ** direction
        if (previewNumber > 1e11)
            previewNumber /= 1e20
        if (previewNumber < 1e-9)
            previewNumber *= 1e20
    }

    function advancePreview(direction) {
        previewInterval.delay(10000)
        updatePreview(direction)
    }

    function close() {
        Dialogs.close("settings")
    }

</script>

<UIDialog>
    <div class="vertical gapped relative flex container">
        <div class="centered flex title">Settings</div>
        <div class="close button"
             use:interactive
             on:basicaction={close}
        >
            X
        </div>
        <div class="horizontal gapped flex categories">
            {#each Settings.CATEGORY_LIST as item}
                <div class="category button"
                     class:active={item === category}
                     use:interactive
                     on:basicaction={() => category = item}
                >
                    {GAME_SETTINGS_CATEGORIES[item].displayName ?? "???"}
                </div>
            {/each}
        </div>
        <div class="vertical gapped flex settings">
            {#each settingsList as setting}
                <UISettingsDialogSetting {setting} />
            {/each}
        </div>
        {#if category === NUMBERS_CATEGORY}
            <div class="centered horizontal flex previews"
                 use:interactive
                 on:basicaction={() => advancePreview(1)}
                 on:specialaction={() => advancePreview(-1)}
            >
                <div class="centered flex preview">{DisplayString.time(previewNumber, DisplayString.TIME_FORMATS.DETAILED)}</div>
                <div class="centered flex preview">{DisplayString.number(previewNumber)}</div>
                <div class="centered flex preview">{DisplayString.percentage(previewNumber)}</div>
            </div>
        {/if}
    </div>
</UIDialog>

<style>
    div.title {
        font-size: 2em;
    }

    div.container {
        font-size: 3vmin;
        width: 30em;
        height: 30em;
        padding: 1em;
    }

    div.categories {
        border-radius: 1rem;
    }

    div.button {
        height: 1.5em;
        border-radius: 1rem;
        padding: 0 1em;
    }


    div.settings {
        flex-grow: 1;
        background-color: var(--ui-dialog-supersection-color);
        overflow: hidden auto;
        border-radius: 1rem;
        padding: 1rem;
    }


    div.close.button {
        position: absolute;
        right : 0.5em;
        top : 0.5em;
        width : 1.5em;
        height : 1.5em;
        padding: 0;
    }

    div.previews {
        background-color: var(--ui-dialog-supersection-color);
        overflow: hidden;
        border-radius: 1rem;
        justify-content: space-around;
    }

    div.preview {
        background-color: var(--ui-dialog-section-color);
        border-radius: 1rem;
        width : 6em;
        padding: 0 1em;
    }

</style>