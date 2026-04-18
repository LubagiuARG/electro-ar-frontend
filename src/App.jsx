import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'
import AdBanner from './components/AdBanner'
import Footer from './components/Footer'
import Presupuesto from './pages/Presupuesto'
import Electricistas from './pages/Electricistas'
import Registro from './pages/Registro'
import Login from './pages/Login'
import Panel from './pages/Panel'
import './styles/global.css'

function RutaProtegida({ children }) {
  const { profesional, cargando } = useAuth()
  if (cargando) return <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando...</div>
  if (!profesional) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <AdBanner />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<Presupuesto />} />
            <Route path="/electricistas" element={<Electricistas />} />
            <Route path="/registro"      element={<Registro />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/panel"         element={
              <RutaProtegida>
                <Panel />
              </RutaProtegida>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}