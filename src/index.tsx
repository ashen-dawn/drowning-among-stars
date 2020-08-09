import {game, rules, renderer} from './engine/'

import './gameSetup/0-item-visibility'
import './gameSetup/1-rooms'
import './gameSetup/2-phases-and-hints'

game.saveDraft()

// Print description on game start
rules.onGameStart(() => {
  game.say(`A loud blaring alarm slowly drags you out of your sleep.  For a moment you consider rolling over and returning to your rest, but you know that's a bad idea.  The ship's alarm wouldn't be going off for no reason, and most of the reasons it would be going off are deadly.`)
  game.say(`You sit up, rub the sleep from your eyes and glance around.  Primary lights are off, but you can make out darkened silhouettes from the emergency light in the washroom.  The computer panel in the wall is also darkened, so the engine must have stopped for long enough that the ship's primary power banks are drained.`)
  game.say(`Then you notice the worst part - the security doors to the comms room are shut, sealing you off from the rest of the ship.`)
  game.pause()
  game.clear()
  game.say(`You groan.`)
  game.pause()
  game.say(`Looks like this job just got a lot more complicated.`)
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
