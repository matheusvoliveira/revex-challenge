export type ActivityStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'

export type ActivityCollaborator = {
  id: string
  fullName: string
}

export type Activity = {
  id: string
  description: string
  status: ActivityStatus
  collaborator: ActivityCollaborator
  createdAt?: string
}

export type ActivityFormValues = {
  description: string
  collaboratorId: string
}
