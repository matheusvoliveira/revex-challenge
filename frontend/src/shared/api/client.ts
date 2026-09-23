export type FieldError = {
  field: string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldError[]

  constructor(message: string, status: number, fieldErrors: FieldError[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

type ErrorBody = {
  message?: string
  fieldErrors?: FieldError[]
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response
  try {
    response = await fetch(path, { ...init, headers })
  } catch {
    throw new ApiError('Não foi possível conectar à API. Verifique se o backend está no ar.', 0)
  }

  if (!response.ok) {
    let body: ErrorBody = {}
    try {
      body = (await response.json()) as ErrorBody
    } catch {
      body = {}
    }
    throw new ApiError(
      body.message ?? 'Não foi possível concluir a operação. Tente novamente.',
      response.status,
      body.fieldErrors ?? []
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
