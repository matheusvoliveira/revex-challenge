import { describe, expect, it } from 'vitest'
import { validateActivityDescription, validateActivityForm, validateActivityTitle } from './validate'

describe('validateActivityForm', () => {
  it('requires title, description and collaborator', () => {
    const errors = validateActivityForm({
      title: '  ',
      description: '   ',
      collaboratorId: '',
    })
    expect(errors.title).toBe('Título é obrigatório.')
    expect(errors.description).toBe('Descrição é obrigatória.')
    expect(errors.collaboratorId).toBe('Colaborador é obrigatório.')
  })

  it('rejects description above technical limit', () => {
    const errors = validateActivityForm({
      title: 'Ok',
      description: 'a'.repeat(1001),
      collaboratorId: '11111111-1111-1111-1111-111111111111',
    })

    expect(errors.description).toBe('Descrição excede o limite de 1000 caracteres.')
  })

  it('accepts a valid form', () => {
    const errors = validateActivityForm({
      title: 'Revisar contrato',
      description: 'Revisar cláusulas pendentes',
      collaboratorId: '11111111-1111-1111-1111-111111111111',
    })

    expect(errors).toEqual({})
  })

  it('validates title and description alone for inline edit', () => {
    expect(validateActivityTitle('   ')).toBe('Título é obrigatório.')
    expect(validateActivityTitle('Atualizar texto')).toBeNull()
    expect(validateActivityDescription('   ')).toBe('Descrição é obrigatória.')
    expect(validateActivityDescription('Atualizar texto')).toBeNull()
  })
})
