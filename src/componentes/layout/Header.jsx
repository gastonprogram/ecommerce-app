/**
 * Header.jsx - Componente de encabezado de la aplicación
 * 
 * Este componente contiene la navegación principal de la aplicación,
 * incluyendo el logo, menú de navegación, contador del carrito y autenticación.
 * 
 * Características:
 * - Logo/marca de la tienda
 * - Navegación principal
 * - Contador total de items en el carrito (suma de cantidades)
 * - Botón de logout para usuarios autenticados
 * - Enlaces de login/registro para usuarios no autenticados
 * - Enlaces de navegación
 */

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartProvider";
import { useAuth } from "../../context/AuthContext";

/**
 * Componente de encabezado principal
 * 
 * Muestra la barra de navegación superior con logo, menú, carrito y opciones de autenticación
 * 
 * @returns {JSX.Element} Encabezado de la aplicación
 */
const Header = () => {
  // Obtener datos del carrito para mostrar el contador
  const { cart } = useCart();
  
  // Obtener datos de autenticación
  const { estaAutenticado, usuario, logout } = useAuth();
  
  // Hook de navegación
  const navigate = useNavigate();

  // Calcular el total de items en el carrito (suma de todas las cantidades)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  /**
   * Manejar logout del usuario
   */
  const handleLogout = () => {
    logout();
    navigate('/');
    console.log('Sesión cerrada exitosamente');
  };

  return (
    <header className="site-header">
      <div className="header-inner container">
        {/* Logo/marca de la tienda */}
        <Link to="/" className="brand">
          TIENDA ONLINE
        </Link>
        
        {/* Navegación principal */}
        <nav className="nav">
          <Link to="/">Productos</Link>
          {estaAutenticado && <Link to="/admin/products">Administrar Productos</Link>}
        </nav>
        
        {/* Sección de usuario y carrito */}
        <div className="header-actions">
          {/* Botón del carrito con contador */}
          <Link to="/cart" className="btn-cart">
            🛒 Carrito 
            <span className="cart-count">{totalItems}</span>
          </Link>
          
          {/* Botón de logout si el usuario está autenticado */}
          {estaAutenticado && (
            <button onClick={handleLogout} className="btn-logout" title="Cerrar sesión">
              Log Out
            </button>
          )}
          
          {/* Enlaces de login/registro si no está autenticado */}
          {!estaAutenticado && (
            <div className="auth-links">
              <Link to="/login" className="btn-login">Iniciar Sesión</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
