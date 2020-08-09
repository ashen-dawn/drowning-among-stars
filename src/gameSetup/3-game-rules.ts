import {game, rules, parser} from '../engine'
import { ObjectType, Item } from '../engine/types/GameState'
import { Draft } from 'immer'
import { Phase } from './2-phases-and-hints'

/**
 * Small message about not having flashlight in cabin
 */
rules.on('beforePrintItems', () => {
  const state = game.getState()
  const playerLocation = state.player.location
  const flashlightLocation = state.items.get('flashlight')?.location

  if(flashlightLocation !== 'inventory' && playerLocation === 'cabin')
    throw new Error('You cannot make out much more without light.')
})

/**
 * Do not allow going west from cabin
 */
rules.onBeforeCommand(command => {
  const playerLocation = game.getCurrentRoom()?.name
  if(command.verb.name !== 'go' || playerLocation !== 'cabin' || command.subject?.name !== 'port')
    return;

  throw new Error(`The security doors have sealed - you're either going to need to restart the mainframe or find a way to force these open before you can access the comms room.`)
})

/**
 * Do not allow going east from medbay until opened
 */
rules.onBeforeCommand(command => {
  const playerLocation = game.getCurrentRoom()?.name
  if(command.verb.name !== 'go' || playerLocation !== 'medbay' || command.subject?.name !== 'starboard')
    return;

  if(game.getProperty('gamePhase') < Phase.openedDoor)
    throw new Error(`The security doors have sealed - you're either going to need to restart the mainframe or find a way to force these open before you can access the comms room.`)
})

/**
 * Do not allow opening security doors
 */
rules.onBeforeCommand(command => {
  const playerLocation = game.getCurrentRoom()?.name
  if(command.verb.name !== 'openItem' || !command.subject?.aliases.includes('security doors'))
    return;

  if(playerLocation === 'cabin')
    parser.runCommand('go port')

  if(playerLocation === 'medbay')
    parser.runCommand('go starboard')

  // Do not print regular command output
  throw new Error()
})

/**
 * Update hint after getting the flashlight
 */
rules.onAfterCommand(() => {
  const state = game.getState()

  const flashlightLocation = state.items.get('flashlight')?.location
  const wrenchExists = state.items.has('wrench')

  if(flashlightLocation === 'inventory' && !wrenchExists){
    if(game.getProperty('gamePhase') < Phase.hasFlashlight)
      game.setProperty('gamePhase', Phase.hasFlashlight)
    game.addItem('wrench', 'Just generally useful for repairs and adjustments to the various mechanical parts of the ship.', 'cabin', true)
  }
})

/**
 * Update hint after getting wrench
 */
rules.onAfterCommand(command => {
  if(command.verb.name !== 'take' || command.subject?.name !== 'wrench')
    return

  const panel = game.findObjectByName('floor panel', ObjectType.Item) as Item

  if(game.getProperty('gamePhase') < Phase.gotWrench && panel !== null)
    game.setProperty('gamePhase', Phase.gotWrench)
})

/**
 * Don't allow the flashlight to be dropped
 */
rules.onBeforeCommand(command => {
  if(command.verb.name === 'drop' && command.subject?.name === 'flashlight')
    throw new Error(`If you put down the flashlight, you will likely not be able to find it again in the dark.`)
})

/**
 * If we get "take apart" cabinet, try opening it instead
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'take apart') return;

  if(command.subject?.name === 'cabinet' || command.subject?.name === 'floor panel'){
    parser.runCommand(`open ${command.subject?.name}`)
    throw new Error()
  }
})

/**
 * When opening the cabinet, insert floor panel
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'openItem') return;
  if(command.subject?.name !== 'cabinet') return;

  const wrench = game.findObjectByName('wrench', ObjectType.Item) as Item

  const item = game.findObjectByName('cabinet', ObjectType.Item) as Draft<Item>
  item.description = `
A small metal cupboard beneath the sing.  It is currently open.

At the bottom of the cupboard you see a loose metal panel you might be able to fit through.
  `

  const sinkPanel = game.addItem('floor panel', 'A loose metal panel in the bathroom floor.', 'bathroom')
  sinkPanel.aliases.push('panel')
  sinkPanel.aliases.push('loose panel')

  if(wrench?.location === 'inventory')
    game.setProperty('gamePhase', Phase.gotWrench)
  else
    game.setProperty('gamePhase', Phase.checkedUnderSink)

  // Prevent normal command execution
  throw new Error('You open the sink cupboard, revealing a loose metal panel in the bathroom floor.')
})

/**
 * Handle opening floor panel
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'openItem') return;
  if(command.subject?.name !== 'floor panel') return;

  const wrench = game.findObjectByName('wrench', ObjectType.Item) as Item
  if(wrench?.location !== 'inventory')
    throw new Error(`It's bolted down pretty tightly - you'll need a tool to open this panel.`)

  game.setNeighbor('bathroom', 'down', 'docking')
  if(game.getProperty('gamePhase') < Phase.openedSinkPanel)
    game.setProperty('gamePhase', Phase.openedSinkPanel)

  const panel = game.findObjectByName('floor panel', ObjectType.Item) as Draft<Item>
  panel.printableName = 'hole in the floor'

  throw new Error('It takes you a few minutes, but eventually you pull up the floor panel.  You should be able to get down to the docking bay from here.')
})

/**
 * Add to engine description when CO2 not fixed
 */
rules.onAfterCommand(command => {
  if(command.verb.name !== 'lookAt' || command.subject?.name !== 'engine') return;

  if(game.getProperty('gamePhase') < Phase.fixedLifeSupport)
    game.say(`_Focus_, you remind yourself.  _The engine is pretty but I've gotta fix that CO<sub>2</sub> filter before I'll have time to bother with this._`)
})

/**
 * Add to mainframe description when CO2 not fixed
 */
rules.onAfterCommand(command => {
  if(command.verb.name !== 'lookAt' || command.subject?.name !== 'mainframe') return;

  if(game.getProperty('gamePhase') < Phase.fixedLifeSupport)
    game.say(`Luckily the CO<sub>2</sub> filter operates independently to the rest of the ship's systems, so you can worry about that fixing first and then come back to the mainframe.`)
})

/**
 * Turn on flashlight
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'start' || command.subject?.name !== 'flashlight') return;

  const light = game.findObjectByName('flashlight', ObjectType.Item) as Item

  if(light.location === 'inventory')
    throw new Error('It is already on')
  else{
    parser.runCommand(`take ${light.name}`)
    throw new Error()
  }
})

/**
 * Cannot turn on engine
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'start' || command.subject?.name !== 'engine') return;

  const currentPhase = game.getProperty('gamePhase')
  if(currentPhase < Phase.fixedLifeSupport)
    throw new Error(`You probably should restart the CO<sub>2</sub> filter before worrying about the engine.`)

  if(currentPhase < Phase.examinedMainframe){
    game.setProperty('gamePhase', Phase.examinedEngine)
    throw new Error(`As far as you can tell the engine _itself_ is fine, perhaps something is wrong with the mainframe's control systems?`)
  }

  throw new Error(`The mainframe's engine control systems have been damaged and will have to be repaired before the engine can be started.`)
})

/**
 * Cannot start mainframe
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'start' || command.subject?.name !== 'mainframe') return;

  const currentPhase = game.getProperty('gamePhase')
  if(currentPhase < Phase.fixedLifeSupport)
    throw new Error(`You probably should restart the CO<sub>2</sub> filter before worrying about the mainframe.`)

  if(currentPhase < Phase.examinedMainframe){
    parser.runCommand(`take apart mainframe`)
    throw new Error()
  }

  throw new Error(`The mainframe's engine control system is damaged, and will have to be repaired before you can bring it online.  You believe you have a replacement part in the comms room.`)
})

/**
 * Cannot start filter again
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'start' || command.subject?.name !== 'filter') return;

  const currentPhase = game.getProperty('gamePhase')
  if(currentPhase >= Phase.fixedLifeSupport)
    throw new Error(`The CO<sub>2</sub> filter is already running.`)
})

/**
 * Taking apart engine: error saying that's dangerous, and not something you can do without a drydock
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'take apart' || command.subject?.name !== 'engine') return;

  throw new Error(`Even in non-emergency conditions, the engine is not something you can safely service without bringing the _Dawn_ down at a drydock.`)
})

/**
 * Taking apart mainframe: Explain damaged part - after that, say you need the part
 */
rules.onBeforeCommand(command => {
  if(command.verb.name !== 'take apart' || command.subject?.name !== 'mainframe') return;

  const currentPhase = game.getProperty('gamePhase')
  if(currentPhase < Phase.fixedLifeSupport)
    throw new Error(`You probably should restart the CO<sub>2</sub> filter before worrying about the mainframe.`)

  if(currentPhase >= Phase.examinedMainframe)
    throw new Error(`You won't be able to repair the mainframe's control system without the replacement capacitor from the comms room.`)
})
