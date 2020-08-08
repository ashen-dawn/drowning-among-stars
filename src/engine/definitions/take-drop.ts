import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { Item } from "../types/GameState";
import { Draft } from "immer";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('take')
    .as('take [item]')
    .as('get [item]')
    .as('pick up [item]')
    .as('grab [item]')
    .as('snatch [item]')
    .as('steal [item]')


  rules.onCommand('take', command => {
    const item = command.subject as Draft<Item>

    item.location = 'inventory'
    game.say('Taken.')
  })

  parser.understand('drop')
    .as('drop [item]')
    .as('put down [item]')
    .as('yeet [item]')
    .as('discard [item]')
    .as('abandon [item]')
    .as('chuck [item]')
    .as('throw [item]')
    .as('throw away [item]')
    .as('toss [item]')
    .as('trash [item]')

  rules.onCommand('drop', command => {
    const item = command.subject as Draft<Item>

    item.location = game.getCurrentRoom()!.name
    game.say('Dropped.')
  })
}
