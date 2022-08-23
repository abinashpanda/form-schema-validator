import { db } from 'utils/firebase'
import { setDoc, doc } from 'firebase/firestore'
import { v4 } from 'uuid'

export function createForm({
  name,
  content,
  user,
}: {
  name: string
  content: string
  user: string
}) {
  return setDoc(doc(db, 'forms', v4()), {
    name,
    content,
    user,
  })
}
