/**
 * Componente InicioSesion
 * 
 * Este componente maneja el formulario de inicio de sesión de usuarios.
 * Incluye validación de campos, manejo de errores, estados de carga
 * y redirección tras un login exitoso.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { validarFormularioLogin, validarEmail } from '../../utils/validaciones';
import { iniciarSesion } from '../../services/authService';
import './Auth.css';

/**
 * Componente funcional de inicio de sesión
 * 
 * Maneja todo el flujo de autenticación del usuario incluyendo:
 * - Captura de datos del formulario
 * - Validación en tiempo real
 * - Comunicación con el backend
 * - Manejo de estados de la UI
 * 
 * @returns {JSX.Element} - Formulario de inicio de sesión
 */
const InicioSesion = () => {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Estado para manejar los errores de validación
  const [errores, setErrores] = useState({});
  
  // Estado para rastrear qué campos han sido tocados por el usuario
  const [tocado, setTocado] = useState({});
  
  // Estado para controlar el indicador de carga durante el envío
  const [cargando, setCargando] = useState(false);
  
  // Estado para mostrar mensajes de éxito o error al usuario
  const [mensaje, setMensaje] = useState('');

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

    // Limpiar estados anteriores y activar indicador de carga
    setErrores({});
    setMensaje('');
    setCargando(true);

    try {
      // Intentar iniciar sesión con las credenciales proporcionadas
      const resultado = await iniciarSesion(formData.email, formData.password);
      
      if (resultado.success) {
        // Login exitoso: mostrar mensaje y guardar datos del usuario
        setMensaje(resultado.message);
        console.log('Usuario logueado:', resultado.usuario);
        
        // Guardar token y datos del usuario en localStorage para persistencia
        localStorage.setItem('token', resultado.token);
        localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
        
        // Mostrar mensaje de bienvenida (temporal, debería redirigir)
        // TODO: Implementar redirección a dashboard
        // navigate('/dashboard');
        alert(`¡Bienvenido ${resultado.usuario.nombre}!`);
      } else {
        // Login fallido: mostrar mensaje de error del servidor
        setMensaje(resultado.message);
      }
    } catch (error) {
      // Error de conexión: mostrar mensaje genérico
      setMensaje('Error de conexión. Verifica que el servidor esté funcionando.');
      console.error('Error:', error);
    } finally {
      // Siempre desactivar el indicador de carga al finalizar
      setCargando(false);
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
          <button type="submit" className="auth-button" disabled={cargando}>
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Área de mensajes de éxito o error */}
        {mensaje && (
          <div className={`mensaje ${mensaje.includes('exitoso') || mensaje.includes('Bienvenido') ? 'success' : 'error'}`}>
            {mensaje}
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
