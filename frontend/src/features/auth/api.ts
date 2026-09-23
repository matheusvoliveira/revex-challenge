import { apiRequest } from '../../shared/api/client'

export type LoginPayload = {
  username: string
  password: string
}

export type LoginResponse = {
  token: string
}

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
