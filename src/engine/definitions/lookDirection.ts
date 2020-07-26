import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { Direction, ObjectType } from "../types/GameState";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('lookDirection')
    .as('look [direction]')
    .as('l [direction]')

  rules.onCommand('lookDirection', command => {
    const direction = command.subject as Direction
    const current = game.getCurrentRoom()

    const lookingAtName = current?.neighbors.get(direction.name)

    if(!lookingAtName)
      throw new Error(`There is nothing to the ${direction.name}`)
    
    let lookingAt = game.findObjectByName(lookingAtName!, ObjectType.Room)
                 || game.findObjectByName(lookingAtName!, ObjectType.Door)

    if(!lookingAt){
      console.warn(`Unable to find object ${lookingAtName}`)
      return;
    }

    game.say(`To the ${direction.name} you see the ${lookingAt.printableName}`)
  })
}