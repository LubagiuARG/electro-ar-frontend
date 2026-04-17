import { useState, useMemo } from 'react'
import styles from './Electricistas.module.css'

// ── Datos mock — en producción vienen del backend ────────────────────────────
const ELECTRICISTAS = [
  {
    id: 1,
    nombre: 'Marcelo Rodríguez',
    iniciales: 'MR',
    zona: 'Palermo, CABA',
    region: 'caba',
    matricula: '4821',
    rating: 4.9,
    reviews: 87,
    tarifa: 18500,
    especialidades: ['Tableros', 'Instalaciones residenciales', 'BT'],
    verificado: true,
    pro: true,
    whatsapp: '5491100000001',
  },
  {
    id: 2,
    nombre: 'Laura Fernández',
    iniciales: 'LF',
    zona: 'San Isidro, GBA Norte',
    region: 'gba-norte',
    matricula: '7203',
    rating: 4.8,
    reviews: 54,
    tarifa: 16000,
    especialidades: ['Domotica', 'Instalaciones residenciales', 'Alarmas'],
    verificado: true,
    pro: false,
    whatsapp: '5491100000002',
  },
  {
    id: 3,
    nombre: 'Jorge González',
    iniciales: 'JG',
    zona: 'Quilmes, GBA Sur',
    region: 'gba-sur',
    matricula: '3390',
    rating: 4.6,
    reviews: 41,
    tarifa: 14500,
    especialidades: ['Comercial', 'Industrial', 'Tableros'],
    verificado: true,
    pro: true,
    whatsapp: '5491100000003',
  },
  {
    id: 4,
    nombre: 'Alejandro Pérez',
    iniciales: 'AP',
    zona: 'Morón, GBA Oeste',
    region: 'gba-oeste',
    matricula: '5617',
    rating: 4.4,
    reviews: 29,
    tarifa: 13000,
    especialidades: ['Residencial', 'Porteros', 'CCTV'],
    verificado: false,
    pro: false,
    whatsapp: '5491100000004',
  },
  {
    id: 5,
    nombre: 'Carlos Vidal',
    iniciales: 'CV',
    zona: 'Caballito, CABA',
    region: 'caba',
    matricula: '9934',
    rating: 5.0,
    reviews: 12,
    tarifa: 20000,
    especialidades: ['Luces de emergencia', 'Tableros', 'BT'],
    verificado: true,
    pro: true,
    whatsapp: '5491100000005',
  },
  {
    id: 6,
    nombre: 'Sebastián Molina',
    iniciales: 'SM',
    zona: 'Tigre, GBA Norte',
    region: 'gba-norte',
    matricula: '9012',
    rating: 4.3,
    reviews: 18,
    tarifa: 12500,
    especialidades: ['Residencial', 'Instalaciones nuevas'],
    verificado: false,
    pro: false,
    whatsapp: '5491100000006',
  },
  {
    id: 7,
    nombre: 'Verónica Sánchez',
    iniciales: 'VS',
    zona: 'Villa Urquiza, CABA',
    region: 'caba',
    matricula: '6145',
    rating: 4.7,
    reviews: 33,
    tarifa: 17000,
    especialidades: ['Residencial', 'Reciclajes', 'Tableros'],
    verificado: true,
    pro: true,
    whatsapp: '5491100000007',
  },
  {
    id: 8,
    nombre: 'Rodrigo Blanco',
    iniciales: 'RB',
    zona: 'Lanús, GBA Sur',
    region: 'gba-sur',
    matricula: '8801',
    rating: 4.5,
    reviews: 22,
    tarifa: 13500,
    especialidades: ['Industrial', 'Mantenimiento', 'BT'],
    verificado: true,
    pro: false,
    whatsapp: '5491100000008',
  },
]

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
    let list = ELECTRICISTAS

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
      {filtered.length === 0 ? (
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
