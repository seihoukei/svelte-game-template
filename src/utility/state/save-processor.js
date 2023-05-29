import {compressToBase64, decompressFromBase64} from "@amoutonbrady/lz-string"
import CompressWorker from "./compress-worker.js?worker"
import Workhole from "utility/workhole.js"

export default class SaveProcessor {
    static #worker = new CompressWorker()

    static #workhole = new Workhole(this.#worker)
    static #compressor = this.#workhole.import("compressor")

    static encode(save) {
        const json = JSON.stringify(save)
        const compressed = compressToBase64(json)
        return compressed
    }

    static async encodeAsync(save) {
        const data = await this.#compressor.compress(save)
        return data
    }
    
    static decode(compressed) {
        if (!compressed) {
            return null
        }
        try {
            const json = decompressFromBase64(compressed)
            const save = JSON.parse(json)
            return save
        } catch (e) {
            console.log("Failed to load:")
            console.log(e)
            return null
        }
        
    }
}
