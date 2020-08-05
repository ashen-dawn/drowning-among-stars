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
}
