import Game from './engine/Game'
import Parser from './engine/Parser'
import Renderer from './engine/Renderer'
import RulesEngine from './engine/RulesEngine'
import { ObjectType, Room, Door } from './engine/types/GameState'

let game = new Game()
let rules = new RulesEngine()
let parser = new Parser(game, rules)
let renderer = new Renderer(parser, game)

parser.understand('look')
  .as('look')
  .as('describe')

parser.understand('lookDirection')
  .as('look [direction]')

parser.understand('lookAt')
  .as('look [item]')
  .as('look [door]')
  .as('look at [item]')
  .as('look at [door]')
  .as('examine [item]')
  .as('examine [door]')
  .as('x [item]')
  .as('x [door]')

parser.understand('go')
  .as('go [direction]')
  .as('[direction]')

parser.understand('take')
  .as('take [item]')
  .as('get [item]')
  .as('pick up [item]')
  .as('grab [item]')
  .as('snatch [item]')
  .as('steal [item]')

parser.understand('unlockDoor')
  .as('unlock [door|subject] with [item|object]')
  .as('unlock [door]')
  .as('use [item|object] to unlock [door|subject]')

parser.understand('openDoor')
  .as('open [door]')
  .as('open [door|subject] with [item|object]')

const entry : Room = {
  type: ObjectType.Room,
  name: 'entry',
  aliases: [],
  neighbors: new Map()
}

const door : Door = {
  type: ObjectType.Door,
  name: 'door',
  aliases: ['white door'],
  neighbors: new Map(),
  locked: true,
  key: 'brass key'
}

const office : Room = {
  type: ObjectType.Room,
  name: 'office',
  aliases: [],
  neighbors: new Map()
}

entry.neighbors.set('east', 'door')
office.neighbors.set('west', 'door')
door.neighbors.set('east', 'office')
door.neighbors.set('west', 'entry')

game.addRoom(entry)
game.addRoom(office)
game.addDoor(door)

game.addItem({
  type: ObjectType.Item,
  name: 'brass key',
  aliases: ['key'],
  location: 'entry'
})

game.addItem({
  type: ObjectType.Item,
  name: 'ruby',
  aliases: ['gem'],
  location: 'office'
})

game.getState().player.location = 'entry'

game.saveDraft()


renderer.start()
