import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { Direction, ObjectType, Door, Item } from "../types/GameState";
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
    
    if(item.location !== game.getState().player.location)
      throw new Error(`You cannot see the ${item.name}`)

    item.location = 'inventory'
    game.say('Taken.')
  })
}