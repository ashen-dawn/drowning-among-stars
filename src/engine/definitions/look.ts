import Parser from "../Parser";
import RulesEngine from "../RulesEngine";
import Game from "../Game";
import { ValidCommandDetails } from "../types/ParsedCommand";
import printArea from "../../utils/printArea";

export default function(parser : Parser, rules : RulesEngine, game : Game) {
  parser.understand('look')
    .as('look')
    .as('describe')
    .as('l')

  rules.onCommand('look', (command : ValidCommandDetails) => {
    printArea(game)
  })
}
