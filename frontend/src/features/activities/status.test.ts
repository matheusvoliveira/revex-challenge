import { describe, expect, it } from 'vitest'
import { canComplete, canStart, statusLabel } from './status'

describe('activity status helpers', () => {
  it('labels the three domain statuses', () => {
    expect(statusLabel('PENDENTE')).toBe('Pendente')
    expect(statusLabel('EM_ANDAMENTO')).toBe('Em andamento')
    expect(statusLabel('CONCLUIDA')).toBe('Concluída')
  })

  it('allows start only from pending', () => {
    expect(canStart('PENDENTE')).toBe(true)
    expect(canStart('EM_ANDAMENTO')).toBe(false)
    expect(canStart('CONCLUIDA')).toBe(false)
  })

  it('allows complete unless already completed', () => {
    expect(canComplete('PENDENTE')).toBe(true)
    expect(canComplete('EM_ANDAMENTO')).toBe(true)
    expect(canComplete('CONCLUIDA')).toBe(false)
  })
})
