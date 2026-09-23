import { Navigate, Route, Routes } from 'react-router-dom'
import { ActivityCreatePage } from '../features/activities/ActivityCreatePage'
import { ActivityListPage } from '../features/activities/ActivityListPage'
import { CollaboratorCreatePage } from '../features/collaborators/CollaboratorCreatePage'
import { CollaboratorDetailPage } from '../features/collaborators/CollaboratorDetailPage'
import { CollaboratorListPage } from '../features/collaborators/CollaboratorListPage'
import { Layout } from './Layout'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CollaboratorListPage />} />
        <Route path="/collaborators/new" element={<CollaboratorCreatePage />} />
        <Route path="/collaborators/:id" element={<CollaboratorDetailPage />} />
        <Route path="/activities" element={<ActivityListPage />} />
        <Route path="/activities/new" element={<ActivityCreatePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
