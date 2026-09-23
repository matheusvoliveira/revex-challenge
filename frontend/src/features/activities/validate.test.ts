import { describe, expect, it } from 'vitest'
import { validateActivityForm } from './validate'

describe('validateActivityForm', () => {
  it('requires description and collaborator', () => {
    const errors = validateActivityForm({
      description: '   ',
      collaboratorId: '',
    })

    expect(errors.description).toBe('Descrição é obrigatória.')
    expect(errors.collaboratorId).toBe('Colaborador é obrigatório.')
  })

  it('rejects description above technical limit', () => {
    const errors = validateActivityForm({
      description: 'a'.repeat(2001),
      collaboratorId: '11111111-1111-1111-1111-111111111111',
    })

    expect(errors.description).toBe('Descrição excede o limite técnico de 2000 caracteres.')
  })

  it('accepts a valid form', () => {
    const errors = validateActivityForm({
      description: 'Revisar contrato',
      collaboratorId: '11111111-1111-1111-1111-111111111111',
    })

    expect(errors).toEqual({})
  })
})
