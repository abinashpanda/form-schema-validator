import { Route, Routes } from 'react-router-dom'
import AppShell from 'components/app-shell'
import NewEditor from 'pages/new-editor'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<NewEditor />} />
      </Route>
    </Routes>
  )
}
