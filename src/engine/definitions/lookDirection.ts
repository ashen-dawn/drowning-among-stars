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
      throw new Error(`There is nothing that direction`)

    let lookingAt = game.findObjectByName(lookingAtName!, ObjectType.Room)
                 || game.findObjectByName(lookingAtName!, ObjectType.Door)

    if(!lookingAt){
      console.warn(`Unable to find object ${lookingAtName}`)
      throw new Error(`There is nothing that direction`)
    }

    let prefix = 'To the ' + direction.name
    let suffix = ''
    if(direction.name === 'up')
      prefix = 'Above you'

    if(direction.name === 'down')
      prefix = 'Below you, '

    if(['port', 'starboard'].includes(direction.name))
      prefix = 'Towards ' + direction.name

    if(['fore', 'aft'].includes(direction.name))
      suffix = 'of the ship'

    game.say(`${prefix} ${suffix} you see the ${lookingAt.printableName}`)
  })
}
