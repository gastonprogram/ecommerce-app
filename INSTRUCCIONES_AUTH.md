# 🛡️ Sistema de Autenticación con JSON Server

## 📋 Usuarios de Prueba

Puedes usar estas credenciales para probar el sistema de login:

### ✅ Usuarios Activos:

- **Email:** `juan@email.com` | **Password:** `Juan123!`
- **Email:** `maria@email.com` | **Password:** `Maria456@`
- **Email:** `carlos@gmail.com` | **Password:** `Carlos789#`
- **Email:** `pedro@email.com` | **Password:** `Pedro555!`

### ❌ Usuario Inactivo:

- **Email:** `ana@hotmail.com` | **Password:** `Ana2024$` (cuenta desactivada)

## 🚀 Cómo Ejecutar

### Opción 1: Todo junto (Recomendado)

```bash
npm run dev:full
```

Esto ejecuta tanto el frontend (puerto 5173) como el backend mock (puerto 3001).

### Opción 2: Por separado

```bash
# Terminal 1 - Backend JSON Server
npm run server

# Terminal 2 - Frontend React
npm run dev
```

## 🔧 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Ver datos JSON:** http://localhost:3001/usuarios

## ✨ Funcionalidades Implementadas

### 🔐 Login:

- Validación de credenciales contra base de datos
- Verificación de cuenta activa
- Generación de token de sesión
- Almacenamiento en localStorage

### 📝 Registro:

- Validación de email único
- Validación de fortaleza de contraseña
- Creación de nuevo usuario
- Redirección automática al login

### 🛡️ Validaciones:

- Email: formato válido y existencia
- Contraseña: fortaleza (8+ chars, mayús, minus, número, especial)
- Nombre: 2-50 caracteres, solo letras
- Confirmación de contraseña: coincidencia

## 🗄️ Base de Datos (db.json)

```json
{
  "usuarios": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@email.com",
      "password": "Juan123!",
      "fechaRegistro": "2024-01-15T10:30:00.000Z",
      "activo": true
    }
    // ... más usuarios
  ],
  "sesiones": [
    // Tokens de sesión activos
  ]
}
```

## 🧪 Casos de Prueba

1. **Login exitoso:** Usa cualquier usuario activo
2. **Login fallido:** Usa email o contraseña incorrectos
3. **Cuenta desactivada:** Usa ana@hotmail.com
4. **Registro exitoso:** Crea un usuario con email nuevo
5. **Email duplicado:** Intenta registrarte con email existente
6. **Contraseña débil:** Prueba contraseñas que no cumplan los requisitos

## 🔍 Monitoreo

Puedes ver las peticiones al servidor en la consola donde ejecutaste `npm run server` y las respuestas en las DevTools del navegador.
