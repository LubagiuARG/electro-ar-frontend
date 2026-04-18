import { useState, useEffect } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useAuth }             from '../context/AuthContext'
import styles                  from './Panel.module.css'

const API = import.meta.env.VITE_API_URL

export default function Panel() {
  const { profesional, logout, getToken } = useAuth()
  const navigate                          = useNavigate()
  const [stats, setStats]                 = useState(null)
  const [editando, setEditando]           = useState(false)
  const [form, setForm]                   = useState({})
  const [guardando, setGuardando]         = useState(false)
  const [mensaje, setMensaje]             = useState('')

  useEffect(() => {
    fetch(`${API}/api/panel/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then(r => r.json())
      .then(setStats)
  }, [])

  useEffect(() => {
    if (profesional) {
      setForm({
        nombre:         profesional.nombre,
        apellido:       profesional.apellido,
        telefono:       profesional.telefono,
        matricula:      profesional.matricula || '',
        provincia:      profesional.provincia,
        zona:           profesional.zona,
        descripcion:    profesional.descripcion || '',
      })
    }
  }, [profesional])

  const guardarPerfil = async () => {
    setGuardando(true)
    try {
      const res = await fetch(`${API}/api/panel/perfil`, {
        method:  'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization:  `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setMensaje('Perfil actualizado correctamente')
        setEditando(false)
        setTimeout(() => setMensaje(''), 3000)
      }
    } finally {
      setGuardando(false)
    }
  }

  const toggleVacaciones = async () => {
    const res = await fetch(`${API}/api/panel/vacaciones`, {
      method:  'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ vacaciones: !stats?.vacaciones }),
    })
    if (res.ok) {
      setStats(s => ({ ...s, vacaciones: !s.vacaciones }))
    }
  }

  const darDeBaja = async () => {
    if (!confirm('¿Estás seguro que querés darte de baja? Tu perfil será desactivado.')) return
    await fetch(`${API}/api/panel/cuenta`, {
      method:  'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    logout()
    navigate('/')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!profesional) return null

  return (
    <div className={styles.page}>

      {/* Header del panel */}
      <div className={styles.panelHeader}>
        <div>
          <h1 className={styles.title}>
            Hola, <span className={styles.nombre}>{profesional.nombre}</span> ⚡
          </h1>
          <p className={styles.subtitle}>Panel de profesional</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {mensaje && <div className={styles.successMsg}>{mensaje}</div>}

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{stats?.visitas || 0}</div>
          <div className={styles.statLabel}>Visitas al perfil</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{stats?.reviews || 0}</div>
          <div className={styles.statLabel}>Reseñas</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNum}>{(stats?.rating || 0).toFixed(1)}</div>
          <div className={styles.statLabel}>Puntuación</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statNum} ${styles[stats?.plan]}`}>
            {stats?.plan?.toUpperCase() || 'FREE'}
          </div>
          <div className={styles.statLabel}>Plan actual</div>
        </div>
      </div>

      {/* Modo vacaciones */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Modo vacaciones</h2>
            <p className={styles.sectionDesc}>
              {stats?.vacaciones
                ? 'Tu perfil está oculto — los clientes no te ven en el directorio'
                : 'Tu perfil está visible en el directorio'}
            </p>
          </div>
          <button
            className={`btn ${stats?.vacaciones ? 'btn-primary' : 'btn-outline'}`}
            onClick={toggleVacaciones}
          >
            {stats?.vacaciones ? '✈️ De vacaciones' : '💼 Disponible'}
          </button>
        </div>
      </div>

      {/* Editar perfil */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Mi perfil</h2>
          <button
            className="btn btn-outline"
            onClick={() => setEditando(!editando)}
          >
            {editando ? 'Cancelar' : 'Editar'}
          </button>
        </div>

        {editando ? (
          <div className={styles.editForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className="input-label">Nombre</label>
                <input className="input" value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div className={styles.formGroup}>
                <label className="input-label">Apellido</label>
                <input className="input" value={form.apellido}
                  onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className="input-label">Teléfono</label>
                <input className="input" value={form.telefono}
                  onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
              </div>
              <div className={styles.formGroup}>
                <label className="input-label">Matrícula</label>
                <input className="input" value={form.matricula}
                  onChange={e => setForm(f => ({ ...f, matricula: e.target.value }))} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className="input-label">Zona de cobertura</label>
              <input className="input" value={form.zona}
                onChange={e => setForm(f => ({ ...f, zona: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className="input-label">Descripción</label>
              <textarea className="input" rows={3} value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>
            <button
              className="btn btn-primary"
              onClick={guardarPerfil}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        ) : (
          <div className={styles.perfilInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <span>{profesional.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Teléfono</span>
              <span>{profesional.telefono}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Zona</span>
              <span>{profesional.zona}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Provincia</span>
              <span>{profesional.provincia}</span>
            </div>
            {profesional.matricula && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Matrícula</span>
                <span>N° {profesional.matricula}</span>
              </div>
            )}
            {profesional.descripcion && (
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Descripción</span>
                <span>{profesional.descripcion}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plan actual */}
      {profesional.plan === 'free' && (
        <div className={styles.upgradeBanner}>
          <div>
            <strong>Mejorá a Plan PRO</strong>
            <span> — Aparecé primero en las búsquedas y recibí más consultas</span>
          </div>
          <a href="/registro" className="btn btn-primary">Activar PRO →</a>
        </div>
      )}

      {/* Zona de peligro */}
      <div className={styles.dangerZone}>
        <h2 className={styles.dangerTitle}>Zona de peligro</h2>
        <p className={styles.dangerDesc}>
          Al darte de baja tu perfil será desactivado y dejarás de aparecer en el directorio.
        </p>
        <button className={`btn ${styles.dangerBtn}`} onClick={darDeBaja}>
          Darme de baja
        </button>
      </div>

    </div>
  )
}