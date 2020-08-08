import {game, rules, renderer} from './engine/'

import './gameSetup/0-item-visibility'
import './gameSetup/1-rooms'
import './gameSetup/2-phases-and-hints'


game.addItem('block', 'A boring wooden block', 'comms')

game.saveDraft()

// Print description on game start
rules.onGameStart(() => {
  game.say(`Come, join the navy they said.`)
  game.pause()
  game.say(`It'll be fun they said.`)
  game.pause()
  game.clear()
})

rules.onBeforeCommand(command => {
  if(command.verb.name !== 'openItem') return
  if(command.subject?.name !== 'block') return;

  console.log('opening block')

  throw new Error()
})



renderer.start(document.getElementById('root'))
