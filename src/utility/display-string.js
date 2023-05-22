export default class DisplayString {
    static time(value) {
        if (value < 60) {
            return value.toFixed(1) + "s"
        } else {
            const seconds = value % 60 | 0
            const minutes = value / 60 % 60 | 0
            const hours = value / 3600 | 0
            return (hours > 100
                    ? `${hours}:${minutes}`
                    : `${hours}:${minutes}:${seconds}`
            )
                .replace(/:(\d)(?=:|$)/g, ":0$1") // add leading zeroes for parts
                .replace(/^(00?:)*0?/g, "") // remove leading zeroes overall
        }
    }
    
    static number(value) {
        const absoluteValue = Math.abs(value)
        return absoluteValue < 1e-2 && value !== 0 ? value.toExponential(2)
            : absoluteValue < 10000 ? value.toFixed(2)
            : absoluteValue < 100000 ? value.toFixed(1)
            : absoluteValue < 1000000 ? value.toFixed(0)
            : value.toExponential(2)
    }
    
    static shortNumber(value) {
        return this.number(value)
            .replace(/(?<!e.*)(?<=\..*)0*$/,"")
            .replace(/\.$/,"")
        
    }
    
    static percentage(value) {
        const percent = value * 100
        
        let displayValue = percent < 10000 && percent > -10000
            ? percent.toFixed(2)
            : percent.toExponential(2)
        
        displayValue = displayValue
            .replace(/(?<!e.*)(?<=\..*)0*$/,"")
            .replace(/\.$/,"")
        
        return `${displayValue}%`
    }
    
    static #insertIcon(match, id) {
        return `<span class="${id} inline-icon"></span>`
    }
    
    static html(string) {
        return string
            .replace(/~(.*?)~/g, this.#insertIcon)
    }
    
}
