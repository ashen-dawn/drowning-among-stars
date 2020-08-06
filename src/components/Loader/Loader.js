import React, { useEffect } from 'react'

import styles from './Loader.module.css'

import background from '../App/background.png'
import map from '../Modals/map.png'
import mapPerson from '../Modals/mapPerson.svg'

const images = [background, map, mapPerson]

export default function Loader({onLoad}) {
  useEffect(() => {
    Promise.all(images.map(preloadImage)).then(onLoad)
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
