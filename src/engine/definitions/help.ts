import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

import {updateSharedState} from '../../hooks/useSharedState'

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('help')
    .as('help')
    .as('h')

  rules.onCommand('help', () => {
    updateSharedState('currentMenu', 'help')
    document.getElementById('gameInput')?.blur()
  })
}
