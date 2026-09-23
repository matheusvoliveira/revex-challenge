import type { ReactNode } from 'react'
import styles from './ui.module.css'

type Tone = 'pending' | 'progress' | 'done' | 'neutral'

type Props = {
  tone?: Tone
  children: ReactNode
}

export function Badge({ tone = 'neutral', children }: Props) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
