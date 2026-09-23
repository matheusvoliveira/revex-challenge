import { parseSalaryMask } from '../../shared/format/currency'
import type { CollaboratorFormValues } from './types'

export type FormErrors = Partial<Record<keyof CollaboratorFormValues, string>>

export function todayIso(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function clampAdmissionDate(value: string): string {
  const today = todayIso()
  if (value.trim().length === 0 || value > today) {
    return today
  }
  return value
}

export function validateCollaboratorForm(values: CollaboratorFormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.fullName.trim().length === 0) {
    errors.fullName = 'Nome completo é obrigatório.'
  } else if (values.fullName.trim().length > 60) {
    errors.fullName = 'Nome completo excede o limite de 60 caracteres.'
  }
  if (values.jobTitle.trim().length === 0) {
    errors.jobTitle = 'Cargo é obrigatório.'
  } else if (values.jobTitle.trim().length > 30) {
    errors.jobTitle = 'Cargo excede o limite de 30 caracteres.'
  }
  if (values.department.trim().length === 0) {
    errors.department = 'Setor é obrigatório.'
  } else if (values.department.trim().length > 30) {
    errors.department = 'Setor excede o limite de 30 caracteres.'
  }
  if (values.admissionDate.trim().length === 0) {
    errors.admissionDate = 'Data de admissão é obrigatória.'
  } else if (values.admissionDate > todayIso()) {
    errors.admissionDate = 'Data de admissão não pode ser futura.'
  }

  const salary = parseSalaryMask(values.salaryMask)
  if (salary === null) {
    errors.salaryMask = 'Salário é obrigatório.'
  } else if (salary <= 0) {
    errors.salaryMask = 'Salário deve ser positivo.'
  }

  return errors
}
