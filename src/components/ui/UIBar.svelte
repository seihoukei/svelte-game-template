<script>
    import UIProgressBar from "components/ui/elements/UIProgressBar.svelte"
    import Trigger from "utility/trigger-svelte.js"

    export let bar
</script>

{#if bar}
     <div class="bar">
        <UIProgressBar
                max={bar.max}
                current={bar.current}
                caption={`${bar.current?.toFixed(2)} / ${bar.max?.toFixed(2)}`}
        />
    </div>
{/if}

<style>
    div.bar {
        height: 50px;
    }
</style>
