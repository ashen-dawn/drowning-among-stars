import React, {useContext} from 'react'

const SaveGameCtx = React.createContext()

export default function useSaveGame() {
  return useContext(SaveGameCtx)
}

export const Provider = SaveGameCtx.Provider
