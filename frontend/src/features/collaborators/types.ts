export type Collaborator = {
  id: string
  fullName: string
  jobTitle: string
  department: string
  admissionDate: string
  salary: number
  createdAt?: string
}

export type CollaboratorSummary = Omit<Collaborator, 'createdAt'>

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type CollaboratorFormValues = {
  fullName: string
  jobTitle: string
  department: string
  admissionDate: string
  salaryMask: string
}
