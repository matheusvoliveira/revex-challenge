import { apiRequest } from '../../shared/api/client'
import type { Collaborator, CollaboratorSummary, PageResponse } from './types'

export type CreateCollaboratorPayload = {
  fullName: string
  jobTitle: string
  department: string
  admissionDate: string
  salary: number
}

export function listCollaborators(): Promise<PageResponse<CollaboratorSummary>> {
  const params = new URLSearchParams()
  params.set('page', '0')
  params.set('size', '50')
  return apiRequest<PageResponse<CollaboratorSummary>>(`/api/collaborators?${params.toString()}`)
}

export function createCollaborator(payload: CreateCollaboratorPayload): Promise<Collaborator> {
  return apiRequest<Collaborator>('/api/collaborators', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
