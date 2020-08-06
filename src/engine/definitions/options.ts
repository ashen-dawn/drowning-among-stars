import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

import {updateSharedState} from '../../hooks/useSharedState'

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('options')
    .as('options')
    .as('opt')

  rules.onCommand('options', () => {
    updateSharedState('currentMenu', 'options')
    updateSharedState('optionsTab', 'video')
    document.getElementById('gameInput')?.blur()
  })

  parser.understand('save')
    .as('save')
    .as('load')
    .as('restore')
    .as('data')

  rules.onCommand('save', () => {
    updateSharedState('currentMenu', 'options')
    updateSharedState('optionsTab', 'data')
    document.getElementById('gameInput')?.blur()
  })
}
