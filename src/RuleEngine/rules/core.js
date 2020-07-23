import printArea from '../../utils/printArea'
// import {current} from 'immer'

let pastArea

export default [{
  hooks: {
    // After the player's location changes, print the new area's description
    after: (state, action, say) => {
      const {location} = state.player
      if(location !== pastArea) {
        printArea(state.locations[location], say)
        pastArea = location
      }
    }
  }
},{
  type: 'player',
  verb: 'take',
  hooks: {
    carryOut: (state, action, say) => {
      const item = state.items[action.getSubject()]
      const player = state.player

      if(item.location !== player.location) {
        say(`You cannot see the ${action.subject.value}`)
      } else {
        item.location = 'inventory'
        say('Taken.')
      }
    }
  }
}]
