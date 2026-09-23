import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { formatSalaryNumber } from '../../shared/format/currency'
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
      <div className={styles.headerRow}>
        <h1>Colaboradores</h1>
        <Link className={styles.primaryLink} to="/collaborators/new">
          Novo colaborador
        </Link>
      </div>

      <form className={styles.filter} onSubmit={handleFilter}>
        <label>
          Filtrar por setor
          <input
            value={department}
            placeholder="Ex.: TI"
            onChange={(event) => setDepartment(event.target.value)}
          />
        </label>
        <button type="submit">Filtrar</button>
        {appliedDepartment ? (
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setDepartment('')
              setAppliedDepartment('')
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
              <tr key={item.id} onClick={() => navigate(`/collaborators/${item.id}`)}>
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
