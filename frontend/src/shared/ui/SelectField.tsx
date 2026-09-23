import type { SelectHTMLAttributes } from 'react'
import styles from './ui.module.css'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
}

export function SelectField({ label, error, children, ...rest }: Props) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <select className={styles.control} {...rest}>
        {children}
      </select>
      {error ? <span className={styles.fieldError}>{error}</span> : null}
    </label>
  )
}
