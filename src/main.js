import "css/app.css"
import "css/icons.css"
import "css/utility.css"
import "css/variables.css"
import App from "./App.svelte"

import initApp from "utility/init-app.js"

initApp()

const app = new App({
  target: document.getElementById('app')
})

export default app
