# 🛒 E-commerce App – UADE

Proyecto de e-commerce realizado en **React**, desarrollado como parte de la materia **Aplicaciones Interactivas** de la carrera **Desarrollo de Software en UADE**.

---

## 📚 Descripción

Esta aplicación simula una **tienda online moderna y funcional**, permitiendo a los usuarios:

- Navegar productos  
- Agregarlos al carrito  
- Finalizar compras con validación de stock  
- Usar cupones de descuento  

El objetivo principal es aplicar los conocimientos adquiridos en la materia, con foco en la experiencia de usuario, la interacción y el diseño de interfaces dinámicas.

---

## ⭐ Funcionalidades principales

- 🔍 Búsqueda y filtrado de productos por categoría  
- 🛒 Carrito persistente con gestión de cantidades  
- 💰 Sistema de cupones de descuento  
- 📦 Control de stock automático  
- 🔐 Autenticación de usuarios  
- ⚙️ Panel admin para gestión de productos  
- 🎨 Interfaz responsive y moderna  

---

## 🚀 Tecnologías utilizadas

- ⚛️ React 18 – Framework principal  
- ⚡ Vite 5 – Build tool y dev server  
- 🎨 CSS – Módulos y estilos propios  
- 🛣️ React Router DOM – Navegación  
- 📦 JSON Server – Simulación de backend  
- ✅ ESLint – Linting de código  

---

## 🗂️ Estructura del proyecto

ecommerce-app/
├── public/
│ └── assets/ # Logos e imágenes
├── src/
│ ├── componentes/ # Componentes reutilizables
│ │ ├── auth/ # Login y registro
│ │ ├── cart/ # Carrito (contexto y vistas)
│ │ ├── layout/ # Header, footer
│ │ └── products/ # Catálogo y formularios
│ ├── context/ # Contextos globales (auth, etc.)
│ ├── pages/ # Páginas principales (Home, Checkout, etc.)
│ ├── services/ # Servicios (API y lógica de negocio)
│ ├── App.jsx # Rutas principales
│ └── main.jsx # Punto de entrada
├── db.json # Base de datos local (JSON Server)
├── package.json
└── README.md

yaml
Copiar código

---

## 🖥️ Pantallas principales

- 🏠 **Home / Catálogo** → listado de productos y búsqueda  
- 📄 **Detalle de producto** → información ampliada + agregar al carrito  
- 🛒 **Carrito** → gestión de cantidades, cupones y total  
- 💳 **Checkout** → confirmación de compra, actualización de stock y limpieza automática del carrito  
- 🔐 **Admin** → gestión de productos (crear, editar, eliminar)  

---

## 📦 Instalación y ejecución

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/gastonprogram/ecommerce-app.git
   cd ecommerce-app
Instalar dependencias:

bash
Copiar código
npm install
Levantar el frontend:

bash
Copiar código
npm run dev
👉 Disponible en: http://localhost:5173

Levantar el backend simulado (JSON Server):

bash
Copiar código
npx json-server --watch db.json --port 3000
👉 Disponible en: http://localhost:3000

🛠️ Troubleshooting
⚠️ Puerto 5173 ocupado
Vite avisará y usará otro (ej: 5174). Accede a la URL que indique en consola.

⚠️ Puerto 3000 ocupado
JSON Server no iniciará. Cerrá la app que use ese puerto o elegí otro:

bash
Copiar código
npx json-server --watch db.json --port 3001
⚠️ Error “export default not found”
Revisar que los contextos (AuthProvider, CartProvider) estén exportados e importados correctamente.

⚠️ Problemas con dependencias
Si hay conflictos, reinstalar dependencias:

bash
Copiar código
rm -rf node_modules package-lock.json
npm install
👥 Equipo de desarrollo
Grupo 1 – Autenticación y Usuarios
Gastón Hirschbein → Login y registro

Máximo López → Manejo de sesiones y estado global

Grupo 2 – Catálogo y Productos
Valentina → Home y listados de productos

Luciano Verdini → Detalle de productos y categorías

Grupo 3 – Carrito y Compras
Santino Castro → Gestión del carrito de compras

Pedro Scotti → Proceso de checkout y finalización

Juan Licciardo → Alta y gestión de productos

🎓 Contexto académico
Este proyecto fue creado como trabajo práctico para la materia Aplicaciones Interactivas en la Universidad Argentina de la Empresa (UADE), poniendo en práctica conceptos de:

Desarrollo frontend con React

Gestión de estado global

Routing y navegación

Experiencia de usuario (UX/UI)

Trabajo colaborativo en equipo

💡 Próximas mejoras
🔗 Integración con un backend real y base de datos persistente

🔐 Autenticación completa con JWT

📱 Diseño responsive mejorado y modo oscuro

📊 Panel de administración más avanzado

🚀 Deploy en producción

💳 Integración con gateway de pagos

🤝 Autores
- **Pedro [PeppoScotti](https://github.com/PeppoScotti)**
- **Gaston [gastonprogram](https://github.com/gastonprogram)**
- **Santino [SantinoCastro](https://github.com/Gusabelu1)**
- **Maximo [MaximoLopezMelgarejo](https://github.com/maximolopezmelgarejo)**
- **Juan [JuanLi](https://github.com/Juanli255)**
- **Valentina [Valentina](https://github.com/deleonvalentina)** 
- **Luciano [lverdini](https://github.com/lverdini)**