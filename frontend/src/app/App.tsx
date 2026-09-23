import { Navigate, Route, Routes } from 'react-router-dom'
import { CollaboratorCreatePage } from '../features/collaborators/CollaboratorCreatePage'
import { CollaboratorListPage } from '../features/collaborators/CollaboratorListPage'
import { Layout } from './Layout'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CollaboratorListPage />} />
        <Route path="/collaborators/new" element={<CollaboratorCreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
