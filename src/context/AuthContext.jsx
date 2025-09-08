/**
 * AuthContext - Context Provider para Autenticación
 * 
 * Este archivo contiene la implementación del contexto de autenticación
 * usando únicamente React hooks básicos (useState, useEffect, useContext).
 * Proporciona estado global para manejar la autenticación del usuario.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { iniciarSesion, registrarUsuario } from '../services/authService';

// Crear el contexto de autenticación
const AuthContext = createContext();

/**
 * AuthProvider - Proveedor del contexto de autenticación
 * 
 * Este componente envuelve la aplicación y proporciona el estado
 * global de autenticación a todos los componentes hijos.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export const AuthProvider = ({ children }) => {
  // Estado para almacenar los datos del usuario autenticado
  const [usuario, setUsuario] = useState(null);
  
  // Estado para controlar si el usuario está autenticado
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  
  // Estado para controlar la carga durante el login
  const [cargandoLogin, setCargandoLogin] = useState(false);
  
  // Estado para controlar la carga durante el registro
  const [cargandoRegistro, setCargandoRegistro] = useState(false);
  
  // Estado para manejar errores
  const [error, setError] = useState('');

  /**
   * useEffect para verificar si hay una sesión guardada al iniciar la aplicación
   * Se ejecuta una sola vez cuando el componente se monta
   */
  useEffect(() => {
    // Intentar recuperar los datos del usuario desde localStorage
    const tokenGuardado = localStorage.getItem('authToken');
    const usuarioGuardado = localStorage.getItem('authUser');
    
    // Si hay datos guardados, restaurar la sesión
    if (tokenGuardado && usuarioGuardado) {
      try {
        const datosUsuario = JSON.parse(usuarioGuardado);
        setUsuario(datosUsuario);
        setEstaAutenticado(true);
      } catch (error) {
        // Si hay error al parsear, limpiar los datos corruptos
        console.error('Error al recuperar datos del usuario:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, []); // Array vacío significa que solo se ejecuta una vez

  /**
   * Función para manejar el inicio de sesión
   * 
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Object} - Resultado de la operación
   */
  const login = async (email, password) => {
    // Activar estado de carga
    setCargandoLogin(true);
    setError('');
    
    try {
      // Llamar al servicio de autenticación
      const resultado = await iniciarSesion(email, password);
      
      if (resultado.success) {
        // Si el login es exitoso, guardar los datos
        setUsuario(resultado.usuario);
        setEstaAutenticado(true);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('authToken', resultado.token);
        localStorage.setItem('authUser', JSON.stringify(resultado.usuario));
        
        return { success: true, mensaje: 'Inicio de sesión exitoso' };
      } else {
        // Si hay error, mostrar el mensaje
        setError(resultado.message);
        return { success: false, mensaje: resultado.message };
      }
    } catch (error) {
      // Manejar errores de conexión
      const mensajeError = 'Error de conexión. Verifica que el servidor esté funcionando.';
      setError(mensajeError);
      return { success: false, mensaje: mensajeError };
    } finally {
      // Siempre desactivar el estado de carga
      setCargandoLogin(false);
    }
  };

  /**
   * Función para manejar el registro de usuarios
   * 
   * @param {Object} datosUsuario - Datos del nuevo usuario
   * @returns {Object} - Resultado de la operación
   */
  const registrar = async (datosUsuario) => {
    // Activar estado de carga
    setCargandoRegistro(true);
    setError('');
    
    try {
      // Llamar al servicio de registro
      const resultado = await registrarUsuario(datosUsuario);
      
      if (resultado.success) {
        // Si el registro es exitoso
        return { success: true, mensaje: 'Usuario registrado exitosamente' };
      } else {
        // Si hay error, mostrar el mensaje
        setError(resultado.message);
        return { success: false, mensaje: resultado.message };
      }
    } catch (error) {
      // Manejar errores de conexión
      const mensajeError = 'Error de conexión. Verifica que el servidor esté funcionando.';
      setError(mensajeError);
      return { success: false, mensaje: mensajeError };
    } finally {
      // Siempre desactivar el estado de carga
      setCargandoRegistro(false);
    }
  };

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    // Limpiar todos los estados
    setUsuario(null);
    setEstaAutenticado(false);
    setError('');
    
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  /**
   * Función para limpiar errores
   */
  const limpiarError = () => {
    setError('');
  };

  // Objeto con todos los valores que se compartirán a través del contexto
  const valorContexto = {
    // Estados
    usuario,
    estaAutenticado,
    cargandoLogin,
    cargandoRegistro,
    error,
    
    // Funciones
    login,
    registrar,
    logout,
    limpiarError
  };

  return (
    <AuthContext.Provider value={valorContexto}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de autenticación
 * 
 * Este hook simplifica el uso del contexto y proporciona
 * una interfaz limpia para acceder a los datos de autenticación.
 * 
 * @returns {Object} - Estados y funciones del contexto de autenticación
 */
export const useAuth = () => {
  // Obtener el contexto
  const contexto = useContext(AuthContext);
  
  // Verificar que el hook se esté usando dentro del provider
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return contexto;
};
