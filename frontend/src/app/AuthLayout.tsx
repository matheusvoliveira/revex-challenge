import type { ReactNode } from 'react'
import { BrandMark } from '../shared/brand/BrandMark'
import styles from './AuthLayout.module.css'

type Props = {
  children: ReactNode
}

export function AuthLayout({ children }: Props) {
  return (
    <div className={styles.shell}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <BrandMark />
        </div>
        <div className={styles.card}>{children}</div>
        <p className={styles.foot}>Revex</p>
      </div>
    </div>
  )
}
