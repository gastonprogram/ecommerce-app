/**
 * Componente Registro
 * 
 * Este componente maneja el formulario de registro de nuevos usuarios.
 * Incluye validación en tiempo real, verificación de fortaleza de contraseña,
 * comprobación de emails duplicados y manejo completo de errores y estados.
 * 
 * Utiliza el Context de autenticación para manejar el estado global.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  validarFormularioRegistro, 
  validarEmail, 
  validarNombre, 
  validarApellido,
  validarPassword, 
  validarConfirmPassword 
} from '../../utils/validaciones';
import { useAuth } from '../../context/AuthContext';
import PasswordStrength from './PasswordStrength';
import './Auth.css';

/**
 * Componente funcional de registro de usuarios
 * 
 * Maneja todo el flujo de registro incluyendo:
 * - Captura y validación de datos del formulario
 * - Validación en tiempo real de contraseñas
 * - Verificación de emails existentes
 * - Indicador visual de fortaleza de contraseña
 * - Comunicación con el backend
 * - Redirección tras registro exitoso
 * 
 * @returns {JSX.Element} - Formulario de registro de usuario
 */
const Registro = () => {
  // Estado para almacenar todos los datos del formulario de registro
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Estado para manejar los errores de validación de cada campo
  const [errores, setErrores] = useState({});
  
  // Estado para rastrear qué campos han sido tocados/visitados por el usuario
  const [tocado, setTocado] = useState({});
  
  // Estado para almacenar información detallada sobre la fortaleza de la contraseña
  const [passwordInfo, setPasswordInfo] = useState(null);
  
  // Estado para controlar cuándo mostrar el componente de fortaleza de contraseña
  const [mostrarPasswordStrength, setMostrarPasswordStrength] = useState(false);
  
  // Hook para navegación programática entre rutas
  const navigate = useNavigate();

  // Usar el hook personalizado del Context para obtener funciones y estados
  const { 
    registrar, 
    cargandoRegistro, 
    error, 
    limpiarError 
  } = useAuth();

  /**
   * Maneja los cambios en todos los campos del formulario de registro
   * 
   * Esta función se ejecuta cada vez que el usuario escribe en cualquier campo.
   * Además de actualizar el estado, realiza validaciones en tiempo real para
   * la contraseña y confirmación de contraseña.
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

    // Validación especial en tiempo real para el campo de contraseña
    if (name === 'password') {
      // Obtener información detallada sobre la fortaleza de la contraseña
      const passwordValidacion = validarPassword(value);
      setPasswordInfo(passwordValidacion);
      
      // Mostrar el indicador de fortaleza solo cuando hay texto en el campo
      setMostrarPasswordStrength(value.length > 0);
    }

    // Validación en tiempo real para confirmar contraseña
    // Se ejecuta tanto cuando cambia la contraseña como cuando cambia la confirmación
    if (name === 'confirmPassword' || name === 'password') {
      // Determinar cuál contraseña usar para la comparación
      const passwordToCheck = name === 'password' ? value : formData.password;
      const confirmPasswordToCheck = name === 'confirmPassword' ? value : formData.confirmPassword;
      
      // Solo validar si el campo de confirmación ha sido tocado y tiene contenido
      if (confirmPasswordToCheck && tocado.confirmPassword) {
        const confirmValidacion = validarConfirmPassword(passwordToCheck, confirmPasswordToCheck);
        if (!confirmValidacion.valido) {
          setErrores(prev => ({ ...prev, confirmPassword: confirmValidacion.mensaje }));
        } else {
          // Limpiar error si las contraseñas coinciden
          setErrores(prev => ({ ...prev, confirmPassword: '' }));
        }
      }
    }
  };

  /**
   * Maneja la validación cuando el usuario sale de un campo (evento blur)
   * 
   * Esta función se ejecuta cuando el usuario hace clic fuera de un campo
   * o navega a otro campo. Realiza validaciones específicas según el tipo
   * de campo y puede hacer llamadas asíncronas para validaciones adicionales.
   * 
   * @param {Event} e - Evento blur del input
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    // Marcar el campo como tocado para habilitar la visualización de errores
    setTocado(prev => ({ ...prev, [name]: true }));

    // Validar campo individual según su tipo usando switch para mejor legibilidad
    switch (name) {
      case 'nombre':
        // Validar formato y longitud del nombre
        const nombreValidacion = validarNombre(value);
        if (!nombreValidacion.valido) {
          setErrores(prev => ({ ...prev, nombre: nombreValidacion.mensaje }));
        }
        break;
      
      case 'apellido':
        // Validar formato y longitud del apellido
        const apellidoValidacion = validarApellido(value);
        if (!apellidoValidacion.valido) {
          setErrores(prev => ({ ...prev, apellido: apellidoValidacion.mensaje }));
        }
        break;
        
      case 'email':
        // Validar formato del email
        const emailValidacion = validarEmail(value);
        if (!emailValidacion.valido) {
          setErrores(prev => ({ ...prev, email: emailValidacion.mensaje }));
        }
        // Nota: La validación de email duplicado se hace en el backend
        break;
        
      case 'password':
        // Validar fortaleza de la contraseña
        const passwordValidacion = validarPassword(value);
        if (!passwordValidacion.valido) {
          setErrores(prev => ({ ...prev, password: passwordValidacion.mensaje }));
        }
        break;
        
      case 'confirmPassword':
        // Validar que las contraseñas coincidan
        const confirmValidacion = validarConfirmPassword(formData.password, value);
        if (!confirmValidacion.valido) {
          setErrores(prev => ({ ...prev, confirmPassword: confirmValidacion.mensaje }));
        }
        break;
    }
  };

  /**
   * Maneja el envío del formulario de registro
   * 
   * Esta función coordina todo el proceso de registro:
   * - Validación final de todos los campos
   * - Comunicación con el backend
   * - Manejo de respuestas exitosas y errores
   * - Limpieza del formulario y redirección
   * 
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    // Prevenir el comportamiento por defecto del formulario (recarga de página)
    e.preventDefault();
    
    // Realizar validación completa del formulario antes de enviar
    const validacion = validarFormularioRegistro(formData);
    
    // Si hay errores de validación, mostrarlos y detener el proceso
    if (!validacion.valido) {
      setErrores(validacion.errores);
      // Marcar todos los campos como tocados para mostrar errores
      setTocado({ nombre: true, apellido: true, email: true, password: true, confirmPassword: true });
      return;
    }

    // Limpiar estados anteriores
    setErrores({});
    limpiarError();

    try {
      // Usar la función registrar del Context
      const resultado = await registrar({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password
        // ACLARACION IMPORTANTE A TENER EN CUENTA: confirmPassword no se envía al backend, solo se usa para validación en frontend
      });
      
      if (resultado.success) {
        // Registro exitoso: limpiar formulario
        setFormData({
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Limpiar estados relacionados con la contraseña
        setPasswordInfo(null);
        setMostrarPasswordStrength(false);
        
        // Redirigir al login después de mostrar el mensaje
        setTimeout(() => {
          navigate('/login');
        }, 1000);
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
        <h2 className="auth-title">Crear Cuenta</h2>
        
        {/* Formulario principal de registro */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* Campo de nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errores.nombre ? 'error' : ''}`}
              placeholder="Tu nombre"
              required
            />
            {/* Mostrar mensaje de error específico para el nombre */}
            {errores.nombre && <span className="error-message">{errores.nombre}</span>}
          </div>

          {/* Campo de apellido */}
          <div className="form-group">
            <label htmlFor="apellido" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errores.apellido ? 'error' : ''}`}
              placeholder="Tu apellido"
              required
            />
            {/* Mostrar mensaje de error específico para el apellido */}
            {errores.apellido && <span className="error-message">{errores.apellido}</span>}
          </div>

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
            {/* Mostrar mensaje de error específico para el email */}
            {errores.email && <span className="error-message">{errores.email}</span>}
          </div>

          {/* Campo de contraseña con indicador de fortaleza */}
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
              onBlur={handleBlur}
              className={`form-input ${errores.password ? 'error' : ''}`}
              placeholder="••••••••"
              required
            />
            {/* Mostrar mensaje de error específico para la contraseña */}
            {errores.password && <span className="error-message">{errores.password}</span>}
            
            {/* Componente que muestra la fortaleza de la contraseña en tiempo real */}
            <PasswordStrength 
              passwordInfo={passwordInfo} 
              mostrar={mostrarPasswordStrength} 
            />
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errores.confirmPassword ? 'error' : ''}`}
              placeholder="••••••••"
              required
            />
            {/* Mostrar mensaje de error específico para la confirmación */}
            {errores.confirmPassword && <span className="error-message">{errores.confirmPassword}</span>}
          </div>

          {/* Botón de envío con estado de carga dinámico */}
          <button type="submit" className="auth-button" disabled={cargandoRegistro}>
            {cargandoRegistro ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Área para mostrar mensajes de error del Context */}
        {error && (
          <div className="mensaje error">
            {error}
          </div>
        )}

        {/* Enlace para usuarios que ya tienen cuenta */}
        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Registro;
