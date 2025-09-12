/**
 * App.jsx - Componente principal de la aplicación
 * 
 * Configura las rutas principales y la estructura de navegación.
 * Envuelve la aplicación con el CartProvider y configura todas las rutas.
 * Maneja headers condicionales: SimpleHeader para auth, Header completo para el resto.
 */

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./componentes/cart";
import { InicioSesion, Registro } from './componentes/auth'
import { Cart } from './componentes/cart'
import { Header, SimpleHeader } from './componentes/layout'
import Home from "./pages/home";
import Categories from "./pages/categories";
import ProductDetail from "./pages/productDetail";
import ProductCrud from "./pages/productCrud";
import "./index.css";

/**
 * Componente principal de la aplicación
 * 
 * Configura las rutas y la estructura general de la aplicación
 * 
 * @returns {JSX.Element} Aplicación completa
 */
export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

/**
 * Componente interno que maneja el contenido de la aplicación
 * con headers condicionales según la ruta
 * 
 * @returns {JSX.Element} Contenido de la aplicación
 */
function AppContent() {
  const location = useLocation();
  
  // Rutas que deben usar el header simplificado
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <>
      {/* Header condicional según la ruta */}
      {isAuthRoute ? <SimpleHeader /> : <Header />}
      
      <main className="site-main container">
        <Routes>
          {/* Ruta principal - catálogo de productos */}
          <Route path="/" element={<Home />} />

          {/* Rutas de autenticación */}
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/register" element={<Registro />} />

          {/* Rutas de productos */}
          <Route path="/categories/:id" element={<Categories />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin/products" element={<ProductCrud />} />

          {/* Ruta del carrito */}
          <Route path="/cart" element={<Cart />} />
          
          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
