import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { listCollaborators } from '../collaborators/api'
import type { CollaboratorSummary } from '../collaborators/types'
import { completeActivity, listActivities, startActivity, updateActivity } from './api'
import { ACTIVITY_STATUSES, canComplete, canStart, statusLabel } from './status'
import type { Activity, ActivityStatus } from './types'
import { validateActivityDescription } from './validate'
import styles from './activities.module.css'

export function ActivityListPage() {
  const [collaboratorId, setCollaboratorId] = useState('')
  const [status, setStatus] = useState<ActivityStatus | ''>('')
  const [appliedCollaboratorId, setAppliedCollaboratorId] = useState('')
  const [appliedStatus, setAppliedStatus] = useState<ActivityStatus | ''>('')
  const [reloadKey, setReloadKey] = useState(0)
  const [items, setItems] = useState<Activity[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [collaborators, setCollaborators] = useState<CollaboratorSummary[]>([])
  const requestKey = `${appliedCollaboratorId}\0${appliedStatus}\0${reloadKey}`
  const [activeKey, setActiveKey] = useState(requestKey)

  if (activeKey !== requestKey) {
    setActiveKey(requestKey)
    setItems(null)
    setError(null)
    setActionError(null)
    setEditingId(null)
    setEditError(null)
  }

  useEffect(() => {
    let cancelled = false
    void listCollaborators()
      .then((page) => {
        if (!cancelled) {
          setCollaborators(page.content)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCollaborators([])
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    void listActivities({
      collaboratorId: appliedCollaboratorId,
      status: appliedStatus,
    })
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
  }, [appliedCollaboratorId, appliedStatus, reloadKey])

  function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedCollaboratorId(collaboratorId)
    setAppliedStatus(status)
  }

  async function runAction(id: string, action: 'start' | 'complete') {
    setBusyId(id)
    setActionError(null)
    try {
      const updated = action === 'start' ? await startActivity(id) : await completeActivity(id)
      setItems((current) =>
        current?.map((item) => (item.id === updated.id ? updated : item)) ?? current
      )
    } catch (cause) {
      const message = cause instanceof ApiError
        ? cause.message
        : 'Não foi possível atualizar a atividade.'
      setActionError(message)
    } finally {
      setBusyId(null)
    }
  }

  function beginEdit(item: Activity) {
    setEditingId(item.id)
    setDraft(item.description)
    setEditError(null)
    setActionError(null)
  }

  async function saveEdit(id: string) {
    const descriptionError = validateActivityDescription(draft)
    if (descriptionError) {
      setEditError(descriptionError)
      return
    }
    setBusyId(id)
    setActionError(null)
    try {
      const updated = await updateActivity(id, draft.trim())
      setItems((current) =>
        current?.map((item) => (item.id === updated.id ? updated : item)) ?? current
      )
      setEditingId(null)
      setEditError(null)
    } catch (cause) {
      const message = cause instanceof ApiError
        ? cause.message
        : 'Não foi possível salvar a descrição.'
      setActionError(message)
    } finally {
      setBusyId(null)
    }
  }

  const loading = items === null && error === null
  const hasFilter = Boolean(appliedCollaboratorId || appliedStatus)

  return (
    <section>
      <div className={styles.headerRow}>
        <h1>Atividades</h1>
        <Link className={styles.primaryLink} to="/activities/new">
          Nova atividade
        </Link>
      </div>

      <form className={styles.filter} onSubmit={handleFilter}>
        <label>
          Colaborador
          <select value={collaboratorId} onChange={(event) => setCollaboratorId(event.target.value)}>
            <option value="">Todos</option>
            {collaborators.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.fullName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as ActivityStatus | '')}
          >
            <option value="">Todos</option>
            {ACTIVITY_STATUSES.map((item) => (
              <option key={item} value={item}>
                {statusLabel(item)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Filtrar</button>
        {hasFilter ? (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setCollaboratorId('')
              setStatus('')
              setAppliedCollaboratorId('')
              setAppliedStatus('')
            }}
          >
            Limpar
          </button>
        ) : null}
      </form>

      {loading ? <p className={styles.status}>Carregando...</p> : null}
      {error ? (
        <p className={styles.bannerError}>
          {error}{' '}
          <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
            Tentar novamente
          </button>
        </p>
      ) : null}
      {actionError ? <p className={styles.bannerError}>{actionError}</p> : null}
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {editingId === item.id ? (
                    <div className={styles.editBox}>
                      <textarea
                        value={draft}
                        maxLength={2000}
                        rows={3}
                        onChange={(event) => setDraft(event.target.value)}
                      />
                      {editError ? <span className={styles.fieldError}>{editError}</span> : null}
                    </div>
                  ) : (
                    item.description
                  )}
                </td>
                <td>{item.collaborator.fullName}</td>
                <td>
                  <span className={`${styles.badge} ${styles[item.status]}`}>
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td className={styles.actions}>
                  {editingId === item.id ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => void saveEdit(item.id)}
                      >
                        {busyId === item.id ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button
                        type="button"
                        className={styles.secondary}
                        disabled={busyId === item.id}
                        onClick={() => {
                          setEditingId(null)
                          setEditError(null)
                        }}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={styles.secondary}
                        disabled={busyId === item.id}
                        onClick={() => beginEdit(item)}
                      >
                        Editar
                      </button>
                      {canStart(item.status) ? (
                        <button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => void runAction(item.id, 'start')}
                        >
                          {busyId === item.id ? 'Atualizando...' : 'Iniciar'}
                        </button>
                      ) : null}
                      {canComplete(item.status) ? (
                        <button
                          type="button"
                          className={styles.secondary}
                          disabled={busyId === item.id}
                          onClick={() => void runAction(item.id, 'complete')}
                        >
                          {busyId === item.id ? 'Atualizando...' : 'Concluir'}
                        </button>
                      ) : null}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  )
}
