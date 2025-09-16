/**
 * ProtectedRoute.jsx - Componente para proteger rutas que requieren autenticación
 * 
 * Este componente verifica si el usuario está autenticado antes de permitir
 * el acceso a una ruta específica. Si no está autenticado, redirige al login.
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente que protege rutas requiriendo autenticación
 * 
 * @param {Object} props - Props del componente
 * @param {ReactNode} props.children - Componente hijo que se renderiza si está autenticado
 * @returns {JSX.Element} - Componente hijo o redirección al login
 */
const ProtectedRoute = ({ children }) => {
  // Obtener el estado de autenticación desde el contexto
  const { estaAutenticado } = useAuth();

  // Si el usuario no está autenticado, redirigir al login
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar el componente hijo
  return children;
};

export default ProtectedRoute;