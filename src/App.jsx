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
import { Cart, CartProvider } from './componentes/cart'
import './App.css'

/**
 * Componente principal de la aplicación
 * 
 * Configura las rutas principales y envuelve toda la aplicación
 * con el AuthProvider y CartProvider para proporcionar acceso global 
 * a los contextos de autenticación y carrito.
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Redirige la raíz a login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            
              {/* Rutas de autenticación */}
              <Route path="/login" element={<InicioSesion />} />
              <Route path="/register" element={<Registro />} />

              {/* Rutas de navegación */}
              <Route path="/home" element={<h1>Home</h1>} />

              {/* Rutas de carrito */}
              <Route path="/cart" element={<Cart />} />
            
              {/* Ruta para páginas no encontradas */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
