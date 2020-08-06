import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { ObjectType, Door } from "../types/GameState";
import { Draft } from "immer";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('openDoor')
    .as('open [door]')

  rules.onCommand('openDoor', command => {
    const door = command.subject as Door

    if(door.open) {
      game.say(`The ${door.name} is already open`)
      return
    }

    if(door.locked) {
      throw new Error(`The ${door.name} is locked.`)
    }

    const mutable = game.findObjectByName(door.name, ObjectType.Door);
    (mutable as Draft<Door>).open = true
  })


  parser.understand('openItem')
    .as('open [item]')

  rules.onCommand('openItem', () => {
    game.say(`You don't believe that can be opened!`)
  })
}
