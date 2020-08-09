import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('take apart')
    .as('take apart [item]')
    .as('disassemble [item]')
    .as('dissassemble [item]')

  rules.onCommand('take apart', command => {
    game.say(`That isn't something you can take apart.`)
  })
}
