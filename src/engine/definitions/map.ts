import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

import {updateSharedState} from '../../hooks/useSharedState'

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('map')
    .as('map')

  rules.onCommand('map', () => {
    updateSharedState('currentMenu', 'map')
    document.getElementById('gameInput')?.blur()
  })
}
