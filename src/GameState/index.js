import autoBind from 'auto-bind'
import produce, {createDraft, finishDraft} from 'immer'

export default class GameState {
  constructor() {
    this.state = finishDraft(createDraft({
      directions: ['north', 'south', 'east', 'west'],
      player: {
        location: 'empty'
      },
      locations: {},
      items: {}
    }))

    autoBind(this)
  }

  getDraft() {
    return createDraft(this.state)
  }

  getState() {
    return this.state
  }

  sealState(draft) {
    this._updateState(() => draft)
  }

  createItem(item) {
    if(!item.id)
      throw new Error('Item must have an id field')

    if(this.state.items[item.id])
      throw new Error(`Item with id ${item.id} already defined`)

    this._updateState(state => {
      state.items[item.id] = item
    })
  }

  createLocation(location) {
    if(!location.id)
      throw new Error('Location must have an id field')

    if(this.state.locations[location.id])
      throw new Error(`Location with id ${location.id} already defined`)

    this._updateState(state => {
      state.locations[location.id] = location
    })
  }

  _updateState(reducer) {
    const newState = produce(this.state, reducer)

    // Make sure player can never be in an invalid location
    if(!newState.locations[newState.player.location])
      throw new Error('Player cannot be in invalid location')

    this.state = newState
  }

  filterCommandParsingsByValidNouns(parsings) {
    return parsings.filter(({tokens}) => {
      let nounExpressions = tokens.filter(token => token.type === 'expression')

      for(const expression of nounExpressions) {
        const itemType = expression.name
        const itemName = expression.value

        // TODO: Add options for several names
        if(itemType === 'direction' && !this.state.directions.includes(itemName))
          return false;

        if(itemType === 'door') {
          const door = Object.values(this.state.locations).filter(loc => loc.type === 'door').find(door => itemName === door.name)
          if(door)
            expression.id = door.id
          else
            return false;
        }

        if(itemType === 'room') {
          const room = Object.values(this.state.locations).filter(loc => loc.type === 'room').find(room => itemName === room.name)
          if(room)
            expression.id = room.id
          else
            return false;
        }

        if(itemType === 'item') {
          const item = Object.values(this.state.items).find(item => itemName === item.name)
          if(item)
            expression.id = item.id
          else
            return false;
        }
      }

      return true;
    })
  }
}
