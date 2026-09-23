import { describe, expect, it } from 'vitest'
import { clampAdmissionDate, todayIso, validateCollaboratorForm } from './validate'

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

  it('rejects future admission date and field limits', () => {
    const today = new Date()
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
    const futureErrors = validateCollaboratorForm({
      fullName: 'a'.repeat(61),
      jobTitle: 'b'.repeat(31),
      department: 'c'.repeat(31),
      admissionDate: tomorrowIso,
      salaryMask: 'R$ 1,00',
    })

    expect(futureErrors.fullName).toBe('Nome completo excede o limite de 60 caracteres.')
    expect(futureErrors.jobTitle).toBe('Cargo excede o limite de 30 caracteres.')
    expect(futureErrors.department).toBe('Setor excede o limite de 30 caracteres.')
    expect(futureErrors.admissionDate).toBe('Data de admissão não pode ser futura.')

    const todayErrors = validateCollaboratorForm({
      fullName: 'Ana Silva',
      jobTitle: 'Dev',
      department: 'TI',
      admissionDate: iso,
      salaryMask: 'R$ 1,00',
    })
    expect(todayErrors.admissionDate).toBeUndefined()
  })

  it('clamps empty or future admission dates to today', () => {
    const today = todayIso()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`

    expect(clampAdmissionDate('')).toBe(today)
    expect(clampAdmissionDate(tomorrowIso)).toBe(today)
    expect(clampAdmissionDate('2024-01-15')).toBe('2024-01-15')
    expect(clampAdmissionDate(today)).toBe(today)
  })
})
