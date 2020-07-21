import printArea from '../../utils/printArea'

let pastArea

export default [{
  type: 'internal',
  hooks: {
    after: (state, action, say) => {
      const {location} = state.player
      if(location !== pastArea) {
        printArea(state.locations[location], say)
        pastArea = location
      }
    }
  }
}]
