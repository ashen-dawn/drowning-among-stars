import capitalize from "./capitalize"
import Game from "../engine/Game"

export default function printArea(game : Game) {
  const location = game.getCurrentRoom()!

  game.say(`**${capitalize(location.printableName)}**`)
  game.say(location.description!)

  const items = game.findObjectsInRoom(location.name)
  const doors = game.findDoorsInRoom(location.name)
  const things = [...items, ...doors]

  if(things.length === 0)
    return

  if(things.length === 1)
    game.say(`You see the ${things[0].printableName} here.`)
  else if (things.length === 2)
    game.say(`You see the ${things[0].printableName} and the ${things[1].printableName} here.`)
  else{
    let youCanSee = 'You see '

    for(const i in things) {
      const thing = things[i]

      if(i === '0')
        youCanSee += 'the ' + thing.printableName
      else if(i === '' + (things.length - 1))
        youCanSee += ', and the ' + thing.printableName + ' here.'
      else
        youCanSee += ', the ' + thing.printableName
    }

    game.say(youCanSee)
  }

}
