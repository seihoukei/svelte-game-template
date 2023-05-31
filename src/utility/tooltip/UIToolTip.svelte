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
        --tooltip-x:${x > window.innerWidth / 2 ? `calc(-100% + ${x - 3}px)` : `${x + 12}px`};\
        --tooltip-y:${y > window.innerHeight / 2 ? `calc(-100% + ${y + 22}px)` : `${y + 2}px`};\
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
        left : 0;
        top : 0;
        padding : 0.5em;
        background-color: #222222;
        border: 1px solid #777777;
        font-size: 16px;
        pointer-events: none;
        transform: translate(var(--tooltip-x), var(--tooltip-y));
        z-index : 1000;
        white-space: pre-line;
    }
</style>
