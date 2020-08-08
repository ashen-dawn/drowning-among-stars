import {game, rules} from '../engine'


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
