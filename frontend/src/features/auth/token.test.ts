import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { clearToken, getToken, setToken } from './token'

const memory = new Map<string, string>()

describe('auth token storage', () => {
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
    sessionStorage.clear()
  })

  it('stores and clears the session token', () => {
    expect(getToken()).toBeNull()
    setToken('abc.def.ghi')
    expect(getToken()).toBe('abc.def.ghi')
    clearToken()
    expect(getToken()).toBeNull()
  })
})
