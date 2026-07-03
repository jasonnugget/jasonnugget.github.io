import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

const pageLinks = [
  { to: '/', label: 'home', end: true },
  { to: '/projects', label: 'projects' },
  { to: '/blog', label: 'blog' },
  { to: '/contact', label: 'contact' },
]

export default function Nav() {
  return (
    <header className={styles.header}>
      <nav className={styles.inner}>
        {pageLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
