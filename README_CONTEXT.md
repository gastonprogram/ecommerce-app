# Context de Autenticación - Frontend E-commerce

## Descripción

Este proyecto implementa un sistema de autenticación usando **React Context** para compartir el estado de autenticación entre todos los componentes de la aplicación.

## Estructura del Context

### Archivos principales:

- `src/context/AuthContext.jsx` - Provider y Context de autenticación
- `src/App.jsx` - Aplicación envuelta con AuthProvider
- `src/componentes/auth/InicioSesion.jsx` - Componente de login usando Context
- `src/componentes/auth/Registro.jsx` - Componente de registro usando Context

## ¿Cómo funciona?

### 1. AuthContext.jsx

Este archivo contiene:

- **AuthProvider**: Componente que envuelve la aplicación
- **useAuth**: Hook personalizado para usar el contexto
- **Estados globales**: usuario, autenticación, carga, errores
- **Funciones**: login, registrar, logout, limpiarError

### 2. Estados disponibles

```javascript
const {
  // Estados
  usuario, // Datos del usuario logueado
  estaAutenticado, // Boolean - si está logueado
  cargandoLogin, // Boolean - cargando login
  cargandoRegistro, // Boolean - cargando registro
  error, // String - mensaje de error

  // Funciones
  login, // Función para hacer login
  registrar, // Función para registrar usuario
  logout, // Función para cerrar sesión
  limpiarError, // Función para limpiar errores
} = useAuth();
```

### 3. Configuración en App.jsx

```javascript
function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Envuelve toda la aplicación */}
      <Router>
        <Routes>
          <Route path="/login" element={<InicioSesion />} />
          <Route path="/register" element={<Registro />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

### 4. Uso en componentes

```javascript
// En cualquier componente
import { useAuth } from "../../context/AuthContext";

const MiComponente = () => {
  const { usuario, estaAutenticado, login, logout } = useAuth();

  // Ahora puedes usar estos estados y funciones
  if (estaAutenticado) {
    return <div>Bienvenido {usuario.nombre}</div>;
  }

  return <div>Por favor inicia sesión</div>;
};
```

## Beneficios del Context

1. **Estado Global**: El estado de autenticación se comparte automáticamente
2. **Evita Prop Drilling**: No necesitas pasar props entre componentes
3. **Persistencia**: Los datos se guardan en localStorage automáticamente
4. **Centralización**: Toda la lógica de auth está en un lugar
5. **Reutilización**: Cualquier componente puede acceder al estado de auth

## Próximos pasos

Para agregar el Context a nuevas páginas:

1. Importa el hook: `import { useAuth } from './context/AuthContext';`
2. Úsalo en el componente: `const { usuario, estaAutenticado } = useAuth();`
3. El componente ya tiene acceso al estado global de autenticación

## Ejemplo de protección de rutas

```javascript
const RutaProtegida = ({ children }) => {
  const { estaAutenticado } = useAuth();

  if (!estaAutenticado) {
    return <Navigate to="/login" />;
  }

  return children;
};

// En App.jsx
<Route
  path="/dashboard"
  element={
    <RutaProtegida>
      <Dashboard />
    </RutaProtegida>
  }
/>;
```

Este Context Provider te permitirá manejar la autenticación de manera simple y efectiva en todo tu proyecto universitario.
