import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { Door, Item } from "../types/GameState";
import { Draft } from "immer";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('unlockDoor')
    .as('unlock [door|subject] with [item|object]')
    .as('unlock [door]')
    .as('use [item|object] to unlock [door|subject]')
    .as('use [item|object] on [door|subject]')
    .as('open [door|subject] with [item|object]')

  rules.onCommand('unlockDoor', command => {
    if(!command.object)
      throw new Error(`Please specify what you would like to unlock the ${command.subject!.name} with`)
    
    const door = command.subject as Draft<Door>
    const key  = command.object  as Item

    if(key.location !== 'inventory')
      throw new Error(`You do not have the ${key.name}.`)

    if(door.key !== key.name)
      throw new Error(`The ${key.name} doesn't fit.`)

    door.locked = false
    game.say(`With a sharp **click** the ${door.name} unlocks.`)
  })
}