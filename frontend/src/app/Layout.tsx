import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Layout.module.css'

type Props = {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          Revex Challenge
        </Link>
        <nav>
          <Link to="/">Colaboradores</Link>
          <Link to="/activities">Atividades</Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
