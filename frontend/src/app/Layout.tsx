import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '../features/auth/token'
import styles from './Layout.module.css'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  const navigate = useNavigate()
  const signedIn = Boolean(getToken())

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Revex Challenge
        </Link>
        <nav>
          {signedIn ? (
            <>
              <Link to="/">Colaboradores</Link>
              <Link to="/activities">Atividades</Link>
              <button type="button" className={styles.logout} onClick={handleLogout}>
                Sair
              </button>
            </>
          ) : null}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
