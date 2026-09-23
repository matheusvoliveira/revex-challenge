import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { formatSalaryNumber } from '../../shared/format/currency'
import { getCollaborator } from './api'
import type { Collaborator } from './types'
import styles from './collaborators.module.css'

export function CollaboratorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null)
  const [error, setError] = useState<string | null>(id ? null : 'Colaborador não encontrado.')
  const [requestedId, setRequestedId] = useState(id)

  if (id !== requestedId) {
    setRequestedId(id)
    setCollaborator(null)
    setError(id ? null : 'Colaborador não encontrado.')
  }

  useEffect(() => {
    if (!id) {
      return
    }
    let cancelled = false
    void getCollaborator(id)
      .then((data) => {
        if (!cancelled) {
          setCollaborator(data)
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return
        }
        if (cause instanceof ApiError && cause.status === 404) {
          setError('Colaborador não encontrado.')
        } else if (cause instanceof ApiError) {
          setError(cause.message)
        } else {
          setError('Não foi possível carregar o colaborador.')
        }
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const loading = Boolean(id) && collaborator === null && error === null

  return (
    <section>
      <p>
        <Link to="/">Voltar à lista</Link>
      </p>
      <h1>Detalhe do colaborador</h1>
      {loading ? <p className={styles.status}>Carregando...</p> : null}
      {error ? <p className={styles.bannerError}>{error}</p> : null}
      {collaborator ? (
        <dl className={styles.detail}>
          <dt>Nome completo</dt>
          <dd>{collaborator.fullName}</dd>
          <dt>Cargo</dt>
          <dd>{collaborator.jobTitle}</dd>
          <dt>Setor</dt>
          <dd>{collaborator.department}</dd>
          <dt>Data de admissão</dt>
          <dd>{collaborator.admissionDate}</dd>
          <dt>Salário</dt>
          <dd>{formatSalaryNumber(collaborator.salary)}</dd>
        </dl>
      ) : null}
    </section>
  )
}
