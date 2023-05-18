import Trigger from "utility/trigger-svelte.js"

export default function hoverable(node, options = {}) {
    
    const mouseMoveHandler = (event) => {
        Trigger("command-set-hover", options, event.clientX, event.clientY)
        cancelEvent(event)
    }
    
    const mouseLeaveHandler = (event) => {
        Trigger("command-reset-hover", options)
        cancelEvent(event)
    }
    
    const cancelEvent = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    
    const dummy = () => {}
    
    const handlers = {
        mousemove : mouseMoveHandler,
        mouseleave: mouseLeaveHandler,
        mouseout: mouseLeaveHandler,
    }
    
    for (let [event, handler] of Object.entries(handlers))
        node.addEventListener(event, handler, true)
    
    return {
        destroy() {
            for (let [event, handler] of Object.entries(handlers))
                node.removeEventListener(event, handler, true)
        }
    };
}
