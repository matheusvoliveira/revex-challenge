import { parseSalaryMask } from '../../shared/format/currency'
import type { CollaboratorFormValues } from './types'

export type FormErrors = Partial<Record<keyof CollaboratorFormValues, string>>

export function validateCollaboratorForm(values: CollaboratorFormValues): FormErrors {
  const errors: FormErrors = {}

  if (values.fullName.trim().length === 0) {
    errors.fullName = 'Nome completo é obrigatório.'
  }
  if (values.jobTitle.trim().length === 0) {
    errors.jobTitle = 'Cargo é obrigatório.'
  }
  if (values.department.trim().length === 0) {
    errors.department = 'Setor é obrigatório.'
  }
  if (values.admissionDate.trim().length === 0) {
    errors.admissionDate = 'Data de admissão é obrigatória.'
  }

  const salary = parseSalaryMask(values.salaryMask)
  if (salary === null) {
    errors.salaryMask = 'Salário é obrigatório.'
  } else if (salary <= 0) {
    errors.salaryMask = 'Salário deve ser positivo.'
  }

  return errors
}
