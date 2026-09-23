import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { Badge } from '../../shared/ui/Badge'
import { statusTone } from '../../shared/ui/statusTone'
import { Banner } from '../../shared/ui/Banner'
import { Button } from '../../shared/ui/Button'
import { Card } from '../../shared/ui/Card'
import { EmptyState } from '../../shared/ui/EmptyState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { StatusText } from '../../shared/ui/StatusText'
import { Table } from '../../shared/ui/Table'
import { listActivities } from '../activities/api'
import { statusLabel } from '../activities/status'
import type { Activity } from '../activities/types'
import { listCollaborators } from '../collaborators/api'
import styles from './dashboard.module.css'

type DashboardData = {
  people: number
  activities: number
  pending: number
  inProgress: number
  done: number
  recent: Activity[]
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeKey, setActiveKey] = useState(reloadKey)

  if (activeKey !== reloadKey) {
    setActiveKey(reloadKey)
    setData(null)
    setError(null)
  }

  useEffect(() => {
    let cancelled = false
    void Promise.all([
      listCollaborators(),
      listActivities(),
      listActivities({ status: 'PENDENTE' }),
      listActivities({ status: 'EM_ANDAMENTO' }),
      listActivities({ status: 'CONCLUIDA' }),
    ])
      .then(([people, activities, pending, inProgress, done]) => {
        if (!cancelled) {
          setData({
            people: people.totalElements,
            activities: activities.totalElements,
            pending: pending.totalElements,
            inProgress: inProgress.totalElements,
            done: done.totalElements,
            recent: activities.content.slice(0, 8),
          })
        }
      })
      .catch((cause: unknown) => {
        if (cancelled) {
          return
        }
        setError(
          cause instanceof ApiError
            ? cause.message
            : 'Não foi possível carregar a visão geral.'
        )
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const loading = data === null && error === null

  return (
    <section>
      <PageHeader
        eyebrow="Visão geral"
        title="Dashboard"
        description="Totais e atividades recentes já disponíveis no sistema."
      />

      {loading ? <StatusText>Carregando...</StatusText> : null}
      {error ? (
        <Banner>
          {error}{' '}
          <Button type="button" variant="secondary" onClick={() => setReloadKey((key) => key + 1)}>
            Tentar novamente
          </Button>
        </Banner>
      ) : null}

      {data ? (
        <>
          <div className={styles.metrics}>
            <Card>
              <p className={styles.metricLabel}>Pessoas</p>
              <p className={styles.metricValue}>{data.people}</p>
            </Card>
            <Card>
              <p className={styles.metricLabel}>Atividades</p>
              <p className={styles.metricValue}>{data.activities}</p>
            </Card>
            <Card>
              <p className={styles.metricLabel}>Pendentes</p>
              <p className={styles.metricValue}>{data.pending}</p>
            </Card>
            <Card>
              <p className={styles.metricLabel}>Em andamento</p>
              <p className={styles.metricValue}>{data.inProgress}</p>
            </Card>
            <Card>
              <p className={styles.metricLabel}>Concluídas</p>
              <p className={styles.metricValue}>{data.done}</p>
            </Card>
          </div>

          <h2 className={styles.sectionTitle}>Atividades recentes</h2>
          {data.recent.length === 0 ? (
            <EmptyState
              title="Nenhuma atividade recente."
              description="As atividades criadas aparecem aqui, na ordem já retornada pela API."
              action={<Button to="/activities/new" variant="secondary">Nova atividade</Button>}
            />
          ) : (
            <Table clickable>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Colaborador</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((item) => (
                  <tr key={item.id} onClick={() => navigate('/activities')}>
                    <td>{item.title}</td>
                    <td>{item.description}</td>
                    <td>{item.collaborator.fullName}</td>
                    <td>
                      <Badge tone={statusTone(item.status)}>{statusLabel(item.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      ) : null}
    </section>
  )
}
