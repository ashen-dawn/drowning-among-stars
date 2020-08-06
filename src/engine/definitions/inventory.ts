import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

import {updateSharedState} from '../../hooks/useSharedState'

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('inventory')
    .as('i')
    .as('inventory')
    .as('inv')

  rules.onCommand('inventory', () => {
    updateSharedState('currentMenu', 'inventory')
    document.getElementById('gameInput')?.blur()
  })
}
