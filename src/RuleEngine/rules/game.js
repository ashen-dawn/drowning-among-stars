export default [{
  type: 'internal',
  verb: 'playStarted',
  hooks: {
    carryOut: (state, action, say) => {
      state.player.location = 'entry'
      state.locations['entry'] = {
        id: 'entry',
        type: 'room',
        name: 'Entry Hall',
        description: `A quaint little hall at the entry to the house.`,
        neighbors: {
          east: 'lockedDoor'
        }
      }

      state.locations['safe'] = {
        id: 'safe',
        type: 'room',
        name: 'Safe',
        description: 'A large walk-in safe.',
        neighbors: {
          west: 'lockedDoor'
        }
      }

      state.locations['lockedDoor'] = {
        id: 'lockedDoor',
        type: 'door',
        name: 'white door',
        description: 'A faded white door with an old brass handle.',
        locked: true,
        key: 'brass key',
        neighbors: {
          west: 'entry',
          east: 'safe'
        }
      }

      state.items['brass key'] = {
        id: 'brass key',
        name: 'brass key',
        description: 'A heavy brass key'
      }
    }
  }
}]
