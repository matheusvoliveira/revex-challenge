import { LayoutDashboard, ListTodo, LogOut, Users } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { getStoredUsername } from '../features/auth/session'
import { clearToken } from '../features/auth/token'
import { BrandMark } from '../shared/brand/BrandMark'
import { Button } from '../shared/ui/Button'
import styles from './AppChrome.module.css'

const NAV = [
  { to: '/', label: 'Visão', icon: LayoutDashboard, end: true },
  { to: '/collaborators', label: 'Pessoas', icon: Users, end: false },
  { to: '/activities', label: 'Atividades', icon: ListTodo, end: false },
] as const

export function AppChrome() {
  const navigate = useNavigate()
  const username = getStoredUsername() ?? 'usuário'

  function handleLogout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <BrandMark to="/" />
        <nav className={styles.nav}>
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
        <p className={styles.foot}>Revex</p>
      </aside>
      <div className={styles.content}>
        <header className={styles.topbar}>
          <span className={styles.user}>{username}</span>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut size={16} strokeWidth={1.8} />
            Sair
          </Button>
        </header>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
