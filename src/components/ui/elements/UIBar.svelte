<script>
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"
    import Trigger from "utility/trigger-svelte.js"
    import DisplayString from "utility/display-string.js"

    export let bar
</script>

{#if bar}
     <div class="bar">
        <UIProgressBar
                max={bar.max}
                current={bar.current}
                caption={`${DisplayString.number(bar.current)} / ${DisplayString.shortNumber(bar.max)}`}
        />
    </div>
{/if}

<style>
    div.bar {
        height: 50px;
    }
</style>
