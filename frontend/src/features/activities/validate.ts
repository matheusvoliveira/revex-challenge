import type { ActivityFormValues } from './types'

export type ActivityFormErrors = Partial<Record<keyof ActivityFormValues, string>>

export function validateActivityForm(values: ActivityFormValues): ActivityFormErrors {
  const errors: ActivityFormErrors = {}

  if (values.title.trim().length === 0) {
    errors.title = 'Título é obrigatório.'
  } else if (values.title.trim().length > 100) {
    errors.title = 'Título excede o limite de 100 caracteres.'
  }

  if (values.description.trim().length === 0) {
    errors.description = 'Descrição é obrigatória.'
  } else if (values.description.trim().length > 1000) {
    errors.description = 'Descrição excede o limite de 1000 caracteres.'
  }

  if (values.collaboratorId.trim().length === 0) {
    errors.collaboratorId = 'Colaborador é obrigatório.'
  }

  return errors
}

export function validateActivityDescription(description: string): string | null {
  return validateActivityForm({ title: 'ok', description, collaboratorId: 'ok' }).description ?? null
}

export function validateActivityTitle(title: string): string | null {
  return validateActivityForm({ title, description: 'ok', collaboratorId: 'ok' }).title ?? null
}
