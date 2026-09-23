import { Link } from 'react-router-dom'
import styles from './brand.module.css'

type Props = {
  to?: string
  variant?: 'mark' | 'wordmark'
}

export function BrandMark({ to, variant = 'mark' }: Props) {
  const mark = variant === 'wordmark' ? (
    <img
      className={styles.wordmark}
      src="/brand/revex-wordmark-white.webp"
      alt="Revex"
    />
  ) : (
    <span className={styles.combo}>
      <img className={styles.icon} src="/brand/revex-mark.png" alt="" />
      <span className={styles.name}>Revex</span>
    </span>
  )

  if (!to) {
    return mark
  }

  return (
    <Link className={styles.link} to={to} aria-label="Revex">
      {mark}
    </Link>
  )
}
