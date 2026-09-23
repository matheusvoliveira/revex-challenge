import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { formatSalaryNumber } from '../../shared/format/currency'
import { Badge } from '../../shared/ui/Badge'
import { statusTone } from '../../shared/ui/statusTone'
import { Banner } from '../../shared/ui/Banner'
import { Button } from '../../shared/ui/Button'
import { EmptyState } from '../../shared/ui/EmptyState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { StatusText } from '../../shared/ui/StatusText'
import { Table } from '../../shared/ui/Table'
import { listActivities } from '../activities/api'
import { statusLabel } from '../activities/status'
import type { Activity } from '../activities/types'
import { getCollaborator } from './api'
import { CollaboratorForm } from './CollaboratorForm'
import type { Collaborator } from './types'
import styles from './collaborators.module.css'

export function CollaboratorDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null)
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [error, setError] = useState<string | null>(id ? null : 'Colaborador não encontrado.')
  const [savedNotice, setSavedNotice] = useState<string | null>(null)
  const [requestedId, setRequestedId] = useState(id)

  if (id !== requestedId) {
    setRequestedId(id)
    setCollaborator(null)
    setActivities(null)
    setSavedNotice(null)
    setError(id ? null : 'Colaborador não encontrado.')
  }

  useEffect(() => {
    if (!id) {
      return
    }
    let cancelled = false
    void Promise.all([getCollaborator(id), listActivities({ collaboratorId: id })])
      .then(([person, page]) => {
        if (!cancelled) {
          setCollaborator(person)
          setActivities(page.content)
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
      <PageHeader
        eyebrow="Pessoas"
        title={collaborator?.fullName ?? 'Detalhe do colaborador'}
        description="Edite os dados da pessoa e veja as atividades associadas."
        action={<Button to="/collaborators" variant="ghost">Voltar à lista</Button>}
      />
      {loading ? <StatusText>Carregando...</StatusText> : null}
      {error ? <Banner>{error}</Banner> : null}
      {savedNotice ? <Banner tone="info">{savedNotice}</Banner> : null}
      {collaborator ? (
        <CollaboratorForm
          collaboratorId={collaborator.id}
          submitLabel="Salvar alterações"
          initialValues={{
            fullName: collaborator.fullName,
            jobTitle: collaborator.jobTitle,
            department: collaborator.department,
            admissionDate: collaborator.admissionDate,
            salaryMask: formatSalaryNumber(collaborator.salary),
          }}
          onSaved={(savedId) => {
            setSavedNotice('Dados atualizados.')
            void getCollaborator(savedId).then(setCollaborator)
          }}
        />
      ) : null}

      {collaborator ? (
        <div className={styles.activityBlock}>
          <h2 className={styles.sectionTitle}>Atividades</h2>
          {activities === null ? <StatusText>Carregando atividades...</StatusText> : null}
          {activities && activities.length === 0 ? (
            <EmptyState
              title="Nenhuma atividade desta pessoa."
              action={<Button to="/activities/new" variant="secondary">Nova atividade</Button>}
            />
          ) : null}
          {activities && activities.length > 0 ? (
            <Table clickable>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item) => (
                  <tr key={item.id} onClick={() => navigate('/activities')}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>
                      <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
