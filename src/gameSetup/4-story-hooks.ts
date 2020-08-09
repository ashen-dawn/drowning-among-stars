import {game, rules} from '../engine'
import { Phase } from './2-phases-and-hints'

/**
 * Intro
 */
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

/**
 * Upon picking up the flashlight
 */
rules.onAfterCommand(command => {
  if(command.verb.name !== 'take' || command.subject?.name !== 'flashlight')
    return

  if(game.hasProperty('pickedUpFlashlight'))
    return
  else
    game.createProperty('pickedUpFlashlight', true)

  game.clear()

  game.say(`You click the light on and glance around, sighing. The Dawn has certainly seen better days.  She flies just fine, but assuming you survive you'll definitely have to use the money from this job to finally replace all the rusty patches with new parts.`)
  game.say(`It figures that the easy delivery would turn out to be the one where you have the most problems.  All you had to do was take a few sealed boxes to the far side of the galaxy and then fly back - no sneaking, no lying, no fighting or anything!`)
  game.pause()
  game.clear()
  game.say(`(Of course the people you were delivering it to are outlaws, but who's going to turn their nose up on the perfect job just because of a few laws?)`)
  game.say(`A sharp pain in your chest quickly pulls you back to the present - the CO<sub>2</sub> scrubber must have stopped when the ship dropped out of hyperspace.  Looks like that's gotta be priority number one, unless you want to die before you can get home and collect your pay!`)

  game.pause()
  game.clear()
  rules.printArea()
})

/**
 * Upon picking up wrench
 */
rules.onAfterCommand(command => {
  if(command.verb.name !== 'take' || command.subject?.name !== 'wrench')
    return

  if(game.hasProperty('pickedUpWrench'))
    return
  else
    game.createProperty('pickedUpWrench', true)

  game.clear()

  game.say(`You suppose this kind of equipment failure is inevitable, although it's a bit strange since you had the engine checked last week.  It was the same cousin who checked the engine as who told you about this job actually.`)
  game.say(`"Listen, I know you don't want to get involved in the synth trade but it's just one supply run and they can pay you a lot for it."  Wren had said.  "I'd do it myself but the Aurora's a flying collection of scrap at this point, and you know how I hate having to find new pilots."`)

  game.pause()
  game.clear()

  game.say(`You had groaned at that.  "And you think the Ashen Dawn is in any better condition?  That's why I brought her to you, numbskull."`)
  game.say(`Wren's grin was wide, but knowing. "Listen, after I fix her up let me introduce you to my client Rosalyn - it's a simple supply run, and would be a good shakedown for Dawn after the repairs."`)

  game.pause()
  game.clear()

  game.say(`It looks like taking a simple job as your first shakedown flight was a good idea after all, although when you get out of this you're going to have some serious words with Wren about the quality of his work the last few visits.`)
  game.say(`You're not sure if your throat is actually growing scratchy, or if it's all in your head . . . either way you'd better get the CO<sub>2</sub> scrubber back online.`)

  game.pause()
  game.clear()
  rules.printArea()
})

/**
 * Dropping from bathroom to docking bay for the first time
 */
rules.onAfterCommand(command => {
  // When going down from the bathroom . . .
  if(command.verb.name !== 'go' || command.subject?.name !== 'down' || game.getCurrentRoom()?.name !== 'bathroom')
    return

  // Only do once
  if(game.getProperty('gamePhase') >= Phase.droppedBelow)
    return
  else
    game.setProperty('gamePhase', Phase.droppedBelow)

  game.clear()

  game.say(`As you lower yourself down into the cargo bay you're struck by how empty it looks.  Normally this storage bay would have a lot more general-purpose supplies, but you had to clear it out to make room for this delivery.  Since you've dropped the cargo and were on your way to get paid, they're no longer here to fill that space.`)
  game.pause()
  game.say(`You weren't permitted to know what was in the boxes you delivered. "Wares to be sold in the outer markets," Rosalyn said when you asked.  "The less you know the less you have to worry." `)
  game.say(`You weren't even sure how heavy or light the boxes were - she arranged crews for loading and unloading ahead of time, and the time requirements for delivery were just close enough you hadn't dared stop to investigate along the way.  It really was as easy as Wren had said it would be...`)

  game.pause()
  game.clear()
})
