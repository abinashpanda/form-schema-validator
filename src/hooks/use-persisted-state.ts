import { useEffect, useState } from 'react'

function getDataFromLocalStorage<T extends any>(key: string): T | undefined {
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '')
  } catch (error) {
    return undefined
  }
}

export default function usePersistedState<T extends any>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(
    getDataFromLocalStorage(key) ?? initialValue,
  )

  useEffect(
    function persistDataToLocalStorage() {
      try {
        window.localStorage.setItem(key, JSON.stringify(state))
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn((error as Error).message)
      }
    },
    [key, state],
  )

  return [state, setState]
}
