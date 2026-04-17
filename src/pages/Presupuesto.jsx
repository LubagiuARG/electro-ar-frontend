import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import styles from './Presupuesto.module.css'

// ── Selector de tipo de usuario ──────────────────────────────────────────────
const USER_TYPES = [
  { id: 'particular', icon: '🏠', label: 'Particular', desc: 'Trabajo en mi hogar' },
  { id: 'comercio',   icon: '🏪', label: 'Comercio',   desc: 'Local o negocio'    },
  { id: 'industria',  icon: '🏭', label: 'Industria',  desc: 'Instalación industrial' },
]

// ── Sugerencias rápidas ──────────────────────────────────────────────────────
const SUGGESTIONS = [
  'Cambiar el tablero de una casa de 3 ambientes',
  'Instalar 4 tomas y 3 puntos de luz en un local',
  'Poner un aire acondicionado split 3000 frigorías',
  'Instalar alarma y portero eléctrico',
  'Renovar instalación eléctrica completa de un PH',
]

// ── Componente: Burbuja de mensaje ───────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const { ui } = msg

  return (
    <div className={`${styles.msgRow} ${isUser ? styles.msgRowUser : ''}`}>
      <div className={`${styles.avatar} ${isUser ? styles.avatarUser : styles.avatarAi}`}>
        {isUser ? 'U' : '⚡'}
      </div>

      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : ''}`}>
        {/* Texto con soporte para **negrita** e *itálica* básicos */}
        <p
          className={styles.bubbleText}
          dangerouslySetInnerHTML={{
            __html: (ui?.text || '')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>')
              .replace(/\n/g, '<br/>'),
          }}
        />

        {/* Tarjeta de presupuesto */}
        {ui?.type === 'budget' && ui.items?.length > 0 && (
          <div className={styles.budgetCard}>
            <div className={styles.budgetHeader}>
              <span className={styles.budgetTitle}>PRESUPUESTO ESTIMADO</span>
              <span className={styles.budgetSource}>Ref: FADEERA · COPIME</span>
            </div>
            <div className={styles.budgetItems}>
              {ui.items.map((item, i) => (
                <div key={i} className={styles.budgetItem}>
                  <span className={styles.budgetLabel}>{item.label}</span>
                  <span className={styles.budgetVal}>{item.val}</span>
                </div>
              ))}
            </div>
            {ui.total && (
              <div className={styles.budgetTotal}>
                <span>TOTAL</span>
                <span className={styles.budgetTotalVal}>{ui.total}</span>
              </div>
            )}
            {ui.notas && (
              <p className={styles.budgetNotas}>💡 {ui.notas}</p>
            )}
            <p className={styles.budgetDisclaimer}>
              Valores orientativos. Podés solicitar presupuesto formal a un electricista matriculado.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Componente: Indicador de escritura ───────────────────────────────────────
function TypingIndicator() {
  return (
    <div className={styles.msgRow}>
      <div className={`${styles.avatar} ${styles.avatarAi}`}>⚡</div>
      <div className={styles.bubble}>
        <div className={styles.typing}>
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
      </div>
    </div>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function Presupuesto() {
  const [userType, setUserType] = useState('particular')
  const [input, setInput] = useState('')
  const { messages, loading, sendMessage, clearChat } = useChat(userType)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    if (!input.trim() || loading) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleSuggestion = (text) => {
    sendMessage(text)
    inputRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={styles.page}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>⚡ Asistente Inteligente</div>
        <h1 className={styles.heroTitle}>
          ¿Cuánto cuesta<br />tu <span className={styles.heroAccent}>instalación</span>?
        </h1>
        <p className={styles.heroDesc}>
          Describí el trabajo que necesitás y el asistente calcula un presupuesto
          orientativo con tarifas vigentes de FADEERA y COPIME.
        </p>
      </div>

      {/* Selector tipo de usuario */}
      <div className={styles.userTypes}>
        {USER_TYPES.map((type) => (
          <button
            key={type.id}
            className={`${styles.typeCard} ${userType === type.id ? styles.typeCardActive : ''}`}
            onClick={() => setUserType(type.id)}
          >
            <span className={styles.typeIcon}>{type.icon}</span>
            <span className={styles.typeLabel}>{type.label}</span>
            <span className={styles.typeDesc}>{type.desc}</span>
          </button>
        ))}
      </div>

      {/* Chat container */}
      <div className={styles.chatContainer}>

        {/* Chat header */}
        <div className={styles.chatHeader}>
          <div className={styles.chatHeaderLeft}>
            <span className={styles.aiDot} />
            <div>
              <div className={styles.chatTitle}>Asistente Don Voltio</div>
              <div className={styles.chatSub}>Tarifas FADEERA · COPIME · ENRE</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={clearChat} title="Limpiar conversación">
            🗑️
          </button>
        </div>

        {/* Mensajes */}
        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Sugerencias rápidas (solo al inicio) */}
        {messages.length <= 1 && !loading && (
          <div className={styles.suggestions}>
            <span className={styles.suggestionsLabel}>Consultas frecuentes:</span>
            <div className={styles.suggestionsList}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className={styles.suggestionBtn}
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className={styles.inputArea}>
          <textarea
            ref={inputRef}
            className={styles.textarea}
            placeholder="Describí el trabajo que necesitás..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={2}
            disabled={loading}
          />
          <button
            className={`btn btn-primary ${styles.sendBtn}`}
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? '...' : 'Consultar ↗'}
          </button>
        </div>
      </div>

    </div>
  )
}
