import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('start')
    .as('start [item]')
    .as('restart [item]')
    .as('turn on [item]')

  rules.onCommand('start', command => {
    game.say(`That isn't something you can turn on.`)
  })
}
