<script>
    export let max = 100
    export let current = 0
    export let caption = ""
    export let bgcolor = "#333333"
    export let fgcolor = "#666666"

    $: progress = (100 * current / max).toFixed(2)
</script>

<div class="bar" style="
        --progress:{progress}%;
        --fgcolor:{fgcolor};
        --bgcolor:{bgcolor};
    ">
    <div class="bg"></div>
    <div class="fg"></div>
    <div class="caption">{caption}</div>
</div>

<style>
    div.bar {
        width: 100%;
        height: 100%;
        position: relative;
    }

    div.fg, div.bg, div.caption {
        position: absolute;
        left : 0;
        top : 0;
        height : 100%;
        width: 100%;
    }

    div.bg {
        background-color: var(--bgcolor);
    }

    div.fg {
        background-color: var(--fgcolor);
        width: var(--progress);
    }

    div.caption {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
