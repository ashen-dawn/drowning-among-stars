import React, { useEffect } from 'react'

import styles from './Loader.module.css'

import background from '../App/background.png'
import map from '../Modals/map.png'
import mapPerson from '../Modals/mapPerson.svg'

const images = [background, map, mapPerson]

export default function Loader({onLoad}) {
  useEffect(() => {
    Promise.all(images.map(preloadImage)).then(onLoad).catch(console.error.bind(console))

    // In case of failure - just launch the darn thing without images
    // after 10 seconds
    setTimeout(onLoad, 10000)
  }, [])

  return (
    <div className={styles.container}>
      <p>Loading...</p>
    </div>
  );
}

function preloadImage(url) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = res
    img.onerror = rej

    img.src = url
  })
}
