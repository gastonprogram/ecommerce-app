/**
 * Componente Registro
 * 
 * Este componente maneja el formulario de registro de nuevos usuarios.
 * Incluye validación en tiempo real, verificación de fortaleza de contraseña,
 * comprobación de emails duplicados y manejo completo de errores y estados.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  validarFormularioRegistro, 
  validarEmail, 
  validarNombre, 
  validarPassword, 
  validarConfirmPassword 
} from '../../utils/validaciones';
import { registrarUsuario, verificarEmailExistente } from '../../services/authService';
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
  
  // Estado para controlar el indicador de carga durante el registro
  const [cargando, setCargando] = useState(false);
  
  // Estado para mostrar mensajes de éxito o error al usuario
  const [mensaje, setMensaje] = useState('');
  
  // Hook para navegación programática entre rutas
  const navigate = useNavigate();

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
        
      case 'email':
        // Validar formato del email
        const emailValidacion = validarEmail(value);
        if (!emailValidacion.valido) {
          setErrores(prev => ({ ...prev, email: emailValidacion.mensaje }));
        } else {
          // Si el formato es válido, verificar si el email ya existe en la base de datos
          // Esta es una validación asíncrona adicional
          verificarEmailExistente(value).then(existe => {
            // Solo mostrar error si el campo sigue siendo el activo (evitar race conditions)
            if (existe && tocado.email) {
              setErrores(prev => ({ ...prev, email: 'Este email ya está registrado' }));
            }
          }).catch(() => {
            // Ignorar errores de conexión en esta validación opcional
            // La validación definitiva se hará en el submit
          });
        }
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
      setTocado({ nombre: true, email: true, password: true, confirmPassword: true });
      return;
    }

    // Limpiar estados anteriores y activar indicador de carga
    setErrores({});
    setMensaje('');
    setCargando(true);

    try {
      // Intentar registrar el usuario con los datos del formulario
      const resultado = await registrarUsuario({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password
        // Nota: confirmPassword no se envía al backend, solo se usa para validación en frontend
      });
      
      if (resultado.success) {
        // Registro exitoso: mostrar mensaje y limpiar formulario
        setMensaje(resultado.message);
        console.log('Usuario registrado:', resultado.usuario);
        
        // Resetear completamente el formulario a su estado inicial
        setFormData({
          nombre: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Limpiar estados relacionados con la contraseña
        setPasswordInfo(null);
        setMostrarPasswordStrength(false);
        
        // Redirigir al login después de 2 segundos para que el usuario vea el mensaje
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } else {
        // Registro fallido: mostrar mensaje de error del servidor
        setMensaje(resultado.message);
      }
    } catch (error) {
      // Error de conexión o del servidor: mostrar mensaje genérico
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
        <h2 className="auth-title">Crear Cuenta</h2>
        
        {/* Formulario principal de registro */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* Campo de nombre completo */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errores.nombre ? 'error' : ''}`}
              placeholder="Tu nombre completo"
              required
            />
            {/* Mostrar mensaje de error específico para el nombre */}
            {errores.nombre && <span className="error-message">{errores.nombre}</span>}
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
          <button type="submit" className="auth-button" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        {/* Área para mostrar mensajes de éxito o error */}
        {mensaje && (
          <div className={`mensaje ${mensaje.includes('exitoso') ? 'success' : 'error'}`}>
            {mensaje}
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
