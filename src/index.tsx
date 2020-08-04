import {game, rules, renderer} from './engine/'

import './rooms.tsx'


game.getState().player.location = 'cabin'
game.getCurrentRoom()!.visited = true

rules.onAfterCommand((command, game) => {
  game.getCurrentRoom()!.visited = true
})

game.saveDraft()


renderer.start(document.getElementById('root'))
