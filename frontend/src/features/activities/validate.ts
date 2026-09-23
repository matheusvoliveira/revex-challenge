import type { ActivityFormValues } from './types'

export type ActivityFormErrors = Partial<Record<keyof ActivityFormValues, string>>

export function validateActivityForm(values: ActivityFormValues): ActivityFormErrors {
  const errors: ActivityFormErrors = {}

  if (values.description.trim().length === 0) {
    errors.description = 'Descrição é obrigatória.'
  } else if (values.description.trim().length > 2000) {
    errors.description = 'Descrição excede o limite técnico de 2000 caracteres.'
  }

  if (values.collaboratorId.trim().length === 0) {
    errors.collaboratorId = 'Colaborador é obrigatório.'
  }

  return errors
}

export function validateActivityDescription(description: string): string | null {
  return validateActivityForm({ description, collaboratorId: 'ok' }).description ?? null
}
