export default [{
  type: 'internal',
  verb: 'playStarted',
  hooks: {
    carryOut: (state, action, say) => {
      state.player.location = 'entry'
      state.locations['entry'] = {
        id: 'entry',
        name: 'Entry Hall',
        description: `A quaint hall at the entry to the house.`
      }
    }
  }
}]
