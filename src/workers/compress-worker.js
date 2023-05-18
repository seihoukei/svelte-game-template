import Workhole from "utility/workhole.js"
import {compressToBase64} from "@amoutonbrady/lz-string"

const workhole = new Workhole(self)

const compressor = {
    compress(data) {
        const json = JSON.stringify(data)
        const compressed = compressToBase64(json)
        return compressed
    },
}

workhole.export(compressor, "compressor")
