// ========================================
// CONFIGURACIÓN DE LA API - SPRING BOOT
// ========================================
// URL base del backend Spring Boot
const API_URL = 'http://localhost:8080';

/**
 * Función helper para hacer peticiones HTTP a la API
 * 
 * Maneja automáticamente:
 * - Inclusión del token JWT en peticiones autenticadas
 * - Headers de Content-Type
 * - Manejo de errores HTTP
 * 
 * @param {string} endpoint - Ruta del endpoint (ej: '/api/auth/login')
 * @param {Object} options - Opciones de fetch (method, body, headers, etc.)
 * @param {boolean} requiresAuth - Si true, incluye el token JWT en el header
 * @returns {Promise} - Respuesta parseada o texto plano
 */
export const apiRequest = async (endpoint, options = {}, requiresAuth = false) => {
  try {
    // Preparar headers base
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Si la petición requiere autenticación, agregar el token JWT
    if (requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Realizar la petición
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Manejar errores HTTP
    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      } catch (e) {
        // Si no se puede leer el error, usar el mensaje genérico
      }
      throw new Error(errorMessage);
    }

    // Intentar parsear como JSON, si falla devolver como texto
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }

  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================

/**
 * Iniciar sesión con el backend de Spring Boot
 * 
 * Endpoint: POST /api/auth/login
 * Body: { email, password }
 * Respuesta: Token JWT como string plano
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} - { success: boolean, token?: string, usuario?: object, message: string }
 */
export const iniciarSesion = async (email, password) => {
  try {
    // Preparar los datos según el DTO LoginRequest de Spring Boot
    const loginData = {
      email: email.toLowerCase().trim(),
      password: password
    };

    // Realizar petición al endpoint de login
    // El backend devuelve el token JWT como texto plano
    const token = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });

    // Extraer el email del token JWT (payload)
    // El JWT tiene 3 partes separadas por puntos: header.payload.signature
    let emailFromToken = email;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      emailFromToken = payload.sub || email; // 'sub' es el subject (username/email)
    } catch (e) {
      console.error('No se pudo extraer info del token, usando email del login');
    }

    return {
      success: true,
      token: token,
      usuario: {
        email: emailFromToken,
      },
      message: 'Inicio de sesión exitoso'
    };

  } catch (error) {
    // Manejar diferentes tipos de errores del backend
    let errorMessage = 'Error al iniciar sesión';
    
    if (error.message.includes('401')) {
      errorMessage = 'Email o contraseña incorrectos';
    } else if (error.message.includes('403')) {
      errorMessage = 'Acceso denegado';
    } else if (error.message.includes('500')) {
      errorMessage = 'Error del servidor. Intenta más tarde';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que esté funcionando';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

/**
 * Registrar nuevo usuario en el backend de Spring Boot
 * 
 * Endpoint: POST /api/auth/register
 * Body: { nombre, apellido, email, password }
 * Respuesta: "User registered successfully" (texto plano)
 * 
 * @param {Object} datosUsuario - Datos del usuario a registrar
 * @param {string} datosUsuario.nombre - Nombre del usuario
 * @param {string} datosUsuario.apellido - Apellido del usuario
 * @param {string} datosUsuario.email - Email del usuario
 * @param {string} datosUsuario.password - Contraseña del usuario
 * @returns {Object} - { success: boolean, message: string }
 */
export const registrarUsuario = async (datosUsuario) => {
  try {
    // Preparar los datos según el DTO RegisterRequest de Spring Boot
    const registerData = {
      nombre: datosUsuario.nombre.trim(),
      apellido: datosUsuario.apellido.trim(),
      email: datosUsuario.email.toLowerCase().trim(),
      password: datosUsuario.password
    };

    // Realizar petición al endpoint de registro
    // El backend devuelve "User registered successfully" como texto plano
    const mensaje = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });

    return {
      success: true,
      message: mensaje || 'Usuario registrado exitosamente'
    };

  } catch (error) {
    // Manejar diferentes tipos de errores del backend
    let errorMessage = 'Error al registrar usuario';
    
    if (error.message.includes('Email already exists') || 
        error.message.includes('already exists') ||
        error.message.includes('ya existe')) {
      errorMessage = 'Este email ya está registrado';
    } else if (error.message.includes('400')) {
      errorMessage = 'Datos inválidos. Verifica la información ingresada';
    } else if (error.message.includes('500')) {
      errorMessage = 'Error del servidor. Intenta más tarde';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica que esté funcionando';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Verificar si el servidor Spring Boot está disponible
 * 
 * Hace una petición simple para verificar conectividad
 * 
 * @returns {boolean} - true si el servidor responde, false en caso contrario
 */
export const verificarServidor = async () => {
  try {
    await fetch(`${API_URL}/api/auth/login`, { 
      method: 'OPTIONS' 
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Obtener información del usuario desde el token JWT
 * 
 * Decodifica el payload del token para extraer información básica
 * No valida la firma del token (eso lo hace el backend)
 * 
 * @returns {Object|null} - Información del usuario o null si no hay token
 */
export const obtenerInfoUsuarioDesdeToken = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    // Decodificar el payload del JWT (segunda parte del token)
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    
    return {
      email: payload.sub, // El 'sub' (subject) normalmente contiene el email/username
      roles: payload.roles || payload.authorities || payload.role || [], // Los roles/authorities del usuario
      exp: payload.exp, // Timestamp de expiración
    };
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
};

/**
 * Verificar si el token JWT ha expirado
 * 
 * @returns {boolean} - true si el token está expirado o no existe
 */
export const tokenExpirado = () => {
  try {
    const info = obtenerInfoUsuarioDesdeToken();
    if (!info || !info.exp) return true;

    // Convertir el timestamp de segundos a milisegundos
    const expiracion = info.exp * 1000;
    return Date.now() >= expiracion;
  } catch (error) {
    return true;
  }
};

