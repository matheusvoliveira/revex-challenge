import type { ReactNode } from 'react'
import styles from './ui.module.css'

type Props = {
  tone?: 'error' | 'info'
  children: ReactNode
}

export function Banner({ tone = 'error', children }: Props) {
  const toneClass = tone === 'info' ? styles.bannerInfo : styles.bannerError
  return <div className={`${styles.banner} ${toneClass}`}>{children}</div>
}
