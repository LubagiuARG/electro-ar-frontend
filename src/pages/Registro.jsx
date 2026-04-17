import { useState } from 'react'
import styles from './Registro.module.css'
import { registrarElectricista } from '../services/api'

const PLANS = [
  {
    id: 'free',
    label: 'Plan Básico',
    name: 'FREE',
    price: 0,
    period: '/mes',
    featured: false,
    features: [
      { text: 'Perfil público básico', active: true },
      { text: 'Zona de cobertura', active: true },
      { text: '5 consultas por mes', active: true },
      { text: 'Badge Verificado', active: false },
      { text: 'Prioridad en búsquedas', active: false },
      { text: 'Consultas ilimitadas', active: false },
      { text: 'Panel de estadísticas', active: false },
      { text: 'Botón WhatsApp directo', active: false },
    ],
    cta: 'Empezar gratis',
  },
  {
    id: 'pro',
    label: 'Plan Recomendado',
    name: 'PRO',
    price: 8900,
    period: '/mes',
    featured: true,
    features: [
      { text: 'Perfil público completo', active: true },
      { text: 'Zona de cobertura', active: true },
      { text: 'Consultas ilimitadas', active: true },
      { text: 'Badge Verificado ✓', active: true },
      { text: 'Prioridad en búsquedas', active: true },
      { text: 'Panel de estadísticas', active: true },
      { text: 'Botón WhatsApp directo', active: true },
      { text: 'Soporte prioritario', active: true },
    ],
    cta: 'Activar Plan PRO',
  },
]

const ESPECIALIDADES_OPTIONS = [
  'Instalaciones residenciales',
  'Instalaciones comerciales',
  'Instalaciones industriales',
  'Tableros eléctricos',
  'Baja tensión (BT)',
  'Media tensión (MT)',
  'Domotica / Smart Home',
  'Alarmas y CCTV',
  'Porteros eléctricos',
  'Aire acondicionado',
  'Energía solar',
  'Mantenimiento',
]

function PlanCard({ plan, selected, onSelect }) {
  return (
    <div
      className={`${styles.planCard} ${plan.featured ? styles.planFeatured : ''} ${selected === plan.id ? styles.planSelected : ''}`}
      onClick={() => onSelect(plan.id)}
    >
      {plan.featured && (
        <div className={styles.planBadge}>⚡ Recomendado</div>
      )}
      <div className={styles.planLabel}>{plan.label}</div>
      <div className={styles.planName}>{plan.name}</div>
      <div className={styles.planPrice}>
        {plan.price === 0 ? (
          <span className={styles.planPriceFree}>GRATIS</span>
        ) : (
          <>
            <span className={styles.planCurrency}>$</span>
            {plan.price.toLocaleString('es-AR')}
            <span className={styles.planPeriod}>{plan.period}</span>
          </>
        )}
      </div>
      <ul className={styles.planFeatures}>
        {plan.features.map((f, i) => (
          <li key={i} className={f.active ? styles.featureActive : styles.featureInactive}>
            <span className={styles.featureIcon}>{f.active ? '✓' : '—'}</span>
            {f.text}
          </li>
        ))}
      </ul>
      <button
        className={`btn ${plan.featured ? 'btn-primary' : 'btn-outline'} ${styles.planCta}`}
        onClick={(e) => { e.stopPropagation(); onSelect(plan.id) }}
      >
        {plan.cta}
      </button>
    </div>
  )
}

export default function Registro() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [step, setStep] = useState(1) // 1: plan, 2: datos, 3: pago
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    matricula: '',
    provincia: '',
    zona: '',
    especialidades: [],
    descripcion: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleField = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const toggleEsp = (esp) => {
    setForm((f) => ({
      ...f,
      especialidades: f.especialidades.includes(esp)
        ? f.especialidades.filter((e) => e !== esp)
        : [...f.especialidades, esp],
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await registrarElectricista({
      nombre:         form.nombre,
      apellido:       form.apellido,
      email:          form.email,
      telefono:       form.telefono,
      matricula:      form.matricula,
      provincia:      form.provincia,
      zona:           form.zona,
      descripcion:    form.descripcion,
      especialidades: form.especialidades,
      plan:           selectedPlan,
    })
    setSubmitted(true)
  } catch (error) {
    alert(error.message)
  }
}
 
  if (submitted) {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successIcon}>⚡</div>
        <h2 className={styles.successTitle}>¡Registro completado!</h2>
        <p className={styles.successDesc}>
          {selectedPlan === 'free'
            ? 'Tu perfil ya está activo. Podés completar tu información en cualquier momento.'
            : 'En instantes serás redirigido a MercadoPago para completar el pago y activar tu Plan PRO.'}
        </p>
        <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
          Volver al inicio
        </button>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <div className="section-head">
        <h1 className="display">Publicá tus Servicios</h1>
        <p>Registrate y empezá a recibir consultas de clientes en tu zona</p>
      </div>

      {/* Steps indicator */}
      <div className={styles.steps}>
        {['Elegí tu plan', 'Tus datos', 'Pago'].map((label, i) => (
          <div key={i} className={`${styles.step} ${step === i + 1 ? styles.stepActive : ''} ${step > i + 1 ? styles.stepDone : ''}`}>
            <div className={styles.stepNum}>{step > i + 1 ? '✓' : i + 1}</div>
            <span className={styles.stepLabel}>{label}</span>
          </div>
        ))}
        <div className={styles.stepLine} />
      </div>

      {/* STEP 1: Planes */}
      {step === 1 && (
        <div className={styles.stepContent}>
          <div className={styles.plansGrid}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selectedPlan}
                onSelect={setSelectedPlan}
              />
            ))}
          </div>
          <div className={styles.stepActions}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continuar con {selectedPlan === 'pro' ? 'Plan PRO' : 'Plan Free'} →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Datos */}
      {step === 2 && (
        <div className={styles.stepContent}>
          <div className={styles.formCard}>
            <h3 className={styles.formTitle}>Datos profesionales</h3>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className="input-label">Nombre</label>
                <input className="input" name="nombre" placeholder="Ej: Juan" value={form.nombre} onChange={handleField} />
              </div>
              <div className={styles.formGroup}>
                <label className="input-label">Apellido</label>
                <input className="input" name="apellido" placeholder="Ej: García" value={form.apellido} onChange={handleField} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className="input-label">Email</label>
                <input className="input" type="email" name="email" placeholder="tu@email.com" value={form.email} onChange={handleField} />
              </div>
              <div className={styles.formGroup}>
                <label className="input-label">WhatsApp</label>
                <input className="input" name="telefono" placeholder="+54 11 0000-0000" value={form.telefono} onChange={handleField} />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className="input-label">N° Matrícula habilitante</label>
                <input className="input" name="matricula" placeholder="Ej: 4821" value={form.matricula} onChange={handleField} />
              </div>
              <div className={styles.formGroup}>
                <label className="input-label">Provincia</label>
                <select className="input" name="provincia" value={form.provincia} onChange={handleField}>
                  <option value="">Seleccioná...</option>
                  <option>Ciudad de Buenos Aires</option>
                  <option>Buenos Aires</option>
                  <option>Córdoba</option>
                  <option>Santa Fe</option>
                  <option>Mendoza</option>
                  <option>Otra</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className="input-label">Zona de cobertura</label>
              <input className="input" name="zona" placeholder="Ej: Palermo, Belgrano, Villa Urquiza" value={form.zona} onChange={handleField} />
            </div>

            <div className={styles.formGroup}>
              <label className="input-label">Especialidades</label>
              <div className={styles.espGrid}>
                {ESPECIALIDADES_OPTIONS.map((esp) => (
                  <button
                    key={esp}
                    type="button"
                    className={`${styles.espToggle} ${form.especialidades.includes(esp) ? styles.espToggleActive : ''}`}
                    onClick={() => toggleEsp(esp)}
                  >
                    {esp}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className="input-label">Descripción breve de tus servicios</label>
              <textarea
                className="input"
                name="descripcion"
                placeholder="Contá brevemente tu experiencia y los trabajos que realizás..."
                value={form.descripcion}
                onChange={handleField}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div className={styles.stepActions}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>← Atrás</button>
            <button className="btn btn-primary" onClick={() => setStep(3)}>
              {selectedPlan === 'free' ? 'Crear perfil gratis →' : 'Ir al pago →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Pago */}
      {step === 3 && (
        <div className={styles.stepContent}>
          {selectedPlan === 'free' ? (
            <div className={styles.formCard} style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎉</div>
              <h3 className={styles.formTitle}>¡Todo listo!</h3>
              <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '1.5rem' }}>
                Tu perfil gratuito está listo para ser publicado.
              </p>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Publicar mi perfil
              </button>
            </div>
          ) : (
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Resumen del pago</h3>

              <div className={styles.paymentSummary}>
                <div className={styles.paymentRow}>
                  <span>Plan PRO — ElectroAR</span>
                  <span className={styles.paymentAmount}>$8.900/mes</span>
                </div>
                <div className={styles.paymentRow}>
                  <span style={{ color: 'var(--muted)', fontSize: '12px' }}>Se renueva automáticamente</span>
                  <span className={styles.paymentAmountTotal}>$8.900 ARS</span>
                </div>
              </div>

              <div className={styles.mpInfo}>
                <div className={styles.mpLogo}>MP</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>MercadoPago</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    Pago seguro · Tarjeta, débito o efectivo
                  </div>
                </div>
              </div>

              <p className={styles.mpDisclaimer}>
                Al hacer clic serás redirigido a MercadoPago para completar el pago de forma segura.
                Podés cancelar tu suscripción en cualquier momento.
              </p>

              <button className={`btn ${styles.mpBtn}`} onClick={handleSubmit}>
                <span className={styles.mpBtnLogo}>MP</span>
                Pagar con MercadoPago
              </button>
            </div>
          )}

          <div className={styles.stepActions} style={{ justifyContent: 'flex-start' }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>← Atrás</button>
          </div>
        </div>
      )}

    </div>
  )
}
