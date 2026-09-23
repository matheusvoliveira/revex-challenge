import type { ReactNode } from 'react'
import styles from './ui.module.css'

type Props = {
  children: ReactNode
}

export function Card({ children }: Props) {
  return <div className={styles.card}>{children}</div>
}
