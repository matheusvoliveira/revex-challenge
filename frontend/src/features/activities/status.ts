import type { ActivityStatus } from './types'

export const ACTIVITY_STATUSES: ActivityStatus[] = ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA']

export function statusLabel(status: ActivityStatus): string {
  if (status === 'EM_ANDAMENTO') {
    return 'Em andamento'
  }
  if (status === 'CONCLUIDA') {
    return 'Concluída'
  }
  return 'Pendente'
}

export function canStart(status: ActivityStatus): boolean {
  return status === 'PENDENTE'
}

export function canComplete(status: ActivityStatus): boolean {
  return status !== 'CONCLUIDA'
}
