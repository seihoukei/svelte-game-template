import DISPLAY_STRING_TIME_ELEMENTS from "utility/display-string/display-string-time-elements.js"

export default class DisplayString {
    static TIME_ELEMENTS = DISPLAY_STRING_TIME_ELEMENTS
    
    static TIME_FORMATS = {}
    static STRING_FORMATS = {}
    static NUMBER_FORMATS = {}
    
    static config = {
        numberLength : 7,
        numberDigits : 4,
        numberEStep : 3,
        numberEPlus : false,
        numberEThreshold : 9,
        numberEFractionThreshold : -3,
        numberZeroThreshold : 1e-300,
        numberCutTrailingZeroes : false,
    }
    
    static applyConfig(config) {
        Object.assign(this.config, config)
    }
    
    static setTimeFormats(formats) {
        this.TIME_FORMATS = {}
        for (const [id, list] of Object.entries(formats)) {
            const data = []
            for (const item of list) {
                data.push({
                    threshold : item.threshold ?? Infinity,
                    format : item.format,
                    elements : this.parseTimeFormatString(item.format),
                })
            }
            this.TIME_FORMATS[id] = data
        }
    }
    
    static setStringFormats(formats) {
        this.STRING_FORMATS = {}
        for (const [id, list] of Object.entries(formats)) {
            const data = []
            for (const item of list) {
                data.push({...item})
            }
            this.STRING_FORMATS[id] = {
                replacers: data
            }
        }
    }
    
    static setNumberFormats(formats) {
        this.NUMBER_FORMATS = {}
        for (const [id, data] of Object.entries(formats)) {
            this.NUMBER_FORMATS[id] = {...data}
        }
    }
    
    static time(value, format = this.TIME_FORMATS.DEFAULT) {
        for (let range of format) {
            if (value < range.threshold)
                return range.elements.map(element => this.timeElement(value, element)).join("")
        }
        return value.toString()
    }
    
    static duration(value) {
        return this.time(value, this.TIME_FORMATS.SHORT_DURATION)
    }
    
    static ETA (value, max, speed = 1, short = false) {
        const time = Math.max(0, (max - value) / speed)
        return short
            ? this.duration(time)
            : this.time(time)
    }
    
    static number(value, {
        zeroThreshold = this.config.numberZeroThreshold,
        digits = this.config.numberDigits,
        maxLength = this.config.numberLength,
        eStep = this.config.numberEStep,
        ePlus = this.config.numberEPlus,
        eThreshold= this.config.numberEThreshold,
        fractionThreshold = this.config.numberEFractionThreshold,
        cutTrailingZeroes = this.config.numberCutTrailingZeroes,
    } = {}) {
        const absoluteValue = Math.abs(value)
        return absoluteValue < 1e-2 && value !== 0 ? value.toExponential(2)
            : absoluteValue < 10000 ? value.toFixed(2)
            : absoluteValue < 100000 ? value.toFixed(1)
            : absoluteValue < 1000000 ? value.toFixed(0)
            : value.toExponential(2)
/*            let s = Math.sign(x)
            let e = Math.max(0, Math.log(s * x) / Math.log(10))
            let o = 2 - Math.floor(e % 3)
            e = Math.floor(e / 3)
            let m = x / 10 ** (e * 3)
            m = (Math.trunc(m * 10 ** o) / 10 ** o).toString()
            let d = m.length
            if (s === -1)
                d--
        
            if (o === 2 && d === 1)
                m = `${m}.00`
            if (o === 2 && d === 3)
                m = `${m}0`
            if (o === 1 && d === 2)
                m = `${m}.0`
        
            return `${m}${SUFFIX[e]}`*/
    }
    
    static shortNumber(value) {
        return this.number(value, this.NUMBER_FORMATS.SHORT)
    }
    
    static percentage(value, digits = null) {
        const percent = value * 100
        
        let displayValue = percent < 10000 && percent > -10000
            ? percent.toFixed(2)
            : percent.toExponential(2)
        
        displayValue = displayValue
            .replace(/(?<!e.*)(?<=\..*)0*$/,"")
            .replace(/\.$/,"")
        
        return `${displayValue}%`
    }
    
    static html(string) {
        return this.text(string, this.STRING_FORMATS.HTML)
    }
    
    static text(string, format = this.STRING_FORMATS.TEXT) {
        const replacers = typeof format === "string"
            ? this.STRING_FORMATS[format]?.replacers ?? []
            : format?.replacers ?? []
        return replacers
            .reduce((string, {pattern, replacement}) =>
                string.replace(pattern, replacement)
            , string)
    }
    
    static parseTimeFormatString(string) {
        return string
            .match(/[a-zA-Z0-9.?]+[^a-zA-Z0-9.?]*/g)
            ?.map(x => x
                .match(/(?<id>[a-zA-Z0-9.?]+)(?<postfix>[^a-zA-Z0-9.?]*)/)
                ?.groups
            )
            ?? []
    }
    
    static timeElement(time, element) {
        const data = this.TIME_ELEMENTS[element?.id] ?? null
        if (!data)
            return element?.id + element?.postfix
        
        let value = time
        if (data.multiplier)
            value *= data.multiplier
        if (data.period)
            value %= data.period
        
        let string = value.toFixed(data.precision)
        if (data.digits > 1) {
            const length = (string+'.').indexOf('.')
            if (length < data.digits)
                string = "0".repeat(data.digits - length) + string
        }
        
        if (data.precision && data.cutTrailingZeroes) {
            let zeroes = 0
            while (string.at(-zeroes - 1) === "0")
                zeroes++
            
            if (zeroes > 0) {
                if (string.at(-zeroes - 1) === ".")
                    zeroes++
                string = string.slice(0, -zeroes)
            }
        }
        
        if (data.postfix)
            string = string + data.postfix
        
        return string + (element?.postfix ?? "")
    }
}
