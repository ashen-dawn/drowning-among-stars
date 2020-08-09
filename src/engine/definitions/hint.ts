import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import {hints} from '../../gameSetup/2-phases-and-hints'

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('hint')
    .as('hint')

  rules.onCommand('hint', () => {
    const phase = game.getProperty('gamePhase')

    const hint = hints.get(phase)

    if(hint)
      game.say(hint)
    else
      game.say(`Well this is embarassing - no hint for this game phase`)
  })
}
