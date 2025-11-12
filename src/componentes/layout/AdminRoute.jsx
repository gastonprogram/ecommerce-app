/**
 * AdminRoute.jsx - Componente para proteger rutas que requieren rol ADMIN
 * 
 * Este componente verifica:
 * 1. Que el usuario esté autenticado
 * 2. Que el usuario tenga el rol ADMIN
 * 
 * Si no cumple con los requisitos, redirige al home con un mensaje de error.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente que protege rutas requiriendo autenticación y rol ADMIN
 * 
 * @param {Object} props - Props del componente
 * @param {ReactNode} props.children - Componente hijo que se renderiza si es admin
 * @returns {JSX.Element} - Componente hijo o redirección
 */
const AdminRoute = ({ children }) => {
  // Obtener el estado de autenticación y roles desde el contexto
  const { estaAutenticado, esAdmin } = useAuth();



  // Si el usuario no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no es admin, redirigir al home
  if (!esAdmin()) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, renderizar el componente hijo
  return children;
};

export default AdminRoute;
