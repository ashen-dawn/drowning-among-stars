import React from 'react'

import styles from './Inventory.module.css'
import useGameState from '../../hooks/useGameState'

export default function () {
  const state = useGameState()

  const allItems = Array.from(state.items.values())
  const inventory = allItems.filter(({location}) => location === 'inventory')

  return (
    <>
      <h3>You have:</h3>
      <ul className={styles.list}>
        {inventory.map(item => (<li>{item.name}</li>))}
        {inventory.length === 0 && (<li>Nothing</li>)}
      </ul>
    </>
  )
}
