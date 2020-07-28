import React from 'react'
import styles from './Menu.module.css'
import useSharedState from '../../hooks/useSharedState'

export default function ({containerRef}) {
  const [currentMenu, setCurrentMenu] = useSharedState('currentMenu')

  function handleButton(name) {
    return ev => setCurrentMenu(current => {
      if(current === name)
        return null
      return name
    })
  }

  return (
    <div ref={containerRef} className={styles.menuBar}>
      <MenuButton name="map" current={currentMenu} handleButton={handleButton}/>
      <MenuButton name="inventory" current={currentMenu} handleButton={handleButton}/>
      <MenuButton name="help" current={currentMenu} handleButton={handleButton}/>
      <MenuButton name="options" current={currentMenu} handleButton={handleButton}/>
    </div>
  )
}

function MenuButton({name, current, handleButton}) {
  const caps = name.slice(0,1).toUpperCase() + name.slice(1)

  return (
    <button
      className={styles.button + (name === current ? ' ' + styles.current : '')}
      onClick={handleButton(name)}
    >
      {caps}
    </button>
  )
}
