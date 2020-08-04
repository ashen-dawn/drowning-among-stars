import {game} from './engine'

game.addRoom('cabin', 'Crew Cabin', `
A dark and dingy room with a single bunk bed along the starboard side.

The washroom is to the aft, with the common room to port.
`)

game.addRoom('bathroom', 'Washroom', `
Tight, cramped, but serviceable.  This ship was really only meant for a crew
of one or two, and that is no more evident than here.

A barren metal bowl sits below a cracked mirror and above a small cupboard.
`)

// TODO: Room descriptions
game.addRoom('commons', 'Common Room', `// TODO`)
game.addRoom('bridge', 'Bridge', `// TODO`)
game.addRoom('medbay', 'Medical Bay', `// TODO`)
game.addRoom('stairupper', 'Upper Stairwell', `// TODO`)
game.addRoom('stairlower', 'Lower Stairwell', `// TODO`)
game.addRoom('mainframe', 'Mainframe', `// TODO`)
game.addRoom('engine', 'Engine Room', `// TODO`)
game.addRoom('docking', 'Docking Bay', `// TODO`)

// Regular hallways
game.setNeighbor('cabin', 'aft', 'bathroom')
game.setNeighbor('cabin', 'port', 'commons')
game.setNeighbor('commons', 'port', 'medbay')
game.setNeighbor('commons', 'fore', 'bridge')
game.setNeighbor('medbay', 'aft', 'stairupper')
game.setNeighbor('stairupper', 'down', 'stairlower')
game.setNeighbor('stairlower', 'fore', 'mainframe')
game.setNeighbor('mainframe', 'starboard', 'engine')
game.setNeighbor('engine', 'starboard', 'docking')

// Secret passageways
game.setNeighbor('bathroom', 'down', 'docking')
