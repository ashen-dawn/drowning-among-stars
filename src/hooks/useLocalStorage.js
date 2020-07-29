import {useEffect} from 'react'
import useSharedState from './useSharedState'

export default function useLocalStorage(key, initialValue) {
  const raw = window.localStorage.getItem(key)

  let init
  try {
    init = raw ? JSON.parse(raw) : initialValue
  } catch {
    init = initialValue
  }

  const [storedValue, setStoredValue] = useSharedState('localstorage_' + key, init)

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.log(error);
    }
  }, [storedValue, key])

  return [storedValue, setStoredValue];
}
