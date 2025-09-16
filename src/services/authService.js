// Configuración de la API
const API_URL = 'http://localhost:3000';

// Función helper para hacer peticiones
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Verificar si un email ya está registrado
export const verificarEmailExistente = async (email) => {
  try {
    const usuarios = await apiRequest(`/usuarios?email=${email}`);
    return usuarios.length > 0;
  } catch (error) {
    console.error('Error verificando email:', error);
    throw new Error('Error al verificar el email');
  }
};

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
  try {
    // Buscar usuario por email
    const usuarios = await apiRequest(`/usuarios?email=${email}`);
    
    if (usuarios.length === 0) {
      throw new Error('Email no registrado');
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    if (usuario.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    // Verificar si la cuenta está activa
    if (!usuario.activo) {
      throw new Error('Cuenta desactivada. Contacta al administrador');
    }

    // Generar token simple (sin guardar en db.json)
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
      token: token,
      message: 'Inicio de sesión exitoso'
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al iniciar sesión'
    };
  }
};

// Registrar nuevo usuario
export const registrarUsuario = async (datosUsuario) => {
  try {
    // Verificar si el email ya existe
    const emailExiste = await verificarEmailExistente(datosUsuario.email);
    
    if (emailExiste) {
      throw new Error('Este email ya está registrado');
    }

    // Obtener usuarios para calcular un ID secuencial como string
    let nuevoId = null;
    try {
      const usuarios = await apiRequest('/usuarios');
      const maxId = usuarios
        .map(u => {
          const n = Number(u.id);
          return Number.isFinite(n) ? n : 0;
        })
        .reduce((a, b) => Math.max(a, b), 0);
      nuevoId = String(maxId + 1);
    } catch (_) {
      // Fallback si no se puede obtener la lista: usar timestamp
      nuevoId = String(Date.now());
    }

    // Crear nuevo usuario con ID consistente (string)
    const nuevoUsuario = {
      id: nuevoId,
      nombre: datosUsuario.nombre.trim(),
      email: datosUsuario.email.toLowerCase().trim(),
      password: datosUsuario.password,
      fechaRegistro: new Date().toISOString(),
      activo: true
    };

    const usuarioCreado = await apiRequest('/usuarios', {
      method: 'POST',
      body: JSON.stringify(nuevoUsuario),
    });

    return {
      success: true,
      usuario: {
        id: usuarioCreado.id,
        nombre: usuarioCreado.nombre,
        email: usuarioCreado.email,
      },
      message: 'Usuario registrado exitosamente'
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || 'Error al registrar usuario'
    };
  }
};

// Obtener todos los usuarios (para testing/admin)
export const obtenerUsuarios = async () => {
  try {
    return await apiRequest('/usuarios');
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

// Verificar si el servidor está disponible
export const verificarServidor = async () => {
  try {
    await apiRequest('/usuarios?_limit=1');
    return true;
  } catch (error) {
    return false;
  }
};

