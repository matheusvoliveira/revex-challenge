import type { ReactNode } from 'react'
import styles from './ui.module.css'

type Props = {
  children: ReactNode
  clickable?: boolean
}

export function Table({ children, clickable = false }: Props) {
  return (
    <div className={styles.tableWrap}>
      <table className={`${styles.table} ${clickable ? styles.clickable : ''}`}>{children}</table>
    </div>
  )
}
