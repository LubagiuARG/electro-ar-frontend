import { useEffect, useState } from 'react'
import { useAdmin } from '../../context/AdminContext'
import { getAdmins, crearAdmin, actualizarAdmin } from '../../services/adminApi'
import AdminLayout from '../../components/admin/AdminLayout'
import styles from './AdminAdmins.module.css'

const EMPTY_FORM = { nombre: '', email: '', password: '', rol: 'admin' }

export default function AdminAdmins() {
  const { admin: me, getToken } = useAdmin()
  const [admins, setAdmins]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState(null)
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    getAdmins(getToken())
      .then(setAdmins)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await crearAdmin(getToken(), form)
      setForm(null)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (a) => {
    if (a.id === me?.id) return
    try {
      await actualizarAdmin(getToken(), a.id, { activo: !a.activo })
      setAdmins(list => list.map(x => x.id === a.id ? { ...x, activo: !x.activo } : x))
    } catch (err) { alert(err.message) }
  }

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Administradores</h1>
          <button className={styles.btnPrimary} onClick={() => setForm({ ...EMPTY_FORM })}>+ Nuevo admin</button>
        </div>

        {error   && <p className={styles.errorMsg}>{error}</p>}
        {loading && <p className={styles.info}>Cargando...</p>}

        {/* Form modal */}
        {form && (
          <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setForm(null)}>
            <div className={styles.modal}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>Nuevo administrador</h2>
                <button className={styles.closeBtn} onClick={() => setForm(null)}>✕</button>
              </div>
              <form className={styles.form} onSubmit={handleSave}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre</label>
                  <input className={styles.input} value={form.nombre} onChange={e => handleField('nombre', e.target.value)} required placeholder="Juan García" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Email</label>
                  <input className={styles.input} type="email" value={form.email} onChange={e => handleField('email', e.target.value)} required placeholder="juan@tuprofesional.com" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Contraseña</label>
                  <input className={styles.input} type="password" value={form.password} onChange={e => handleField('password', e.target.value)} required placeholder="Mínimo 8 caracteres" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Rol</label>
                  <select className={styles.input} value={form.rol} onChange={e => handleField('rol', e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div className={styles.formActions}>
                  <button type="button" className={styles.btnOutline} onClick={() => setForm(null)}>Cancelar</button>
                  <button type="submit" className={styles.btnPrimary} disabled={saving}>{saving ? 'Creando...' : 'Crear admin'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && admins.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id} className={a.id === me?.id ? styles.meRow : ''}>
                    <td className={styles.bold}>
                      {a.nombre}
                      {a.id === me?.id && <span className={styles.youBadge}>Vos</span>}
                    </td>
                    <td className={styles.muted}>{a.email}</td>
                    <td>
                      <span className={`${styles.badge} ${a.rol === 'superadmin' ? styles.badgeSuper : styles.badgeAdmin}`}>
                        {a.rol === 'superadmin' ? 'Superadmin' : 'Admin'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${a.activo ? styles.badgeActivo : styles.badgeInactivo}`}>
                        {a.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={a.activo ? styles.btnSuspender : styles.btnActivar}
                        onClick={() => handleToggle(a)}
                        disabled={a.id === me?.id}
                        title={a.id === me?.id ? 'No podés desactivarte a vos mismo' : ''}
                      >
                        {a.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
