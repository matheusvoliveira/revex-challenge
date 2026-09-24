import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearToken, getToken, setToken } from '../../features/auth/token'
import { apiRequest } from './client'

const memory = new Map<string, string>()

describe('apiRequest', () => {
  beforeEach(() => {
    memory.clear()
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => memory.get(key) ?? null,
        setItem: (key: string, value: string) => {
          memory.set(key, value)
        },
        removeItem: (key: string) => {
          memory.delete(key)
        },
        clear: () => memory.clear(),
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearToken()
  })

  it('does not attach a stored token to login', async () => {
    setToken('expired.jwt')
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ token: 'fresh.jwt' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    )
    vi.stubGlobal('fetch', fetchMock)

    await apiRequest('/api/auth/login', { method: 'POST', body: '{}' })

    const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
    expect(headers.has('Authorization')).toBe(false)
  })

  it('clears a stale token after login 401', async () => {
    setToken('expired.jwt')
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('{}', { status: 401, headers: { 'Content-Type': 'application/json' } }))
    )

    await expect(apiRequest('/api/auth/login', { method: 'POST', body: '{}' })).rejects.toMatchObject({
      status: 401,
    })
    expect(getToken()).toBeNull()
  })
})
