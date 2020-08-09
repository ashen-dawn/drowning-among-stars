import {game, rules} from '../engine'

/**
 * Cabin
 */
game.addRoom('cabin', 'Crew Cabin', `
A dark and dingy room with a single bunk bed along the starboard side.

The washroom is to the aft, with the comms room to port.
`)

rules.on('beforePrintItems', () => {
  const state = game.getState()
  const playerLocation = state.player.location
  const flashlightLocation = state.items.get('flashlight')?.location

  if(flashlightLocation !== 'inventory' && playerLocation === 'cabin')
    throw new Error('You cannot make out much more without light.')
})

rules.onAfterCommand(() => {
  const state = game.getState()

  const flashlightLocation = state.items.get('flashlight')?.location
  const wrenchExists = state.items.has('wrench')

  if(flashlightLocation === 'inventory' && !wrenchExists)
    game.addItem('wrench', 'Just generally useful for repairs and adjustments to the various mechanical parts of the ship.', 'cabin')
})

/**
 * Washroom
 */
game.addRoom('bathroom', 'Washroom', `
Tight, cramped, but serviceable.  The _Dawn_ was really only meant for a crew
of one or two, and that is no more evident than here.

The crew cabin is through the foreward door, and the little remaining space
is occupied with a sink and cabinet.
`)

const flashlight = game.addItem('flashlight', 'Metal rod with some LEDs embedded along its length', 'bathroom')
flashlight.aliases.push('flash light')
flashlight.aliases.push('light')
flashlight.aliases.push('torch')

/**
 * Comms
 */
game.addRoom('comms', 'Comms Room', `
A wide room with pipes and cabling running thick through the floor.

The bridge is to the fore, the medbay to port, and the crew cabin to starboard.
There is a large storage locker on the aft wall of the room.
`)

game.addRoom('bridge', 'Bridge', `
A lone chair sits in the center of the room, surrounded with computer
consoles and flight instruments.  Nowadays most aspects of spaceflight are
automated, but every pilot still needs to meet the certification to fly
manually.

The comms room is through the aft door.
`)

game.addRoom('medbay', 'Medical Bay', `
Most of the medical equipment in this room is a little past its use-by
date, although in the case of an explosion, impact, or other traumatic
event it would still save your life . . . at least you hope it would.

The stairwell is to the aft, with the comms room to starboard.
`)

game.addRoom('stairupper', 'Upper Stairwell', `
A large window in the aft wall shows the view of an unknown star system
in the distance.  It's almost peaceful to gaze at, if it didn't remind
you of how lost you are.

The medical bay is to the fore, with the stairs curling into
darkness beneath you.
`)

game.addRoom('stairlower', 'Lower Stairwell', `
A bit of light makes its way down through the wire stairs, helpfully
keeping you from falling on your face in the dark.

The mainframe is to the fore, and above you the stairs curl up and
out of sight.
`)


game.addRoom('mainframe', 'Mainframe', `
The mainframe fills the room with its soft humming, lights blinking
on and off in a disorderly pattern.

The stairwell is to the aft, with the engine room to starboard.
`)

game.addRoom('engine', 'Engine Room', `
The usual deep rumble of the ship's engines is missing, leaving a
disconcerting silence.

The mainframe is to port, with the docking bay to starboard.
`)

game.addRoom('docking', 'Docking Bay', `
A long and wide room for loading and unloading cargo.  The
dock hatch is sealed, and you definitely shouldn't go opening
that until you get back in atmosphere.

Toward port is the engine room, and through a small hole in
the ceiling you can see light coming from the bathroom.
`)

// Regular hallways
game.setNeighbor('cabin', 'aft', 'bathroom')
game.setNeighbor('cabin', 'port', 'comms')
game.setNeighbor('comms', 'port', 'medbay')
game.setNeighbor('comms', 'fore', 'bridge')
game.setNeighbor('medbay', 'aft', 'stairupper')
game.setNeighbor('stairupper', 'down', 'stairlower')
game.setNeighbor('stairlower', 'fore', 'mainframe')
game.setNeighbor('mainframe', 'starboard', 'engine')
game.setNeighbor('engine', 'starboard', 'docking')

// Secret passageways
game.setNeighbor('bathroom', 'down', 'docking')
