import type { ReactNode } from 'react'
import styles from './ui.module.css'

type Props = {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, action }: Props) {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.pageCopy}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1 className={styles.pageTitle}>{title}</h1>
        {description ? <p className={styles.pageDescription}>{description}</p> : null}
      </div>
      {action}
    </header>
  )
}
