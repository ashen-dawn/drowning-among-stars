import Game from './Game'
import Parser from './Parser'
import Renderer from './Renderer'
import RulesEngine from './RulesEngine'
import definitions from './definitions'

export const game = new Game()
export const rules = new RulesEngine(game)
export const parser = new Parser(game, rules)
export const renderer = new Renderer(parser, game, rules)

for(const {default: func} of definitions) {
  func(parser, rules, game)
}
