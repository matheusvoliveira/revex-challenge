import { Link } from 'react-router-dom'
import styles from './brand.module.css'

type Props = {
  to?: string
  compact?: boolean
}

export function BrandMark({ to, compact = false }: Props) {
  const mark = (
    <span className={`${styles.mark} ${compact ? styles.compact : ''}`}>
      REVEX
    </span>
  )

  if (!to) {
    return mark
  }

  return (
    <Link className={styles.link} to={to}>
      {mark}
    </Link>
  )
}
