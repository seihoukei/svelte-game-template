export default function interactive(node) {

    const basicAction = () => {
        node.dispatchEvent(new CustomEvent("basicaction"))
    }
    const specialAction = () => {
        node.dispatchEvent(new CustomEvent("specialaction"))
    }
    const debugAction = () => {
        node.dispatchEvent(new CustomEvent("debugaction"))
    }
    const enter = () => {
        node.dispatchEvent(new CustomEvent("enter"))
    }
    const leave = () => {
        node.dispatchEvent(new CustomEvent("leave"))
    }

    const mouseUpHandler = (event) => {
        if (event.button)
            return //contextmenu handler should do it
        
        if (event.shiftKey)
            specialAction()
        else
            basicAction()
        cancelEvent(event)
    }

    const mouseRightHandler = (event) => {
        if (event.shiftKey && import.meta.env.MODE === "development")
            debugAction()
        else
            specialAction()
        cancelEvent(event)
    }

    const mouseInHandler = (event) => {
        if (event.target === node)
            enter()
    }

    const mouseOutHandler = (event) => {
        if (event.target === node)
            leave()
    }

    const cancelEvent = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    
    const dummy = () => {}

    const handlers = {
        keyup: dummy,
        mouseup: mouseUpHandler,
        mouseenter: mouseInHandler,
        mouseleave: mouseOutHandler,
        contextmenu: mouseRightHandler,
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
