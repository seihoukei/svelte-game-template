<script>
    import GameEngine from "components/engine/GameEngine.svelte"
    import GameUI from "components/ui/GameUI.svelte"
    import GameTimer from "components/GameTimer.svelte"

    import Wakelock from "utility/wakelock.js"

    Wakelock.enable()

    let game = {}
</script>

<GameEngine bind:game />
<GameUI {game}/>

<GameTimer rate=10 boost=1 event="command-tick" />
