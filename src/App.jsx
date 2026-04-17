import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AdBanner from './components/AdBanner'
import Footer from './components/Footer'
import Presupuesto from './pages/Presupuesto'
import Electricistas from './pages/Electricistas'
import Registro from './pages/Registro'
import './styles/global.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <AdBanner />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Presupuesto />} />
            <Route path="/electricistas" element={<Electricistas />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
