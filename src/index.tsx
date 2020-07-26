import {game, renderer} from './engine/'
import { ObjectType, Room, Door } from './engine/types/GameState'

const entry : Room = {
  type: ObjectType.Room,
  name: 'entry',
  printableName: 'entry',
  aliases: [],
  neighbors: new Map(),
  description: 'A tight corridor with yellow faded walls.'
}

const closet : Room = {
  type: ObjectType.Room,
  name: 'closet',
  printableName: 'closet',
  aliases: [],
  neighbors: new Map(),
  description: 'A small closet'
}

const door : Door = {
  type: ObjectType.Door,
  name: 'door',
  printableName: 'white door',
  aliases: ['white door'],
  neighbors: new Map(),
  locked: true,
  key: 'brass key',
  description: 'A large white door with but a single keybole.',
  open: false
}

const office : Room = {
  type: ObjectType.Room,
  name: 'office',
  printableName: 'office',
  aliases: [],
  neighbors: new Map(),
  description: 'An opulent office'
}

entry.neighbors.set('east', 'door')
office.neighbors.set('west', 'door')
door.neighbors.set('east', 'office')
door.neighbors.set('west', 'entry')
entry.neighbors.set('west', 'closet')
closet.neighbors.set('east', 'entry')

game.addRoom(entry)
game.addRoom(office)
game.addRoom(closet)
game.addDoor(door)

game.addItem({
  type: ObjectType.Item,
  printableName: 'brass key',
  name: 'brass key',
  aliases: ['key'],
  location: 'entry'
})

game.addItem({
  type: ObjectType.Item,
  printableName: 'gem',
  name: 'ruby',
  aliases: ['gem'],
  location: 'office'
})

game.getState().player.location = 'entry'

game.saveDraft()


renderer.start(document.getElementById('root'))
