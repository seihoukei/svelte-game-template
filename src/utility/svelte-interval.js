import {onDestroy, onMount} from "svelte"

export default function svelteInterval(func, time) {
    let interval = null
    let timeout = null
    let period = time
    
    onMount(() => {
        interval = setInterval(func, period)
    })
    
    onDestroy(() => {
        clearInterval(interval)
        clearTimeout(timeout)
    })
    
    return {
        changeInterval(time) {
            period = time
            clearInterval(interval)
            interval = setInterval(func, period)
        },
        
        delay(time) {
            clearInterval(interval)
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                clearInterval(interval)
                interval = setInterval(func, period)
            }, time)
        },
    }
}
