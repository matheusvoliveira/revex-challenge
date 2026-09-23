import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { formatSalaryNumber } from '../../shared/format/currency'
import { listCollaborators } from './api'
import type { CollaboratorSummary } from './types'
import styles from './collaborators.module.css'

export function CollaboratorListPage() {
  const [reloadKey, setReloadKey] = useState(0)
  const [items, setItems] = useState<CollaboratorSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState(reloadKey)

  if (activeKey !== reloadKey) {
    setActiveKey(reloadKey)
    setItems(null)
    setError(null)
  }

  useEffect(() => {
    let cancelled = false
    void listCollaborators()
      .then((page) => {
        if (!cancelled) {
          setItems(page.content)
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return
        }
        const message = cause instanceof ApiError
          ? cause.message
          : 'Não foi possível carregar os colaboradores.'
        setError(message)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const loading = items === null && error === null

  return (
    <section>
      <div className={styles.headerRow}>
        <h1>Colaboradores</h1>
        <Link className={styles.primaryLink} to="/collaborators/new">
          Novo colaborador
        </Link>
      </div>

      {loading ? <p className={styles.status}>Carregando...</p> : null}
      {error ? (
        <p className={styles.bannerError}>
          {error}{' '}
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Tentar novamente
          </button>
        </p>
      ) : null}
      {!loading && !error && items?.length === 0 ? (
        <p className={styles.status}>Nenhum colaborador cadastrado.</p>
      ) : null}

      {!loading && !error && items && items.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cargo</th>
              <th>Setor</th>
              <th>Salário</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.fullName}</td>
                <td>{item.jobTitle}</td>
                <td>{item.department}</td>
                <td>{formatSalaryNumber(item.salary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  )
}
