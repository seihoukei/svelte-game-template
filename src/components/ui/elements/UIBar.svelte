<script>
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"

    import DisplayString from "utility/display-string/display-string.js"

    import tooltip from "utility/tooltip/use-tooltip.js"

    const BAR_COLORS = [
        '#337777',
        '#333377',
        '#773377',
        '#773333',
        '#777733',
        '#337733',
    ]

    export let bar
    export let index = 0

    $: fgcolor = BAR_COLORS[index % BAR_COLORS.length]
</script>

{#if bar}
     <div class="bar"
          use:tooltip={{bar:index}}
     >
        <UIProgressBar
                max={bar.max}
                current={bar.current}
                caption={`${DisplayString.number(bar.current)} / ${DisplayString.shortNumber(bar.max)}`}
                {fgcolor}
        />
    </div>
{/if}

<style>
    div.bar {
        min-height: 50px;
    }
</style>
