import React, {useRef, useEffect} from 'react'
import styles from './Menu.module.css'
import useSharedState from '../../hooks/useSharedState'
import Inventory from '../Modals/Inventory'
import Options from '../Modals/Options'
import Help from '../Modals/Help'
import Map from '../Modals/Map'
import useSyncScroll from '../../hooks/useSyncScroll'

export default function ({containerRef}) {
  const scrollRef = useRef()
  const [currentMenu, setCurrentMenu] = useSharedState('currentMenu')
  useSyncScroll(scrollRef, 'modalScroll', [currentMenu])

  function handleButton(name) {
    return ev => setCurrentMenu(current => {
      if(current === name)
        return null
      return name
    })
  }

  useEffect(() => {
    function handleKey(ev) {
      if(ev.key !== 'Escape') return
      setCurrentMenu(null)
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setCurrentMenu])

  return (
    <div ref={containerRef} className={styles.menuBar}>
      <MenuButton name="map" current={currentMenu} handleButton={handleButton}/>
      <MenuButton name="inventory" current={currentMenu} handleButton={handleButton}/>
      <MenuButton name="help" current={currentMenu} handleButton={handleButton}/>
      <MenuButton name="options" current={currentMenu} handleButton={handleButton}/>
      {currentMenu && (
        <>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>
              {currentMenu}
              <button className={styles.modalClose} onClick={() => setCurrentMenu(null)}>x</button>
            </div>
            <div className={styles.modalContent} ref={scrollRef}>
              {(() => {
                if(currentMenu === 'inventory')
                  return <Inventory/>

                if(currentMenu === 'map')
                  return <Map />

                if(currentMenu === 'options')
                  return <Options/>

                if(currentMenu === 'help')
                  return <Help parentRef={scrollRef} />

                return <p>Not implemented yet, sorry</p>
              })()}
            </div>
          </div>
        </>
      )}
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
