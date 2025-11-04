/**
 * Header.jsx - Componente de encabezado de la aplicación
 *
 * Navegación principal con logo, links, contador de carrito y auth.
 */

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useCart } from "../../context/CartProvider";
import { useAuth } from "../../context/AuthContext";
import "./header.css";

const Header = () => {
  // Datos del carrito
  const { cart } = useCart();

  // Autenticación
  const { estaAutenticado, logout, esAdmin, roles } = useAuth();

  // Navegación
  const navigate = useNavigate();
  
  // Memorizar el resultado de esAdmin para evitar recalcular en cada render
  const isAdmin = useMemo(() => {
    return esAdmin();
  }, [estaAutenticado, roles, esAdmin]);

  // Total de items (protegido)
  const totalItems = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/");
    console.log("Sesión cerrada exitosamente");
  };

  return (
    <header className="site-header">
      <div className="header-inner container">
        {/* Marca */}
        <Link to="/" className="brand" aria-label="Inicio">
          <img src="/assets/logo.png" alt="Logo" className="brand-logo" />
        </Link>

        {/* Navegación */}
        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            Productos
          </NavLink>
          {/* Mostrar "Administrar Productos" solo si el usuario es ADMIN */}
          {estaAutenticado && isAdmin && (
            <NavLink to="/admin/products" className="nav-link">
              Administrar Productos
            </NavLink>
          )}
        </nav>

        {/* Acciones: carrito + auth */}
        <div className="header-actions">
          {/* Carrito */}
          <Link
            to="/cart"
            className="cart-btn"
            aria-label="Ir al carrito"
            title="Carrito"
          >
            <img
              src="/assets/carrito_blanco.png"
              alt="Carrito"
              className="cart-icon"
            />
            {totalItems > 0 && (
              <span className="cart-number" aria-live="polite">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Auth */}
          {estaAutenticado ? (
            <button
              onClick={handleLogout}
              className="btn-logout"
              aria-label="Cerrar sesión"
            >
              Log Out
            </button>
          ) : (
            <Link to="/login" className="btn-login">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
