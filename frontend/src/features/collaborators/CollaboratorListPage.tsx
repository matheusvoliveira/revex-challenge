import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { formatSalaryNumber } from '../../shared/format/currency'
import { Banner } from '../../shared/ui/Banner'
import { Button } from '../../shared/ui/Button'
import { EmptyState } from '../../shared/ui/EmptyState'
import { PageHeader } from '../../shared/ui/PageHeader'
import { StatusText } from '../../shared/ui/StatusText'
import { Table } from '../../shared/ui/Table'
import { TextField } from '../../shared/ui/TextField'
import { listCollaborators } from './api'
import type { CollaboratorSummary } from './types'
import styles from './collaborators.module.css'

export function CollaboratorListPage() {
  const navigate = useNavigate()
  const [department, setDepartment] = useState('')
  const [appliedDepartment, setAppliedDepartment] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [items, setItems] = useState<CollaboratorSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const requestKey = `${appliedDepartment}\0${reloadKey}`
  const [activeKey, setActiveKey] = useState(requestKey)

  if (activeKey !== requestKey) {
    setActiveKey(requestKey)
    setItems(null)
    setError(null)
  }

  useEffect(() => {
    let cancelled = false
    void listCollaborators(appliedDepartment)
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
  }, [appliedDepartment, reloadKey])

  function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAppliedDepartment(department.trim())
  }

  const loading = items === null && error === null

  return (
    <section>
      <PageHeader
        eyebrow="Pessoas"
        title="Colaboradores"
        description="Cadastro e consulta da equipe operacional."
        action={<Button to="/collaborators/new">Novo colaborador</Button>}
      />

      <form className={styles.filter} onSubmit={handleFilter}>
        <TextField
          label="Filtrar por setor"
          value={department}
          placeholder="Ex.: TI"
          onChange={(event) => setDepartment(event.target.value)}
        />
        <Button type="submit">Filtrar</Button>
        {appliedDepartment ? (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDepartment('')
              setAppliedDepartment('')
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
      {!loading && !error && items?.length === 0 ? (
        <EmptyState
          title="Nenhum colaborador cadastrado."
          description="Cadastre a primeira pessoa para começar a operar."
          action={<Button to="/collaborators/new" variant="secondary">Novo colaborador</Button>}
        />
      ) : null}

      {!loading && !error && items && items.length > 0 ? (
        <Table clickable>
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
              <tr key={item.id} onClick={() => navigate(`/collaborators/${item.id}`)}>
                <td>{item.fullName}</td>
                <td>{item.jobTitle}</td>
                <td>{item.department}</td>
                <td>{formatSalaryNumber(item.salary)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
    </section>
  )
}
