/**
 * Componente InicioSesion
 * 
 * Este componente maneja el formulario de inicio de sesión de usuarios.
 * Incluye validación de campos, manejo de errores, estados de carga
 * y redirección tras un login exitoso.
 * 
 * Utiliza el Context de autenticación para manejar el estado global.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validarFormularioLogin, validarEmail } from '../../utils/validaciones';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

/**
 * Componente funcional de inicio de sesión
 * 
 * Maneja todo el flujo de autenticación del usuario incluyendo:
 * - Captura de datos del formulario
 * - Validación en tiempo real
 * - Comunicación con el backend a través del Context
 * - Manejo de estados de la UI
 * - Redirección automática al home tras login exitoso
 * 
 * @returns {JSX.Element} - Formulario de inicio de sesión
 */
const InicioSesion = () => {
  // Hook de navegación para redireccionar después del login
  const navigate = useNavigate();
  
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estado para manejar los errores de validación
  const [errores, setErrores] = useState({});
  
  // Estado para rastrear qué campos han sido tocados por el usuario
  const [tocado, setTocado] = useState({});

  // Usar el hook personalizado del Context para obtener funciones y estados
  const { 
    login, 
    cargandoLogin, 
    error, 
    limpiarError 
  } = useAuth();

  /**
   * Maneja los cambios en los campos del formulario
   * 
   * @param {Event} e - Evento del input que cambió
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Actualizar el estado del formulario con el nuevo valor
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir en un campo con error
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpiar errores del Context si existen
    if (error) {
      limpiarError();
    }
  };

  /**
   * Maneja la validación cuando el usuario sale de un campo (evento blur)
   * 
   * @param {Event} e - Evento blur del input
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Marcar el campo como tocado para mostrar errores si los hay
    setTocado(prev => ({ ...prev, [name]: true }));

    // Validar campo individual según su tipo
    if (name === 'email') {
      const emailValidacion = validarEmail(value);
      if (!emailValidacion.valido) {
        setErrores(prev => ({ ...prev, email: emailValidacion.mensaje }));
      }
    }
  };

  /**
   * Maneja el envío del formulario de inicio de sesión
   * 
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    // Prevenir el comportamiento por defecto del formulario
    e.preventDefault();
    
    // Validar todo el formulario antes de enviar
    const validacion = validarFormularioLogin(formData);
    
    // Si hay errores de validación, mostrarlos y no continuar
    if (!validacion.valido) {
      setErrores(validacion.errores);
      setTocado({ email: true, password: true });
      return;
    }

    // Limpiar estados anteriores
    setErrores({});
    limpiarError();

    try {
      // Usar la función login del Context para iniciar sesión
      const resultado = await login(formData.email, formData.password);
      
      if (resultado.success) {
        // Login exitoso: redireccionar al home
        console.log('¡Inicio de sesión exitoso! Redirigiendo al home...');
        navigate('/');
      }
      // Los errores se manejan automáticamente en el Context
    } catch (error) {
      // Error inesperado
      console.error('Error inesperado:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>
        
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Campo de email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errores.email ? 'error' : ''}`}
              placeholder="tu@email.com"
              required
            />
            {/* Mostrar mensaje de error si existe */}
            {errores.email && <span className="error-message">{errores.email}</span>}
          </div>

          {/* Campo de contraseña */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errores.password ? 'error' : ''}`}
              placeholder="••••••••"
              required
            />
            {/* Mostrar mensaje de error si existe */}
            {errores.password && <span className="error-message">{errores.password}</span>}
          </div>

          {/* Botón de envío con estado de carga */}
          <button type="submit" className="auth-button" disabled={cargandoLogin}>
            {cargandoLogin ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Área de mensajes de error del Context */}
        {error && (
          <div className="mensaje error">
            {error}
          </div>
        )}

        {/* Enlace para usuarios sin cuenta */}
        <div className="auth-footer">
          <p>¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link></p>
        </div>
      </div>
    </div>
  );
};

export default InicioSesion;
