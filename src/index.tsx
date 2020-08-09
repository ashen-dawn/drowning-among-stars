import {game, renderer} from './engine/'

import './gameSetup/0-item-visibility'
import './gameSetup/1-rooms-and-items'
import './gameSetup/2-phases-and-hints'
import './gameSetup/3-game-rules'
import './gameSetup/4-story-hooks'

game.saveDraft()

renderer.start(document.getElementById('root'))
