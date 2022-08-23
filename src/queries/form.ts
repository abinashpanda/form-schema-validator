import { db } from 'utils/firebase'
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { v4 } from 'uuid'
import { SavedSchema } from 'types/form'

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
    name: name.trim(),
    content: content.trim(),
    user,
  })
}

export function getForm(id: string) {
  const formDoc = doc(db, 'forms', id)
  return getDoc(formDoc).then(
    (doc) => ({ ...doc.data(), id: doc.id } as SavedSchema),
  )
}

export function updateForm({
  name,
  content,
  id,
}: {
  name: string
  content: string
  id: string
}) {
  return updateDoc(doc(db, 'forms', id), {
    name: name.trim(),
    content: content.trim(),
  })
}
