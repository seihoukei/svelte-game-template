import DISPLAY_STRING_TIME_ELEMENTS from "utility/display-string/display-string-time-elements.js"
import DISPLAY_STRING_NUMBER_POSTFIXES from "utility/display-string/display-string-number-postfixes.js"

export default class DisplayString {
    static TIME_ELEMENTS = DISPLAY_STRING_TIME_ELEMENTS
    static NUMBER_POSTFIXES = DISPLAY_STRING_NUMBER_POSTFIXES
    
    static TIME_FORMATS = {}
    static STRING_FORMATS = {}
    static NUMBER_FORMATS = {}
    
    
    static config = {
        numberPostfixes : this.NUMBER_POSTFIXES.DEFAULT,
        numberUseCeil : false,
        numberLength : 10,
        numberDigits : 4,
        numberEStep : 1,
        numberEPlus : false,
        numberEThreshold : 6,
        numberEFractionThreshold : -3,
        numberZeroThreshold : 1e-300,
        numberCutTrailingZeroes : false,
        numberDynamicDigits : true,
    }
    
    static applyConfig(config) {
        Object.assign(this.config, config)
        this.config.numberPostfixes = this.NUMBER_POSTFIXES[this.config.numberPostfixes] ?? this.config.numberPostfixes ?? this.NUMBER_POSTFIXES.NONE
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
    
    static #cutTrailingPeriod(string) {
        return string.at(-1) === "."
            ? string.slice(0, -1)
            : string
    }
    
    static #cutTrailingZeroes(string) {
        if (string.indexOf(".") === -1)
            return string
        let zeroes = 0
        while (string.at(-zeroes - 1) === "0")
            zeroes++
        
        return zeroes
            ? this.#cutTrailingPeriod(string.slice(0, -zeroes))
            : this.#cutTrailingPeriod(string)
    }
    
    static #round(value, useCeil) {
        //1e9 rounding is to fix floating point errors offsetting 00s into 99s
        const fixedValue = Math.round(value * 1e9) / 1e9
        return useCeil
            ? Math.ceil(fixedValue)
            : Math.floor(fixedValue)
    }
    
    static #formatNaturalValue(value, log10, digits, maxLength, dynamicDigits, cutTrailingZeroes, useCeil) {
        const baseLength = log10 + (value < 0 ? 2 : 1)
        if (dynamicDigits && digits < baseLength) {
            return this.#round(value, useCeil).toFixed(0)
        }
        const length = Math.max(log10, 0) + 1
        const scale = 10 ** (dynamicDigits ? digits - length : digits)
        const displayValue = this.#round(value * scale, useCeil) / scale
        const fixedDigits = dynamicDigits
            ? Math.max(0, digits - length)
            : digits
        const baseString = displayValue.toFixed(fixedDigits).slice(0, Math.max(baseLength + 1, maxLength))
        
        return cutTrailingZeroes
            ? this.#cutTrailingZeroes(baseString)
            : this.#cutTrailingPeriod(baseString)
    }
    
    static number(value, {
        zeroThreshold = this.config.numberZeroThreshold,
        digits = this.config.numberDigits,
        maxLength = this.config.numberLength,
        useCeil = this.config.numberUseCeil,
        eStep = this.config.numberEStep,
        ePlus = this.config.numberEPlus,
        eThreshold= this.config.numberEThreshold,
        eFractionThreshold = this.config.numberEFractionThreshold,
        cutTrailingZeroes = this.config.numberCutTrailingZeroes,
        dynamicDigits = this.config.numberDynamicDigits,
        postfixes = this.config.numberPostfixes,
    } = {}) {
//        const sign = Math.sign(value)
        const absolute = Math.abs(value)
        if (absolute < zeroThreshold || absolute === 0)
            return this.#formatNaturalValue(0, 0, digits, maxLength, dynamicDigits, cutTrailingZeroes, useCeil)
    
        const log10 = Math.floor(Math.log10(absolute))
    
        if (log10 >= eThreshold || log10 < eFractionThreshold) {
            const e = Math.floor(log10 / eStep) * eStep
            const baseValue = value / 10 ** e
            const eString = `e${ePlus && e > 0 ? "+" : ""}${e}`
        
            return `${this.#formatNaturalValue(baseValue, log10 - e, digits, maxLength - eString.length, dynamicDigits, cutTrailingZeroes, useCeil)}${eString}`
        }

        const e3 = Math.floor(log10 / 3) * eStep
        const postfix = postfixes?.codes?.[e3 - (postfixes?.start ?? 0)] ?? ""
        if (postfix !== "") {
            const e = e3 * 3
            const baseValue = value / 10 ** e
            return `${this.#formatNaturalValue(baseValue, log10 - e, digits, maxLength - postfix.length, dynamicDigits, cutTrailingZeroes, useCeil)}${postfix}`
        }
    
        return this.#formatNaturalValue(value, log10, digits, maxLength, dynamicDigits, cutTrailingZeroes, useCeil)
    }
    
    static shortNumber(value) {
        return this.number(value, this.NUMBER_FORMATS.SHORT)
    }
    
    static percentage(value, format = {}) {
        const percent = value * 100
        
        return `${this.number(percent, format)}%`
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
        
        let string = this.#formatNaturalValue(value, 0, data.precision, 100, false,  data.cutTrailingZeroes, false)
        if (data.digits > 1) {
            const digits = Math.floor(Math.log10(Math.max(value, 1))) + 1
            if (digits < data.digits)
            string = `${'0'.repeat(data.digits - digits)}${string}`
        }
        
        if (data.postfix)
            string = string + data.postfix
        
        return string + (element?.postfix ?? "")
    }
}
