import styles from './ui.module.css'

type Props = {
  children: string
}

export function StatusText({ children }: Props) {
  return <p className={styles.status}>{children}</p>
}
