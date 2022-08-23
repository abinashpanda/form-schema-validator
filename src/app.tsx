import { Route, Routes } from 'react-router-dom'
import AppShell from 'components/app-shell'
import NewEditor from 'pages/new-editor'
import SavedSchema from 'pages/saved-schema'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<NewEditor />} />
        <Route path="schema/:id" element={<SavedSchema />} />
      </Route>
    </Routes>
  )
}
