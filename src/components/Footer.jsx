import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.name}>Don<span>Voltio</span></span>
          <span className={styles.copy}>© {new Date().getFullYear()}</span>
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.link}>FADEERA</a>
          <span className={styles.dot}>·</span>
          <a href="#" className={styles.link}>COPIME</a>
          <span className={styles.dot}>·</span>
          <a href="#" className={styles.link}>ENRE</a>
          <span className={styles.dot}>·</span>
          <a href="#" className={styles.link}>Términos</a>
          <span className={styles.dot}>·</span>
          <a href="#" className={styles.link}>Privacidad</a>
        </div>
        <p className={styles.disclaimer}>
          Los presupuestos son orientativos y no reemplazan un presupuesto profesional firmado.
        </p>
      </div>
    </footer>
  )
}
