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
- App.svelte
  - GameTimer rate
  - Disable Wakelock if not needed
- GameEngine.svelte
  - **GAME_SAVE_PREFIX**
  - ACTIONSAVE_EVENTS / AUTOBACKUP_EVENTS
  - getMilestones
  - metaFunction
- GameUI.svelte
  - Remove debug data when irrelevant
- UIMenu.svelte
  - Display meta data for save instead of ???
- UIHover.svelte
  - Special hint types for `hoverable` if relevant
- app.css
  - Define backgrounds for custom inline-icons if relevant 
- Other changes
  - Add menu button and remove UIMeta

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
- `game-loaded` `(slot)` - reports that game was loaded from specific slot
- `game-reset` - reports that game was reset
- `save-info-updated` `(info)` - reports that save metadata was updated, and argument provides that data 

Triggers to emit:
- `command-open-dialog` `(name)` - event to be used to open dialogs (like menu)
- `command-close-dialog` - event to be used to close current topmost dialog
- `command-close-dialogs` - event to be used to close all dialogs

Triggers to be used when reimplementing menu:
- `command-export-save` - exports current game state to clipboard
- `command-import-save` - exports current game state to clipboard
- `command-reset-game` - resets current game state
- `command-save-game` `(slot)` - saves current game to given slot
- `command-load-game` `(slot, offlineTime)` - loads game from given slot, with or without processing offline time
- `command-update-save-info` `(SLOTS)` - requests update of save metaData for given slot names array

Triggers that should not be used directly:
- `command-tick` - event from game timer, used internally, use `command-advance` for more time-aware progression handling
- `command-set-hover`, `command-reset-hover` - used by `UIHover` and `hoverable`, see corresponding section

### Game state

GameEngine and descendants should be the source of truth for game state. No double-binding same element twice, instead modify entity form inside on Trigger events (Trigger.on("...")).
GameUI interacts with game state through Trigger calls.

### use:hoverable

Elements with `use:hoverable={data}` cause hint to show up whrn hovered. Data can be a string (would be displayed as is) or an object with custom handler implemented in `UIHover`

### use:interactive

Elements with `use:interactive` emit special triggers when interacted with:

- `basicaction` - on tap or left-click
- `specialaction` - on long tap, right-click or shift-click
- `enter`, `leave` - when pointer/ lat touch position enters/leaves element

### DisplayString

Used to shape value into a string:

- `DisplayString.number` - Scientific notation, 2 decimal digits
- `DisplayString.shortNumber` - Scientific notation, minimum decimal digits
- `DisplayString.percentage` - fraction displayed as percentage
- `DisplayString.time` - formats time as SSs, MM:SS or HH:MM:SS
- `DisplayString.html` - replaces ~TEXT~ with `inline-icon TEXT` span.

### Save states

Saves are stored in localStorage fields with given game prefix. 
Save data is JSONified, then compressed using a worker (to avoid blocking the main thread if save data is big), then metadata is prepended. First part of save string before `.` is base64-encoded metadata json.
Metadata includes save version, and if save format changes over time it's possible to add save updates, but so far it's to be hardcoded in SaveStateManager.
