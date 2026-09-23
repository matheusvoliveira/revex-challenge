import { useEffect, useState, type FormEvent } from 'react'
import { ApiError } from '../../shared/api/client'
import { Banner } from '../../shared/ui/Banner'
import { Badge } from '../../shared/ui/Badge'
import { statusTone } from '../../shared/ui/statusTone'
import { Button } from '../../shared/ui/Button'
import { EmptyState } from '../../shared/ui/EmptyState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { SelectField } from '../../shared/ui/SelectField'
import { StatusText } from '../../shared/ui/StatusText'
import { Table } from '../../shared/ui/Table'
import { TextField } from '../../shared/ui/TextField'
import { listCollaborators } from '../collaborators/api'
import type { CollaboratorSummary } from '../collaborators/types'
import { completeActivity, listActivities, startActivity, updateActivity } from './api'
import { ACTIVITY_STATUSES, canComplete, canStart, statusLabel } from './status'
import type { Activity, ActivityStatus } from './types'
import { validateActivityDescription, validateActivityTitle } from './validate'
import styles from './activities.module.css'
import ui from '../../shared/ui/ui.module.css'

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
  const [draftTitle, setDraftTitle] = useState('')
  const [draft, setDraft] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [titleError, setTitleError] = useState<string | null>(null)
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
    setTitleError(null)
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
    setDraftTitle(item.title)
    setDraft(item.description)
    setEditError(null)
    setTitleError(null)
    setActionError(null)
  }

  async function saveEdit(id: string) {
    const nextTitleError = validateActivityTitle(draftTitle)
    const descriptionError = validateActivityDescription(draft)
    setTitleError(nextTitleError)
    setEditError(descriptionError)
    if (nextTitleError || descriptionError) {
      return
    }
    setBusyId(id)
    setActionError(null)
    try {
      const updated = await updateActivity(id, {
        title: draftTitle.trim(),
        description: draft.trim(),
      })
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
      <PageHeader
        eyebrow="Operação"
        title="Atividades"
        description="Acompanhe o ciclo pendente, em andamento e concluída."
        action={<Button to="/activities/new">Nova atividade</Button>}
      />

      <form className={styles.filter} onSubmit={handleFilter}>
        <SelectField
          label="Colaborador"
          value={collaboratorId}
          onChange={(event) => setCollaboratorId(event.target.value)}
        >
          <option value="">Todos</option>
          {collaborators.map((collaborator) => (
            <option key={collaborator.id} value={collaborator.id}>
              {collaborator.fullName}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value as ActivityStatus | '')}
        >
          <option value="">Todos</option>
          {ACTIVITY_STATUSES.map((item) => (
            <option key={item} value={item}>
              {statusLabel(item)}
            </option>
          ))}
        </SelectField>
        <Button type="submit">Filtrar</Button>
        {hasFilter ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setCollaboratorId('')
              setStatus('')
              setAppliedCollaboratorId('')
              setAppliedStatus('')
            }}
          >
            Limpar
          </Button>
        ) : null}
      </form>

      {loading ? <StatusText>Carregando...</StatusText> : null}
      {error ? (
        <Banner>
          {error}{' '}
          <Button type="button" variant="secondary" onClick={() => setReloadKey((key) => key + 1)}>
            Tentar novamente
          </Button>
        </Banner>
      ) : null}
      {actionError ? <Banner>{actionError}</Banner> : null}
      {!loading && !error && items?.length === 0 ? (
        <EmptyState
          title="Nenhuma atividade cadastrada."
          description="Crie uma atividade para um colaborador existente."
          action={<Button to="/activities/new" variant="secondary">Nova atividade</Button>}
        />
      ) : null}

      {!loading && !error && items && items.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <th>Título</th>
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
                    <TextField
                      label="Título"
                      value={draftTitle}
                      maxLength={100}
                      onChange={(event) => setDraftTitle(event.target.value)}
                      error={titleError ?? undefined}
                    />
                  ) : (
                    item.title
                  )}
                </td>
                <td>
                  {editingId === item.id ? (
                    <TextField
                      label="Descrição"
                      multiline
                      value={draft}
                      maxLength={1000}
                      rows={3}
                      onChange={(event) => setDraft(event.target.value)}
                      error={editError ?? undefined}
                    />
                  ) : (
                    item.description
                  )}
                </td>
                <td>{item.collaborator.fullName}</td>
                <td>
                  <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                </td>
                <td>
                  <div className={ui.actions}>
                    {editingId === item.id ? (
                      <>
                        <Button
                          type="button"
                          disabled={busyId === item.id}
                          onClick={() => void saveEdit(item.id)}
                        >
                          {busyId === item.id ? 'Salvando...' : 'Salvar'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={busyId === item.id}
                          onClick={() => {
                            setEditingId(null)
                            setEditError(null)
                            setTitleError(null)
                          }}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={busyId === item.id}
                          onClick={() => beginEdit(item)}
                        >
                          Editar
                        </Button>
                        {canStart(item.status) ? (
                          <Button
                            type="button"
                            disabled={busyId === item.id}
                            onClick={() => void runAction(item.id, 'start')}
                          >
                            {busyId === item.id ? 'Atualizando...' : 'Iniciar'}
                          </Button>
                        ) : null}
                        {canComplete(item.status) ? (
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={busyId === item.id}
                            onClick={() => void runAction(item.id, 'complete')}
                          >
                            {busyId === item.id ? 'Atualizando...' : 'Concluir'}
                          </Button>
                        ) : null}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </section>
  )
}
