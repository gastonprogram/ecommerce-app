/**
 * main.jsx - Punto de entrada principal de la aplicación
 * 
 * Configura los providers globales y renderiza la aplicación principal.
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import './index.css'
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
