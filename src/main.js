import "css/app.css"
import "css/icons.css"
import "css/utility.css"
import "css/variables.css"
import App from "./App.svelte"

import init from "config/init.js"

init()

const app = new App({
  target: document.getElementById('app')
})

export default app
