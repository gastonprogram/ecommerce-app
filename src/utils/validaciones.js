// Validaciones para los formularios de autenticación

// Validar email
export const validarEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valido: false, mensaje: 'El email es obligatorio' };
  if (!emailRegex.test(email)) return { valido: false, mensaje: 'Email inválido' };
  return { valido: true, mensaje: '' };
};


// Validar nombre
export const validarNombre = (nombre) => {
  if (!nombre) return { valido: false, mensaje: 'El nombre es obligatorio' };
  if (nombre.length < 2) return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
  if (nombre.length > 50) return { valido: false, mensaje: 'El nombre no puede exceder 50 caracteres' };
  
  // Solo letras, espacios y algunos caracteres especiales
  const nombreRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]+$/;
  if (!nombreRegex.test(nombre)) return { valido: false, mensaje: 'El nombre solo puede contener letras' };
  
  return { valido: true, mensaje: '' };
};

// Validar fortaleza de contraseña
export const validarPassword = (password) => {
  const validaciones = {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /\d/.test(password),
    especial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const cumplidas = Object.values(validaciones).filter(Boolean).length;
  
  let fortaleza = 'muy-debil';
  let mensaje = '';
  let valido = false;

  if (cumplidas >= 4) {
    fortaleza = 'fuerte';
    mensaje = 'Contraseña fuerte';
    valido = true;
  } else if (cumplidas >= 3) {
    fortaleza = 'media';
    mensaje = 'Contraseña moderada';
    valido = true;
  } else if (cumplidas >= 2) {
    fortaleza = 'debil';
    mensaje = 'Contraseña débil';
    valido = false;
  } else {
    fortaleza = 'muy-debil';
    mensaje = 'Contraseña muy débil';
    valido = false;
  }

  return {
    valido,
    fortaleza,
    mensaje,
    requisitos: {
      longitud: { cumple: validaciones.longitud, texto: 'Mínimo 8 caracteres' },
      mayuscula: { cumple: validaciones.mayuscula, texto: 'Una letra mayúscula' },
      minuscula: { cumple: validaciones.minuscula, texto: 'Una letra minúscula' },
      numero: { cumple: validaciones.numero, texto: 'Un número' },
      especial: { cumple: validaciones.especial, texto: 'Un carácter especial (!@#$%^&*)' }
    }
  };
};

// Validar confirmación de contraseña
export const validarConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { valido: false, mensaje: 'Confirma tu contraseña' };
  if (password !== confirmPassword) return { valido: false, mensaje: 'Las contraseñas no coinciden' };
  return { valido: true, mensaje: 'Las contraseñas coinciden' };
};

// Validar formulario completo de login
export const validarFormularioLogin = (formData) => {
  const errores = {};
  
  const emailValidacion = validarEmail(formData.email);
  if (!emailValidacion.valido) errores.email = emailValidacion.mensaje;
  
  if (!formData.password) errores.password = 'La contraseña es obligatoria';
  
  return {
    valido: Object.keys(errores).length === 0,
    errores
  };
};

// Validar formulario completo de registro
export const validarFormularioRegistro = (formData) => {
  const errores = {};
  
  const nombreValidacion = validarNombre(formData.nombre);
  if (!nombreValidacion.valido) errores.nombre = nombreValidacion.mensaje;
  
  const emailValidacion = validarEmail(formData.email);
  if (!emailValidacion.valido) errores.email = emailValidacion.mensaje;
  
  const passwordValidacion = validarPassword(formData.password);
  if (!passwordValidacion.valido) errores.password = passwordValidacion.mensaje;
  
  const confirmPasswordValidacion = validarConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmPasswordValidacion.valido) errores.confirmPassword = confirmPasswordValidacion.mensaje;
  
  return {
    valido: Object.keys(errores).length === 0,
    errores,
    passwordInfo: passwordValidacion
  };
};
