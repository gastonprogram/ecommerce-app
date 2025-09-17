import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import CartProvider from './componentes/cart/CartProvider'   // 👈 agregá esto
import './index.css'
 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>   {/* 👈 ahora envuelve App con CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)
