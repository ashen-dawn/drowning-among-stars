import {game} from '../engine'

export enum Phase {
  wakeUp,
  hasFlashlight,
  checkedUnderSink,
  gotWrench,
  openedSinkPanel,
  droppedBelow,
  fixedLifeSupport,
  examinedEngine,
  examinedMainframe,
  examinedDoor,
  examinedChair,
  destroyedChair,
  openedDoor,
  examinedLocker,
  examinedHoleCannotGetUp,
  hasNewChair,
  returnedUpToBathroom,
  hasKey,
  unlockedLocker
}

// TODO: Replace [thing]
export const hints : Map<Phase, string> = new Map()
hints.set(Phase.wakeUp, 'You may be able to assess your situation better if you find a light.')
hints.set(Phase.hasFlashlight, 'With the security door shut and power cut off, you\'ll have to find another way into the rest of the ship.')
hints.set(Phase.checkedUnderSink, `There is a panel under the sink that you might be able to fit through - you'll need a wrench to get it open though.`)
hints.set(Phase.gotWrench, `You have a wrench and can open the panel under the sink.`)
hints.set(Phase.openedSinkPanel, 'You can get to the lower deck through the panel under the sink, but be sure not to leave anything behind!')
hints.set(Phase.droppedBelow, 'You need to re-start the CO<sub>2</sub> scrubber before you run out of clean air.')
hints.set(Phase.fixedLifeSupport, 'While the immediate threat to your life has been solved, you need to bring the engine back on so you can restore power to your ship.')
hints.set(Phase.examinedEngine, 'The engine itself seems to be in good repair, time to go to the mainframe and start up its control systems.')
hints.set(Phase.examinedMainframe, 'The engine control systems are missing [thing].  There\'s a spare in the comm room locker, but you\'ll have to find a way to get there.')
hints.set(Phase.examinedDoor, 'You need to find a way into the comms room to retrieve [thing] - the door looks like it could be pried open with enough leverage.')
hints.set(Phase.examinedChair, 'The chair looks sturdy enough to work as a lever to get in the door, but it will have to be disassembled first.')
hints.set(Phase.destroyedChair, 'You have a bar that should be strong enough to open the door to the comms room - go retrieve the [thing] so you can start the engine again!')
hints.set(Phase.openedDoor, 'You found a way into the comms room - retrieve the [thing] from the comms room locker so you can restart the engine.')
hints.set(Phase.examinedLocker, 'Someone locked the comms room locker.  There\'s a spare key in your overalls - they\'re back in your cabin.')
hints.set(Phase.examinedHoleCannotGetUp, 'You can\'t reach up into the bathroom any more - you\'ll have to find something else to use to climb up')
hints.set(Phase.hasNewChair, 'You found another chair you can use to reach the bathroom - go get the spare locker key from your cabin.')
hints.set(Phase.returnedUpToBathroom, 'Someone locked the comms room locker.  There\'s a spare key in your overalls - they\'re back in your cabin.')
hints.set(Phase.hasKey, `You've retrieved the spare key to the comms locker, and can finally get the [thing] to repair the mainframe.`)
hints.set(Phase.unlockedLocker, 'Locker is empty - whoever was in your ship made sure you wouldn\'t be able to repair it.')

setImmediate(() => {
  game.createProperty('gamePhase', Phase.wakeUp)
})
