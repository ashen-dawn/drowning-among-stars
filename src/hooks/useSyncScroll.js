import { useEffect, useContext } from 'react'
import {ScreenContext} from '../components/Screen/Screen'

import useSharedState from './useSharedState'

export default function useSyncScroll(ref, key, deps = []) {

  const [scroll, setScroll] = useSharedState(key, 0)
  const whichScreen = useContext(ScreenContext)

  // Update to top
  useEffect(() => setScroll(0), []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update shared state on scroll
  useEffect(() => {
    if(!ref.current) return;
    if(whichScreen === 'secondary') return;

    function updateScroll(ev){
      setScroll(ev.target.scrollTop)
    }

    const parent = ref.current
    parent.addEventListener('scroll', updateScroll)
    return () => parent?.removeEventListener('scroll', updateScroll)
  }, [ref, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  // On shared state change, set scrollTop
  useEffect(() => {
    if(whichScreen !== 'primary' && ref.current)
      ref.current.scrollTop = scroll
  }, [scroll, ref, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

}
