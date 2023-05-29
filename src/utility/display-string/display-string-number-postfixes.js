const DISPLAY_STRING_NUMBER_POSTFIXES = {
    NONE : {
        start : 0,
        codes : [],
    },
    DEFAULT: {
        start: 1,
        codes: [
            "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No",
            "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod",
            "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg",
            "Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg",
        ],
    },
    LETTERS: {
        start: 1,
            codes: [
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC",
            "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ",
            "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA", "BB", "BC", "BD",
            "BE", "BF", "BG", "BH", "BI", "BJ", "BK", "BL", "BM", "BN", "BO", "BP", "BQ",
            "BR", "BS", "BT", "BU", "BV", "BW", "BX", "BY", "BZ", "CA", "CB", "CC", "CD",
            "CE", "CF", "CG", "CH", "CI", "CJ", "CK", "CL", "CM", "CN", "CO", "CP", "CQ",
            "CR", "CS", "CT", "CU", "CV", "CW", "CX", "CY", "CZ", "DA", "DB", "DC", "DD",
            "DE", "DF", "DG", "DH", "DI", "DJ", "DK", "DL", "DM", "DN", "DO", "DP", "DQ",
            "DR", "DS", "DT", "DU", "DV", "DW", "DX", "DY", "DZ", "EA", "EB", "EC", "ED",
            "EE", "EF", "EG", "EH", "EI", "EJ", "EK", "EL", "EM", "EN", "EO", "EP", "EQ",
            "ER", "ES", "ET", "EU", "EV", "EW", "EX", "EY", "EZ",
        ],
    },
    UNITS: {
        start: -8,
            codes: [
            " y", " z", " a", " f", " p", " n", " µ", " m", "",
            " K", " M", " G", " T", " P", " E", " Z", " Y",
        ],
    },
    LONG_UNITS: {
        start: -8,
            codes: [
            " Yocto", " Zepto", " Atto", " Femto", " Pico", " Nano", " Micro", " Milli", " ",
            " Kilo", " Mega", " Giga", " Tera", " Peta", " Exa", " Zetta", " Yotta",
        ],
    },
}

export default DISPLAY_STRING_NUMBER_POSTFIXES
