<script>
    import DisplayString from "utility/display-string/display-string.js"

    const baseNumbers = [1.23456789, 9.9999999, 1, 9.87654321]
    const numbers = []
    for (const base of baseNumbers) {
        const data = []
        for (let i = -10; i < 11; i++) {
            data.push(base * 10 ** i)
        }
        numbers.push(data)
    }
</script>

<div class="horizontal centred spaced flex">
    {#each numbers as list}
        <div class="vertical flex">
        {#each list as item}
            <div>
                {DisplayString.number(item, {
                    postfixes : DisplayString.NUMBER_POSTFIXES.DEFAULT,
                    eThreshold : 9,
//                    eFractionThreshold : -15,
                })}
            </div>
        {/each}
        </div>
    {/each}
</div>
