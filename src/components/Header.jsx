import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styles from './Header.module.css'

const BoltIcon = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 1L2 13h7l-2 8 9-13h-7l2-7z" fill="#0a0c0f" strokeLinejoin="round"/>
  </svg>
)

const navLinks = [
  { to: '/', end: true,  label: '⚡ Presupuesto IA' },
  { to: '/electricistas', label: '👷 Electricistas' },
  { to: '/registro',      label: '📋 Registrarse' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location])

  return (
    <>
      <header className={styles.header}>
        <NavLink to="/" className={styles.logo}>
          <div className={styles.logoIcon}><BoltIcon /></div>
          <div>
            <div className={styles.logoText}>
              Don<span className={styles.logoTextWhite}>Voltio</span>
            </div>
            <div className={styles.logoSub}>Presupuestos · Profesionales</div>
          </div>
        </NavLink>

        <nav className={styles.nav}>
          {navLinks.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `${styles.navBtn} ${isActive ? styles.active : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          className={`${styles.menuBtn} ${open ? styles.menuBtnOpen : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {open && (
        <>
          <div className={styles.mobileOverlay} onClick={() => setOpen(false)} />
          <nav className={styles.mobileMenu}>
            {navLinks.map(({ to, end, label }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `${styles.mobileNavBtn} ${isActive ? styles.active : ''}`
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </>
      )}
    </>
  )
}
