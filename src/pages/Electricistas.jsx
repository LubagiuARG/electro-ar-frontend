//import { useState, useMemo } from 'react'
import styles from './Electricistas.module.css'
import { useState, useEffect, useMemo } from 'react'
import { getElectricistas } from '../services/api'

// Dentro del componente, agregá estos estados:
const [electricistas, setElectricistas] = useState([])
const [cargando, setCargando]           = useState(true)

useEffect(() => {
  getElectricistas()
    .then(data => {
      setElectricistas(data)
      setCargando(false)
    })
    .catch(() => setCargando(false))
}, [])

const REGIONS = [
  { id: 'todos',     label: 'Todos' },
  { id: 'caba',      label: 'CABA'      },
  { id: 'gba-norte', label: 'GBA Norte' },
  { id: 'gba-sur',   label: 'GBA Sur'   },
  { id: 'gba-oeste', label: 'GBA Oeste' },
]

const SORTS = [
  { id: 'rating',  label: 'Mejor puntuación' },
  { id: 'tarifa',  label: 'Menor tarifa'      },
  { id: 'reviews', label: 'Más reseñas'       },
]

function Stars({ rating }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className={styles.stars} aria-label={`${rating} estrellas`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

function ElecCard({ elec }) {
  const whatsappUrl = `https://wa.me/${elec.whatsapp}?text=Hola%20${encodeURIComponent(elec.nombre)}%2C%20te%20contacto%20desde%20ElectroAR.`

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>{elec.iniciales}</div>
        <div className={styles.info}>
          <div className={styles.nombre}>{elec.nombre}</div>
          <div className={styles.zona}>📍 {elec.zona}</div>
        </div>
      </div>

      <div className={styles.badges}>
        {elec.verificado && <span className="badge badge-verified">✓ Verificado</span>}
        {elec.matricula  && <span className="badge badge-matricula">Mat. N°{elec.matricula}</span>}
        {elec.pro        && <span className="badge badge-pro">PRO</span>}
      </div>

      <div className={styles.especialidades}>
        {elec.especialidades.map((e, i) => (
          <span key={i} className={styles.esp}>{e}</span>
        ))}
      </div>

      <div className={styles.rating}>
        <Stars rating={elec.rating} />
        <span className={styles.ratingNum}>{elec.rating.toFixed(1)}</span>
        <span className={styles.ratingCount}>({elec.reviews} reseñas)</span>
      </div>

      <div className={styles.footer}>
        <div className={styles.tarifa}>
          ${elec.tarifa.toLocaleString('es-AR')}
          <span className={styles.tarifaUnit}>/hora</span>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className={`btn btn-outline ${styles.contactBtn}`}
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}

export default function Electricistas() {
  const [region, setRegion]   = useState('todos')
  const [sort, setSort]       = useState('rating')
  const [search, setSearch]   = useState('')

  const filtered = useMemo(() => {
    let list = electricistas

    if (region !== 'todos') {
      list = list.filter((e) => e.region === region)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (e) =>
          e.nombre.toLowerCase().includes(q) ||
          e.zona.toLowerCase().includes(q) ||
          e.especialidades.some((s) => s.toLowerCase().includes(q))
      )
    }

    return [...list].sort((a, b) => {
      if (sort === 'rating')  return b.rating  - a.rating
      if (sort === 'tarifa')  return a.tarifa   - b.tarifa
      if (sort === 'reviews') return b.reviews  - a.reviews
      return 0
    })
  }, [region, sort, search])

  return (
    <div className={styles.page}>

      <div className="section-head">
        <h1 className="display">Electricistas Verificados</h1>
        <p>Profesionales matriculados · GBA y CABA</p>
      </div>

      {/* Controles */}
      <div className={styles.controls}>
        <input
          className={`input ${styles.searchInput}`}
          placeholder="Buscar por nombre, zona o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className={styles.filters}>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              className={`${styles.filterBtn} ${region === r.id ? styles.filterBtnActive : ''}`}
              onClick={() => setRegion(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <select
          className={`input ${styles.sortSelect}`}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Resultados */}
      {cargando ? (
  <div className={styles.empty}>
    <span>⚡</span>
    <p>Cargando electricistas...</p>
  </div>
) : filtered.length === 0 ? (
  <div className={styles.empty}>
    <span>🔍</span>
    <p>No hay electricistas que coincidan con tu búsqueda.</p>
  </div>
) : (
  <>
    <p className={styles.resultCount}>
      {filtered.length} profesional{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
    </p>
    <div className={styles.grid}>
      {filtered.map((e) => <ElecCard key={e.id} elec={e} />)}
    </div>
  </>
)}

      {/* CTA para electricistas */}
      <div className={styles.ctaBanner}>
        <div>
          <strong>¿Sos electricista?</strong>
          <span> Publicá tus servicios y recibí consultas de clientes en tu zona.</span>
        </div>
        <a href="/registro" className="btn btn-primary">Registrarse →</a>
      </div>

    </div>
  )
}
