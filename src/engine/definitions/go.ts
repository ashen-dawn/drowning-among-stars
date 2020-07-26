import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { Direction, ObjectType, Door } from "../types/GameState";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('go')
    .as('go [direction]')
    .as('[direction]')

  rules.onCommand('go', command => {
    const direction = command.subject as Direction
    const current = game.getCurrentRoom()

    const neighborName = current?.neighbors.get(direction.name)
    if(!neighborName)
      game.say(`You cannot go to the ${direction.name}`)
    
    let lookingAt = game.findObjectByName(neighborName, ObjectType.Room)
                 || game.findObjectByName(neighborName, ObjectType.Door)

    if(!lookingAt){
      console.warn(`Unable to find object ${neighborName}`)
      game.say(`You cannot go to the ${direction.name}`)
      return;
    }

    let room = lookingAt
    if(lookingAt.type === ObjectType.Door) {

      if(!(lookingAt as Door).open) {
        game.say(`(First opening the ${lookingAt.name})`)
        parser.runCommand(`open ${lookingAt.name}`)
      }

      const nextNeighborName = (lookingAt as Door).neighbors.get(direction.name)
      const nextNeighbor = game.findObjectByName(nextNeighborName, ObjectType.Room)

      if(!nextNeighbor)
        throw new Error(`Door ${lookingAt.name} does not lead anywhere to the ${direction.name}`)
      else
        room = nextNeighbor
    }

    game.getState().player.location = room.name
  })
}