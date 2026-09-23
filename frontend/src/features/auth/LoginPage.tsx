import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/client'
import { login } from './api'
import { setToken } from './token'
import styles from './login.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (username.trim().length === 0 || password.length === 0) {
      setError('Usuário e senha são obrigatórios.')
      return
    }

    setSubmitting(true)
    try {
      const response = await login({ username: username.trim(), password })
      setToken(response.token)
      navigate('/', { replace: true })
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setError('Credenciais inválidas.')
      } else if (cause instanceof ApiError) {
        setError(cause.message)
      } else {
        setError('Não foi possível entrar. Tente novamente.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h1>Entrar</h1>
      <p className={styles.hint}>Usuário de demonstração: revex / revex</p>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          Usuário
          <input value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className={styles.field}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <p className={styles.bannerError}>{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
