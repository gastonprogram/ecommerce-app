/**
 * App.jsx - Componente principal de la aplicación
 * 
 * Este archivo contiene la configuración principal de rutas y
 * el AuthProvider que envuelve toda la aplicación para proporcionar
 * el contexto de autenticación a todos los componentes.
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { InicioSesion, Registro } from './componentes/auth'
import { AuthProvider } from './context/AuthContext'
import './App.css'

/**
 * Componente principal de la aplicación
 * 
 * Configura las rutas principales y envuelve toda la aplicación
 * con el AuthProvider para proporcionar acceso global al contexto
 * de autenticación.
 */
function App() {
  return (
    // AuthProvider envuelve toda la aplicación para compartir el contexto
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App
