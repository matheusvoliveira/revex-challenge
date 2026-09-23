import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { listActivities } from './api'
import type { Activity } from './types'
import styles from './activities.module.css'

export function ActivityListPage() {
  const [reloadKey, setReloadKey] = useState(0)
  const [items, setItems] = useState<Activity[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState(reloadKey)

  if (activeKey !== reloadKey) {
    setActiveKey(reloadKey)
    setItems(null)
    setError(null)
  }

  useEffect(() => {
    let cancelled = false
    void listActivities()
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
          : 'Não foi possível carregar as atividades.'
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
        <h1>Atividades</h1>
        <Link className={styles.primaryLink} to="/activities/new">
          Nova atividade
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
        <p className={styles.status}>Nenhuma atividade cadastrada.</p>
      ) : null}

      {!loading && !error && items && items.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Colaborador</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.description}</td>
                <td>{item.collaborator.fullName}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  )
}
