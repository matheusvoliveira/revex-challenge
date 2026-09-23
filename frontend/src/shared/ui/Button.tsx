import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './ui.module.css'

type Variant = 'primary' | 'secondary' | 'ghost'

type Common = {
  variant?: Variant
  children: ReactNode
}

type ButtonAsButton = Common &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    to?: undefined
  }

type ButtonAsLink = Common & {
  to: string
}

export function Button({ variant = 'primary', children, ...rest }: ButtonAsButton | ButtonAsLink) {
  const className = `${styles.button} ${styles[variant]}`

  if ('to' in rest && rest.to) {
    return (
      <Link className={className} to={rest.to}>
        {children}
      </Link>
    )
  }

  const buttonRest = rest as Omit<ButtonAsButton, 'variant' | 'children'>
  return (
    <button type={buttonRest.type ?? 'button'} className={className} {...buttonRest}>
      {children}
    </button>
  )
}
