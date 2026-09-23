type ActivityStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'

export function statusTone(status: ActivityStatus): 'pending' | 'progress' | 'done' {
  if (status === 'EM_ANDAMENTO') {
    return 'progress'
  }
  if (status === 'CONCLUIDA') {
    return 'done'
  }
  return 'pending'
}
