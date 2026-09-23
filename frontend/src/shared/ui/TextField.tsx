import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import styles from './ui.module.css'

type Base = {
  label: string
  error?: string
}

type InputFieldProps = Base &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false
  }

type AreaFieldProps = Base &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true
  }

export function TextField(props: InputFieldProps | AreaFieldProps) {
  const { label, error, multiline, ...rest } = props

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      {multiline ? (
        <textarea className={`${styles.control} ${styles.area}`} {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input className={styles.control} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {error ? <span className={styles.fieldError}>{error}</span> : null}
    </label>
  )
}
