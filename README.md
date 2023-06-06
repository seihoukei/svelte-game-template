# Minimalistic svelte game template

Minimalistic template to base prototypes and small projects on without worrying too much about boilerplate.

## Things to remember to adjust when using as a template:

- vite.config.js
  - **base** especially if updating packages
- package.json
  - **"name"**
- Index.html
  - **Title**
  - **Description**
  - **Favicon**
- GameEngine.svelte
  - getMilestones
  - metaFunction
  - versionFunction
  - offlineFunction
- GameUI.svelte
  - Remove debug data and UIMeta when irrelevant
- UIMenu.svelte
  - Display meta data for save instead of ???
  - Display game title
- game-config.js
  - adjust all settings, most importantly `title` and `state.savePrefix`
- init.js
  - register tooltips, dialogs processors
- SettingWatcher.svelte
  - set up watchers for custom settings if relevant
- `.css` files
  - Define backgrounds for custom inline-icons if relevant (`icons.css`)
  - --ui-x-color variables (`variables.css`)

## Important notes

### Using Trigger

Trigger is a custom event handler for interaction between Engine parts and UI elements. Trigger is set up with `Trigger.on(event, handler, ...handlerArguments)`. It's wrapped in Svelte's `onMount` and `onDestroy`, so it's added and removed cleanly with component.

Trigger events can have priority assigned with `Trigger.on(...).setPriority`, lower numbers mean earlier execution in the queue. This allows to ensure events happen in desired order, especially relevant for `command-advance` events.

Trigger events are triggered with `Trigger(event, ...triggerArguments)`. Registered handlers are then executed, given `...handlerArguments, ...triggerArguments` as arguments, in that order. 

#### Reserved triggers 

By convention, "command-x" triggers expect some specific change to happen in a way that matters to emittter, other "something-happened" events happen as a notification that can be reacted by others, but are of no interest to emitter.

Triggers to react to:
- `command-advance` `(time)` - event from game engine, main trigger to react to with game-advancing events.
- `game-saved` `(slot)` - reports that game was saved to specific slot

### Game state

GameEngine and descendants should be the source of truth for game state. No double-binding same element twice, instead modify entity form inside on Trigger events (`Trigger.on("...", ...)`).
GameUI interacts with game state only through Trigger calls.

### use:tooltip

Elements with `use:tooltip={data}` cause hint to show up when hovered. 

Data can be a string (would be displayed as is) or an object `{name: data}` with custom display component registered through `Tooltips.register(name, component)`. Data would then be passed to registered component as `data`.

### use:interactive

Elements with `use:interactive` emit special triggers when interacted with:

- `basicaction` - on tap or left-click
- `specialaction` - on long tap, right-click or shift-click
- `enter`, `leave` - when pointer/ lat touch position enters/leaves element

Currently, element with `interactive` blocks its children with `interactive`.

### DisplayString

Used to shape value into a string:

- `DisplayString.number` - Scientific notation, 2 decimal digits
- `DisplayString.shortNumber` is a shorthand for `DisplayString.number` with `SHORT` format
- `DisplayString.percentage` - fraction displayed as percentage
- `DisplayString.time` - formats time based on time format
- `DisplayString.duration` is a shorthand for `DisplayString.time` with `SHORT_DURATION` format
- `DisplayString.text` - applies given set of replacers to the string
- `DisplayString.html` is a shorthand for `DisplayString.text` with `HTML` format

`DisplayString.config` defines default settings for numbers, and `DisplayString.applyConfig(changes)` can be used to properly modify it.

### Save states

Saves are stored in localStorage fields with given game prefix. 
Metadata can be added within `metaFunction` to add easily extractable info to display at save menu. 
Save data is JSONified, then compressed using a worker (to avoid blocking the main thread if save data is big), then metadata is prepended. First part of save string before `.` is base64-encoded metadata json.
Metadata includes save version, and if save format changes over time it's possible to update save within `versionFunction`.
`offlineFunction` can be modified to process offline time in a different manner.

State manipulation is performed through `State`.

### Dialogs

`Dialogs` manages stack of displayed dialogs. Dialogs can be registered with `Dialogs.register(name, component)` and component should use `<UIDialog>` or `<UIDialog modal>` as a wrapper to its DOM content.
- `Dialogs.open(name, data)` - opens given registered dialog with given data
- `Dialogs.close([name])` - closes topmost dialog, if name is provided only dialog of that type would be closed

#### Modal dialogs

Special dialog `UIModalDialog` is used for async `Dialogs.ask`, `Dialogs.confirm`, `Dialogs.alert` and `Dialogs.prompt` dialogs. Custom buttons with custom text and results can be listed for non-input dialogs:

```js
    result = await Dialogs.ask("Who do you want to call?", [{
        text: "Dave",
        result: "dave",
    },{
        text: "Mary",
        result: "mary",
    },{
        text: "Noone",
        result: null,
    }])
```

- `Dialogs.confirm`, `Dialogs.ask` and `Dialogs.alert` are shorthands to `Dialogs.modal` that return chosen button
- `Dialogs.prompt` and `Dialogs.promptNumber` are shorthands to `Dialogs.modal` that return input or `null` if canceled

### svelteInterval

`svelte-interval` is a wrapper for setInterval that cleans up after itself, using `onMount`/`onDestroy` internally. Returns an object that has `.delay` function that can delay next interval trigger by given time. 

### Settings

`Settings` module allows for centralized settings control and application through `SettingWatcher`. Custom categories and settings can be added through `GAME_CONFIG`.
