export default class Wakelock {
    static #lock = null

    static #storeLock(lock) {
        this.#lock = lock
    }

    static async #startLock() {
        if (document.visibilityState !== 'visible')
            return

        const lock = await navigator.wakeLock?.request('screen')
        this.#storeLock(lock)
    }

    static async enable() {
        await this.#startLock()

        document.addEventListener('visibilitychange', async () => {
            await this.#startLock()
        })
    }
}