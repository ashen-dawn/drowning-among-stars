import {useEffect, useState} from 'react'
import {EventEmitter} from 'events'

const sharedState = {}
const stateChanged = new EventEmitter()

const updateSharedState = (key, state) => {
  sharedState[key] = state
  stateChanged.emit(key)
}

export default function useSharedState(key) {
  const [localState, setLocalState] = useState()

  useEffect(() => {
    const updateLocal = () => setLocalState(sharedState[key])

    stateChanged.on(key, updateLocal)
    return () => stateChanged.off(key, updateLocal)
  }, [key])

  function updateCallback(param) {
    let next
    if(typeof param === 'function')
      next = param(localState)
    else
      next = param
    updateSharedState(key, next)
  }

  return [localState, updateCallback]
}
