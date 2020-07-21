import autoBind from 'auto-bind'
import produce, {createDraft, finishDraft} from 'immer'

export default class GameState {
  constructor() {
    this.state = finishDraft(createDraft({
      player: {
        location: 'empty'
      },
      locations: {},
      items: {}
    }))

    this.updateState = reducer => {
      this.state = produce(this.state, reducer)
    }

    autoBind(this)
  }

  getDraft() {
    return createDraft(this.state)
  }

  getState() {
    return this.state
  }

  sealState(draft) {
    this.state = finishDraft(draft)
  }

  createItem(item) {
    if(!item.id)
      throw new Error('Item must have an id field')

    if(this.state.items[item.id])
      throw new Error(`Item with id ${item.id} already defined`)

    this.updateState(state => {
      state.items[item.id] = item
    })
  }

  createLocation(location) {
    if(!location.id)
      throw new Error('Location must have an id field')

    if(this.state.locations[location.id])
      throw new Error(`Location with id ${location.id} already defined`)

    this.updateState(state => {
      state.locations[location.id] = location
    })
  }
}
