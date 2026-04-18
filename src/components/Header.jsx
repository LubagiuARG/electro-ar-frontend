import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Header.module.css'

const BoltIcon = () => (
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <path d="M11 1L2 13h7l-2 8 9-13h-7l2-7z" fill="#0a0c0f" strokeLinejoin="round"/>
  </svg>
)

export default function Header() {
  const { profesional, logout } = useAuth()
  const navigate                = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}><BoltIcon /></div>
        <div>
          <div className={styles.logoText}>
            ELECTRO<span className={styles.logoTextWhite}>AR</span>
          </div>
          <div className={styles.logoSub}>Presupuestos · Profesionales</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" end className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.active : ''}`}>
          ⚡ Presupuesto IA
        </NavLink>
        <NavLink to="/electricistas" className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.active : ''}`}>
          👷 Electricistas
        </NavLink>

        {profesional ? (
          <>
            <NavLink to="/panel" className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.active : ''}`}>
              🏠 Mi panel
            </NavLink>
            <button className={styles.navBtn} onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/registro" className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.active : ''}`}>
              📋 Registrarse
            </NavLink>
            <NavLink to="/login" className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.active : ''}`}>
              🔐 Ingresar
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}