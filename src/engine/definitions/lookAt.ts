import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('lookAt')
    .as('look [item]')
    .as('look [door]')
    .as('look at [item]')
    .as('look at [door]')
    .as('examine [item]')
    .as('examine [door]')
    .as('x [item]')
    .as('x [door]')
    .as('l [item]')
    .as('l at [item]')

  rules.onCommand('lookAt', command => {
    const subject = command.subject!

    if(subject.description)
      game.say(subject.description)
    else
      game.say(`You see nothing remarkable about the ${subject.name}`)
  })
}