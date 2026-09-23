import { apiRequest } from '../../shared/api/client'
import type { PageResponse } from '../collaborators/types'
import type { Activity } from './types'

export type CreateActivityPayload = {
  description: string
  collaboratorId: string
}

export function listActivities(): Promise<PageResponse<Activity>> {
  const params = new URLSearchParams()
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
