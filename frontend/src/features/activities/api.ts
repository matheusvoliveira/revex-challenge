import { apiRequest } from '../../shared/api/client'
import type { PageResponse } from '../collaborators/types'
import type { Activity, ActivityStatus } from './types'

export type CreateActivityPayload = {
  description: string
  collaboratorId: string
}

export type ActivityListFilters = {
  collaboratorId?: string
  status?: ActivityStatus | ''
}

export function listActivities(filters: ActivityListFilters = {}): Promise<PageResponse<Activity>> {
  const params = new URLSearchParams()
  if (filters.collaboratorId && filters.collaboratorId.trim().length > 0) {
    params.set('collaboratorId', filters.collaboratorId.trim())
  }
  if (filters.status) {
    params.set('status', filters.status)
  }
  params.set('page', '0')
  params.set('size', '50')
  return apiRequest<PageResponse<Activity>>(`/api/activities?${params.toString()}`)
}

export function createActivity(payload: CreateActivityPayload): Promise<Activity> {
  return apiRequest<Activity>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function startActivity(id: string): Promise<Activity> {
  return apiRequest<Activity>(`/api/activities/${id}/start`, { method: 'PATCH' })
}

export function completeActivity(id: string): Promise<Activity> {
  return apiRequest<Activity>(`/api/activities/${id}/complete`, { method: 'PATCH' })
}
