import constate from 'constate'
import { useCallback, useEffect, useState } from 'react'
import { User, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from 'utils/firebase'
import { message } from 'antd'

function useAuth() {
  const [authVerified, setAuthVerified] = useState(false)
  const [user, setUser] = useState<User | undefined>(undefined)

  useEffect(function setUserOnMount() {
    auth.onAuthStateChanged((_user) => {
      if (_user) {
        setUser(_user)
      } else {
        setUser(undefined)
      }
      setAuthVerified(true)
    })
  }, [])

  const signInWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider()
    return signInWithPopup(auth, provider)
      .then((user) => user)
      .catch((error) => {
        message.error(error.message)
      })
  }, [])

  const signOut = useCallback(() => {
    return auth.signOut().catch((error) => {
      message.error(error.message)
    })
  }, [])

  return {
    authVerified,
    user,
    signInWithGoogle,
    signOut,
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
