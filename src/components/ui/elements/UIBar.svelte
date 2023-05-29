<script>
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"

    import DisplayString from "utility/display-string/display-string.js"

    import tooltip from "utility/tooltip/use-tooltip.js"

    export let bar
</script>

{#if bar}
     <div class="bar"
          use:tooltip={{bar}}
     >
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
