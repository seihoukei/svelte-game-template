import Tooltips from "utility/tooltip/tooltips.js"

export default function tooltip(node, options = {}) {
    
    const mouseMoveHandler = (event) => {
        Tooltips.setTooltip(options, event.clientX, event.clientY)
        cancelEvent(event)
    }
    
    const mouseLeaveHandler = (event) => {
        Tooltips.resetTooltip(options)
        cancelEvent(event)
    }
    
    const cancelEvent = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    
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
