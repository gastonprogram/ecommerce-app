import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { InicioSesion, Registro } from './componentes/auth'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirige la raíz a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rutas de autenticación */}
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/register" element={<Registro />} />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
