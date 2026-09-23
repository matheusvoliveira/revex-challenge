import { apiRequest } from '../../shared/api/client'
import type { Collaborator, CollaboratorSummary, PageResponse } from './types'

export type CreateCollaboratorPayload = {
  fullName: string
  jobTitle: string
  department: string
  admissionDate: string
  salary: number
}

export function listCollaborators(department?: string): Promise<PageResponse<CollaboratorSummary>> {
  const params = new URLSearchParams()
  if (department && department.trim().length > 0) {
    params.set('department', department.trim())
  }
  params.set('page', '0')
  params.set('size', '50')
  const query = params.toString()
  return apiRequest<PageResponse<CollaboratorSummary>>(`/api/collaborators?${query}`)
}

export function getCollaborator(id: string): Promise<Collaborator> {
  return apiRequest<Collaborator>(`/api/collaborators/${id}`)
}

export function createCollaborator(payload: CreateCollaboratorPayload): Promise<Collaborator> {
  return apiRequest<Collaborator>('/api/collaborators', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateCollaborator(id: string, payload: CreateCollaboratorPayload): Promise<Collaborator> {
  return apiRequest<Collaborator>(`/api/collaborators/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}
