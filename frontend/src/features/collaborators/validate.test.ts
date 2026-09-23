import { describe, expect, it } from 'vitest'
import { validateCollaboratorForm } from './validate'

describe('validateCollaboratorForm', () => {
  it('requires trimmed fields and positive salary', () => {
    const errors = validateCollaboratorForm({
      fullName: '  ',
      jobTitle: '',
      department: 'TI',
      admissionDate: '2024-01-15',
      salaryMask: 'R$ 0,00',
    })

    expect(errors.fullName).toBeDefined()
    expect(errors.jobTitle).toBeDefined()
    expect(errors.salaryMask).toBe('Salário deve ser positivo.')
    expect(errors.department).toBeUndefined()
  })

  it('accepts a valid form', () => {
    const errors = validateCollaboratorForm({
      fullName: 'Ana Silva',
      jobTitle: 'Dev',
      department: 'TI',
      admissionDate: '2024-01-15',
      salaryMask: 'R$ 3.500,50',
    })

    expect(errors).toEqual({})
  })
})
