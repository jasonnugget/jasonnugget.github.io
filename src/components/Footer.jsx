import { NavLink } from 'react-router-dom'
import styles from './Footer.module.css'

const links = [
  { to: '/', label: 'home', end: true },
  { to: '/projects', label: 'projects' },
  { to: '/experience', label: 'experience' },
  { to: '/contact', label: 'contact' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.links}>
        {links.map(({ to, label, end }) => (
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
    </footer>
  )
}
