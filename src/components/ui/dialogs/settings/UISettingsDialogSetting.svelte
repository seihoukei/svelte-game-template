<script>
    import game from "stores/store-game.js"
    import Settings from "utility/settings/settings.js"
    import interactive from "utility/use-interactive.js"
    import GAME_SETTINGS from "utility/settings/game-settings.js"

    export let setting
    export let checked

    $: settings = $game?.state?.settings ?? {}
    $: data = GAME_SETTINGS[setting] ?? {}
    $: currentValue = settings[setting]

    $: checked = isChecked(setting)

    function isChecked() {
        return currentValue === data.values?.[1]?.value
    }

    function toggle(){
        Settings.set(setting, data.values[checked?1:0].value)
    }

    function set(value) {
        Settings.set(setting, value)
    }
</script>

{#if !data.displayCondition || data.displayCondition(settings)}
    {#if data.toggle}
        <div class="centered flex dialog-section setting">
            <label>
                <input type="checkbox"
                       bind:checked
                       on:change={toggle}
                >
                <span class="name">{data.displayName}</span>
            </label>
        </div>
    {:else}
        <div class="vertical centered flex dialog-section setting">
            <div class="name">
                {data.displayName ?? "???"}
            </div>
            <div class="horizontal gapped flex values">
                {#each data.values as value}
                    <div class="value button"
                         class:active={currentValue === value.value}
                         class:default={data.defaultValue === value.value}
                         use:interactive
                         on:basicaction={() => set(value.value)}
                    >{value.displayName ?? value.value ?? "???"}</div>
                {/each}
            </div>
        </div>
    {/if}
{/if}


<style>
    div.setting {
        border-radius: 1rem;
        padding: 0.5rem 0;
        row-gap: 0.5rem;
    }

    div.setting label {
        cursor: pointer;
        width: 100%;
        text-align: center;
    }

    div.setting label input {
        transform: scale(1.5, 1.5) translate(0, -0.1em);
    }

    div.values {
        flex-wrap : wrap;
        justify-content: center;
    }

    div.value.button {
        height: 1.5em;
        min-width: 2em;
        padding: 0 1em;
        border-radius: 1rem;
    }

</style>
