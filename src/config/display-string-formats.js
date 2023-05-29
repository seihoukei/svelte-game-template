import DisplayString from "utility/display-string/display-string.js"

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

const DISPLAY_STRING_FORMATS = {
    STRING: {
        TEXT: [{
            pattern: /~(.*?)~/g,
            replacement: `$1`,
        }],
        HTML: [{
            pattern: /~(.*?)~/g,
            replacement: `<span class="$1 inline-icon"></span>`,
        }],
    },
    TIME: {
        DEFAULT: [
            {
                threshold: 0.1 * SECOND,
                format: "0s",
            }, {
                threshold: 10 * SECOND,
                format: "S1.1x",
            }, {
                threshold: MINUTE,
                format: "Sx",
            }, {
                threshold: HOUR,
                format: "Mx s2x",
            }, {
                threshold: DAY,
                format: "Hx m2x",
            }, {
                threshold: WEEK,
                format: "Dx h2x",
            }, {
                threshold: 10 * WEEK,
                format: "Wx dx",
            }, {
                format: "months",
            }
        ],
        DETAILED: [
            {
                threshold: MICROSECOND,
                format: "Instant",
            }, {
                threshold: MILLISECOND,
                format: "USx",
            }, {
                threshold: 10 * MILLISECOND,
                format: "MS1.2x",
            }, {
                threshold: 100 * MILLISECOND,
                format: "MS1.1x",
            }, {
                threshold: SECOND,
                format: "MSx",
            }, {
                threshold: 10 * SECOND,
                format: "S1.2x",
            }, {
                threshold: MINUTE,
                format: "S1.1x",
            }, {
                threshold: HOUR,
                format: "Mx s2x",
            }, {
                threshold: DAY,
                format: "Hx m2x",
            }, {
                threshold: WEEK,
                format: "Dx h2x",
            }, {
                threshold: 10 * WEEK,
                format: "Wx dx",
            }, {
                format: "months",
            }
        ],
        SHORT_DURATION: [
            {
                threshold: MICROSECOND,
                format: "Instant",
            }, {
                threshold: MILLISECOND,
                format: "USx",
            }, {
                threshold: 10 * MILLISECOND,
                format: "MS1.1x",
            }, {
                threshold: SECOND,
                format: "MSx",
            }, {
                threshold: 10 * SECOND,
                format: "S1.1x",
            }, {
                threshold: 5 * MINUTE,
                format: "Sx",
            }, {
                threshold: 2 * HOUR,
                format: "Mx s2x",
            }, {
                threshold: DAY,
                format: "Hx m2x",
            }, {
                threshold: WEEK,
                format: "Dx h2x",
            }, {
                threshold: 10 * WEEK,
                format: "Wx dx",
            }, {
                format: "months",
            }
        ],
        LONG_3_ITEMS: [{
                threshold: SECOND,
                format: "Now",
            }, {
                threshold: MINUTE,
                format: "Sx",
            }, {
                threshold: HOUR,
                format: "M:s2",
            }, {
                threshold: DAY,
                format: "Hx m2x s2x",
            }, {
                format: "Dx h2x m2x",
            }
        ],
    },
    NUMBER: {
        //default is defined by settings, these override settings
        SHORT: {
            cutTrailingZeroes : true,
        },
        UNITS: {
            postfixes: DisplayString.NUMBER_POSTFIXES.UNITS,
        }
    },
}

export default DISPLAY_STRING_FORMATS
