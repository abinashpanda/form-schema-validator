import constate from 'constate'
import { useEffect, useState } from 'react'
import { SavedSchema } from 'types/form'
import { onSnapshot, collection, where, query } from 'firebase/firestore'
import { db } from 'utils/firebase'
import { useAuthContext } from 'hooks/use-auth'

function useUserData() {
  const { user } = useAuthContext()
  const [savedSchemas, setSavedSchemas] = useState<SavedSchema[]>([])

  useEffect(
    function fetchSchemasFromDB() {
      if (user) {
        const unsub = onSnapshot(
          query(collection(db, 'forms'), where('user', '==', user.uid)),
          (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
            setSavedSchemas(data as SavedSchema[])
          },
        )

        return unsub
      } else {
        setSavedSchemas([])
      }
    },
    [user],
  )

  return { savedSchemas }
}

export const [UserDataProvider, useUserDataContext] = constate(useUserData)
