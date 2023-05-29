const MINUTE_SECONDS = 60
const HOUR_MINUTES = 60
const DAY_HOURS = 24
const WEEK_DAYS = 7
const SECOND_MILLISECONDS = 1e3
const SECOND_MICROSECONDS = 1e6

const SECOND = 1
const MINUTE = MINUTE_SECONDS * SECOND
const HOUR = HOUR_MINUTES * MINUTE
const DAY = DAY_HOURS * HOUR
const WEEK = WEEK_DAYS * DAY
const MILLISECOND = SECOND / SECOND_MILLISECONDS
const MICROSECOND = SECOND / SECOND_MICROSECONDS

const DISPLAY_STRING_TIME_ELEMENTS = {
}

const prefixes = {
    W : {
        multiplier : 1 / WEEK,
        postfix : 'w',
    },
    d : {
        multiplier : 1 / DAY,
        period : WEEK_DAYS,
        postfix : "d",
    },
    D: {
        multiplier : 1 / DAY,
        postfix : "d",
    },
    h : {
        multiplier : 1 / HOUR,
        period : DAY_HOURS,
        postfix : "h",
    },
    H : {
        multiplier : 1 / HOUR,
        postfix : "h",
    },
    m : {
        multiplier : 1 / MINUTE,
        period: HOUR_MINUTES,
        postfix : "m",
    },
    M : {
        multiplier : 1 / MINUTE,
        postfix : "m",
    },
    s : {
        multiplier : 1 / SECOND,
        period: MINUTE_SECONDS,
        postfix : "s",
    },
    S : {
        multiplier : 1 / SECOND,
        postfix : "s",
    },
    ms : {
        multiplier : 1 / MILLISECOND,
        period : SECOND_MILLISECONDS,
        postfix : "ms",
    },
    MS : {
        multiplier : 1 / MILLISECOND,
        postfix : "ms",
    },
    us : {
        multiplier : 1 / MICROSECOND,
        period : SECOND_MICROSECONDS,
        postfix : "µs"
    },
    US : {
        multiplier : 1 / MICROSECOND,
        postfix : "µs"
    },
}

for (const [prefix, data] of Object.entries(prefixes)) {
    for (let digits = 1; digits < 5; digits++) {
        for (let precision = 0; precision < 4; precision++) {
            const element = {
                multiplier: data.multiplier ?? null,
                period: data.period ?? null,
                digits, precision,
            }
    
            DISPLAY_STRING_TIME_ELEMENTS[`${prefix}${digits}.${precision}`] = {
                ...element,
            }
    
            DISPLAY_STRING_TIME_ELEMENTS[`${prefix}${digits}.${precision}x`] = {
                ...element,
                postfix: data.postfix,
            }

            if (digits === 1) {
                DISPLAY_STRING_TIME_ELEMENTS[`${prefix}.${precision}`] = {
                    ...element,
                }
        
                DISPLAY_STRING_TIME_ELEMENTS[`${prefix}.${precision}x`] = {
                    ...element,
                    postfix: data.postfix,
                }
            }
    
            if (precision === 0) {
                DISPLAY_STRING_TIME_ELEMENTS[`${prefix}${digits}`] = {
                    ...element,
                }
        
                DISPLAY_STRING_TIME_ELEMENTS[`${prefix}${digits}x`] = {
                    ...element,
                    postfix: data.postfix,
                }
        
                if (digits === 1) {
                    DISPLAY_STRING_TIME_ELEMENTS[`${prefix}`] = {
                        ...element,
                    }
            
                    DISPLAY_STRING_TIME_ELEMENTS[`${prefix}x`] = {
                        ...element,
                        postfix: data.postfix,
                    }
                }
            } else {
    
                DISPLAY_STRING_TIME_ELEMENTS[`${prefix}${digits}.${precision}?`] = {
                    ...element,
                    cutTrailingZeroes : true,
                }
    
                DISPLAY_STRING_TIME_ELEMENTS[`${prefix}${digits}.${precision}?x`] = {
                    ...element,
                    postfix: data.postfix,
                    cutTrailingZeroes : true,
                }
    
                if (digits === 1) {
                    DISPLAY_STRING_TIME_ELEMENTS[`${prefix}.${precision}?`] = {
                        ...element,
                        cutTrailingZeroes : true,
                    }
        
                    DISPLAY_STRING_TIME_ELEMENTS[`${prefix}.${precision}?x`] = {
                        ...element,
                        postfix: data.postfix,
                        cutTrailingZeroes : true,
                    }
                }
            }
            
        }
    }
}

export default DISPLAY_STRING_TIME_ELEMENTS
