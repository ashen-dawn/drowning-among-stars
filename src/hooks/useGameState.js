import React, {useContext} from 'react'

const GameStateCtx = React.createContext()

export default function useGameState() {
  return useContext(GameStateCtx)
}

export const Provider = GameStateCtx.Provider
