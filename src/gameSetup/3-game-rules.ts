import {game, rules} from '../engine'
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
