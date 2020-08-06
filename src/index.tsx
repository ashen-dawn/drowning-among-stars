import {game, rules, renderer} from './engine/'

import './rooms.tsx'

// Initial player location
game.getState().player.location = 'cabin'

// Mark room visited when ending a turn there
const markRoomVisited = () => {game.getCurrentRoom()!.visited = true}
rules.onGameStart(markRoomVisited)
rules.onAfterCommand(markRoomVisited)

// Mark items as seen when ending a turn in their room
const setItemsSeen = () => game.findObjectsInRoom(game.getCurrentRoom()!.name).forEach(item => {item.seen = true})
rules.onGameStart(setItemsSeen)
rules.onAfterCommand(setItemsSeen)

// Track items' last seen location
const setItemLastLoc = () => game.findObjectsInRoom(game.getCurrentRoom()!.name).forEach(item => {item.lastKnownLocation = game.getCurrentRoom()!.name})
rules.onGameStart(setItemLastLoc)
rules.onAfterCommand(setItemLastLoc)

game.addItem('Block', 'A boring wooden block', 'commons')

game.saveDraft()

// Print description on game start
rules.onGameStart(() => {
  game.say(`Come, join the navy they said.`)
  game.pause()
  game.say(`It'll be fun they said.`)
  game.pause()
  game.clear()
})



renderer.start(document.getElementById('root'))
