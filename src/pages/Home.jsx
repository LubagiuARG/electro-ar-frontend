import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const PROVINCES = [
  'Todas las provincias', 'Buenos Aires', 'CABA', 'Catamarca', 'Chaco',
  'Chubut', 'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
  'La Pampa', 'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
  'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
]

const QUICK_TAGS = ['Electricista', 'Plomero', 'Pintor', 'Gasista', 'Aire acond.', 'Cerrajero']

const CATEGORIES = [
  { icon: '⚡', label: 'Electricista' },
  { icon: '🔧', label: 'Plomero' },
  { icon: '🔥', label: 'Gasista' },
  { icon: '🧱', label: 'Albañil' },
  { icon: '🖌️', label: 'Pintor' },
  { icon: '❄️', label: 'Aire acondicionado' },
  { icon: '🔑', label: 'Cerrajero' },
  { icon: '🪵', label: 'Carpintero' },
  { icon: '🌿', label: 'Jardinero' },
  { icon: '☀️', label: 'Energía solar' },
  { icon: '📷', label: 'CCTV' },
  { icon: '📦', label: 'Mudanzas' },
  { icon: '🧹', label: 'Limpieza' },
  { icon: '⚙️', label: 'Herrero' },
  { icon: '💻', label: 'Técnico PC' },
  { icon: '🌡️', label: 'Calefacción' },
]

const STATS = [
  { value: '4.800+', label: 'Profesionales' },
  { value: '16+', label: 'Categorías' },
  { value: '98%', label: 'Satisfacción' },
  { value: '24hs', label: 'Respuesta media' },
]

const FEATURED = [
  { name: 'Carlos M.', role: 'Electricista matriculado', location: 'Buenos Aires', rating: 4.9, jobs: 312, avatar: '👷' },
  { name: 'Laura G.', role: 'Plomera profesional', location: 'Córdoba', rating: 4.8, jobs: 187, avatar: '🔧' },
  { name: 'Pablo R.', role: 'Gasista habilitado', location: 'Rosario', rating: 5.0, jobs: 94, avatar: '🔥' },
]

const STEPS = [
  { num: '01', title: 'Describí qué necesitás', desc: 'Contanos el trabajo y la zona. Nuestro asistente IA te ayuda a precisar los detalles.' },
  { num: '02', title: 'Recibí presupuestos', desc: 'Profesionales verificados de tu zona te responden en menos de 24 horas.' },
  { num: '03', title: 'Elegí con confianza', desc: 'Revisá perfiles, calificaciones y antecedentes antes de decidir.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [province, setProvince] = useState('Todas las provincias')

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/profesionales?q=${encodeURIComponent(search)}&provincia=${encodeURIComponent(province)}`)
  }

  const handleTag = (tag) => {
    setSearch(tag)
    navigate(`/profesionales?q=${encodeURIComponent(tag)}&provincia=${encodeURIComponent(province)}`)
  }

  const handleCategory = (label) => {
    navigate(`/profesionales?q=${encodeURIComponent(label)}`)
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroLeft}>
            <span className="badge">✦ Toda Argentina</span>
            <h1 className={styles.heroTitle}>
              El experto que<br />
              <em>buscabas,</em><br />
              a un mensaje
            </h1>
            <p className={styles.heroSub}>
              Conectamos clientes con profesionales verificados de todos los oficios. Rápido, confiable y con presupuesto IA.
            </p>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <div className={styles.searchField}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="¿Qué servicio necesitás?"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select
                className={styles.provinceSelect}
                value={province}
                onChange={e => setProvince(e.target.value)}
              >
                {PROVINCES.map(p => <option key={p}>{p}</option>)}
              </select>
              <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
                Buscar
              </button>
            </form>

            <div className={styles.quickTags}>
              {QUICK_TAGS.map(tag => (
                <button key={tag} className={styles.tag} onClick={() => handleTag(tag)}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.statsGrid}>
              {STATS.map(s => (
                <div key={s.label} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.featuredCards}>
              {FEATURED.map(pro => (
                <div key={pro.name} className={styles.proCard}>
                  <span className={styles.proAvatar}>{pro.avatar}</span>
                  <div className={styles.proInfo}>
                    <span className={styles.proName}>{pro.name}</span>
                    <span className={styles.proRole}>{pro.role}</span>
                    <span className={styles.proLocation}>📍 {pro.location}</span>
                  </div>
                  <div className={styles.proMeta}>
                    <span className={styles.proRating}>⭐ {pro.rating}</span>
                    <span className={styles.proJobs}>{pro.jobs} trabajos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.categories}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Encontrá el profesional ideal</h2>
          <p className={styles.sectionSub}>16 categorías · Todo el país</p>
          <div className={styles.catGrid}>
            {CATEGORIES.map(cat => (
              <button key={cat.label} className={styles.catCard} onClick={() => handleCategory(cat.label)}>
                <span className={styles.catIcon}>{cat.icon}</span>
                <span className={styles.catLabel}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={styles.howItWorks} id="como-funciona">
        <div className="container">
          <span className={styles.darkBadge}>¿Cómo funciona?</span>
          <h2 className={styles.darkTitle}>Tres pasos para resolver tu problema</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map(step => (
              <div key={step.num} className={styles.step}>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Strip ── */}
      <section className={styles.aiStrip}>
        <div className={`container ${styles.aiInner}`}>
          <div className={styles.aiText}>
            <span className={`badge ${styles.aiBadge}`}>✦ Asistente IA</span>
            <h2 className={styles.aiTitle}>Presupuesto inteligente en segundos</h2>
            <p className={styles.aiDesc}>
              Describí tu proyecto y nuestro asistente IA calcula un presupuesto orientativo, detecta el profesional indicado y te conecta directamente.
            </p>
          </div>
          <div className={styles.aiActions}>
            <button className="btn btn-primary" onClick={() => navigate('/presupuesto')}>
              Calcular presupuesto
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/profesionales')}>
              Ver profesionales
            </button>
          </div>
        </div>
      </section>

      {/* ── Pro CTA ── */}
      <section className={styles.proCta}>
        <div className={`container ${styles.proCtaInner}`}>
          <div>
            <h2 className={styles.proCtaTitle}>¿Sos un profesional?</h2>
            <p className={styles.proCtaDesc}>Sumá tu perfil y recibí clientes de toda Argentina sin comisiones ocultas.</p>
          </div>
          <button className="btn btn-dark" onClick={() => navigate('/registro')}>
            Publicar mi servicio
          </button>
        </div>
      </section>
    </main>
  )
}
