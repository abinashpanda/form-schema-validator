import { db } from 'utils/firebase'
import { setDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { v4 } from 'uuid'
import { SavedSchema } from 'types/form'

export function getForm(id: string) {
  const formDoc = doc(db, 'forms', id)
  return getDoc(formDoc).then(
    (doc) => ({ ...doc.data(), id: doc.id } as SavedSchema),
  )
}

export function createForm({
  name,
  content,
  user,
}: {
  name: string
  content: string
  user: string
}) {
  const id = v4()
  return setDoc(doc(db, 'forms', id), {
    name: name.trim(),
    content: content.trim(),
    user,
  }).then(() => getForm(id))
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
  }).then(() => getForm(id))
}

export function deleteForm(id: string) {
  return deleteDoc(doc(db, 'forms', id))
}
