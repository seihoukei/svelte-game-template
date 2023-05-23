<script>
    import Tooltips from "utility/tooltip/tooltips.js"

    $: tooltip = Tooltips.tooltip

    $: data = $tooltip?.data ?? null
    $: x = $tooltip?.x ?? 0
    $: y = $tooltip?.y ?? 0
    $: hidden = data?.hidden ?? false
    $: entries = Object.entries(data ?? {})
        .map(([id, data]) => [Tooltips.get(id), data])
        .filter(([x]) => x)

    $: cssVariables = `\
        --tooltip-x:${x + 12}px;\
        --tooltip-y:${y+ 2}px;\
        --translate-x:${x > window.innerWidth / 2 ? "calc(-100% - 15px)" : "0"};\
        --translate-y:${y > window.innerHeight / 2 ? "calc(-100% + 20px)" : "0"};\
    `

</script>


{#if data && !hidden}
    <div class="tooltip" style={cssVariables}>
        {#if typeof data === "string"}
            {data}
        {:else}
            {#each entries as [type, data]}
                <svelte:component this={type} {data} />
            {/each}
        {/if}
    </div>
{/if}

<style>
    div.tooltip {
        position: absolute;
        left : var(--tooltip-x);
        top : var(--tooltip-y);
        padding : 0.5em;
        background-color: #222222;
        border: 1px solid #777777;
        font-size: 16px;
        pointer-events: none;
        transform: translate(var(--translate-x), var(--translate-y));
        z-index : 1000;
        white-space: pre-line;
    }
</style>
