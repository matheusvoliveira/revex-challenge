import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ActivityCreatePage } from '../features/activities/ActivityCreatePage'
import { ActivityListPage } from '../features/activities/ActivityListPage'
import { LoginPage } from '../features/auth/LoginPage'
import { getToken } from '../features/auth/token'
import { CollaboratorCreatePage } from '../features/collaborators/CollaboratorCreatePage'
import { CollaboratorDetailPage } from '../features/collaborators/CollaboratorDetailPage'
import { CollaboratorListPage } from '../features/collaborators/CollaboratorListPage'
import { AppChrome } from './AppChrome'
import { AuthLayout } from './AuthLayout'

function RequireAuth({ children }: { children: ReactNode }) {
  if (!getToken()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={(
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        )}
      />
      <Route
        element={(
          <RequireAuth>
            <AppChrome />
          </RequireAuth>
        )}
      >
        <Route path="/" element={<CollaboratorListPage />} />
        <Route path="/collaborators" element={<CollaboratorListPage />} />
        <Route path="/collaborators/new" element={<CollaboratorCreatePage />} />
        <Route path="/collaborators/:id" element={<CollaboratorDetailPage />} />
        <Route path="/activities" element={<ActivityListPage />} />
        <Route path="/activities/new" element={<ActivityCreatePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
