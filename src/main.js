import './app.css'
import App from './App.svelte'

import init from "config/init.js"

init()

const app = new App({
  target: document.getElementById('app')
})

export default app
