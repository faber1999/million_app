# Million Web App - Prueba Técnica

Aplicación web desarrollada con React + TypeScript + Vite para la gestión de propiedades inmobiliarias con módulos públicos y administrativos.

## 🌐 Demo en Línea

**Aplicación Principal:** [https://million-app.fabergrajales.com](https://million-app.fabergrajales.com)

**API y Documentación:** [https://million-api.fabergrajales.dev/swagger/](https://million-api.fabergrajales.dev/swagger/)

**Resultados de Pruebas Backend:** [https://million-api.fabergrajales.dev/test-results/](https://million-api.fabergrajales.dev/test-results/)

## 🔐 Credenciales de Prueba

Para acceder a los módulos administrativos (Propiedades, Usuarios, Propietarios):

```
Usuario: test@gmail.com
Contraseña: abcd1234
```

## 🚀 Características

### Módulo Público

- Visualización de propiedades disponibles
- Filtros avanzados (nombre, dirección, rango de precios)
- Modal con detalles completos de cada propiedad
- Diseño responsive y optimizado

### Módulo Administrativo

- **Gestión de Propiedades**: CRUD completo con validaciones
- **Gestión de Usuarios**: Administración de usuarios del sistema
- **Gestión de Propietarios**: Control de propietarios de inmuebles
- Sistema de autenticación con JWT
- Manejo de roles y permisos

## 🛠 Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS 4.1
- **Estado**: Zustand + React Query
- **Routing**: React Router v7
- **Animaciones**: Framer Motion
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + TypeScript ESLint
- **Internacionalización**: i18next

## 📋 Comandos Disponibles

### Desarrollo

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo
pnpm run dev

# Build de producción
pnpm run build

# Preview del build
pnpm run preview
```

### Testing

```bash
# Ejecutar todas las pruebas
pnpm run test

# Interfaz interactiva de pruebas
pnpm run test:ui

# Cobertura de código
pnpm run test:coverage
```

### Calidad de Código

```bash
# Verificar linting
pnpm run lint
```

## 🧪 Visualizar Pruebas Frontend

Para explorar las pruebas unitarias e integración del frontend de forma interactiva:

```bash
pnpm run test:ui
```

Este comando abrirá una interfaz web donde podrás:

- Ver todas las pruebas organizadas por archivos
- Ejecutar pruebas individuales o en grupos
- Ver resultados en tiempo real
- Analizar cobertura de código
- Inspeccionar fallos detalladamente

## 📁 Estructura del Proyecto

```
src/
├── features/
│   ├── public/           # Módulo público (home, propiedades)
│   └── private/          # Módulos administrativos
├── shared/
│   ├── components/       # Componentes reutilizables
│   ├── stores/          # Estado global (Zustand)
│   ├── lib/             # Utilidades y configuraciones
│   └── router/          # Configuración de rutas
├── styles/              # Estilos globales (TailwindCSS)
└── test/               # Configuración y utilidades de testing
```

## 🔧 Configuración del Entorno

### Variables de Entorno

Crear un archivo `.env.local` con:

```env
VITE_BACKEND_URL=
```

### Requisitos

- Node.js 18+
- pnpm (recomendado) o npm

## 📊 Cobertura de Pruebas

El proyecto incluye pruebas exhaustivas para:

- ✅ Componentes de UI
- ✅ Hooks personalizados
- ✅ Servicios HTTP
- ✅ Utilidades y helpers
- ✅ Flujos de autenticación
- ✅ Gestión de estado

## 🔍 Funcionalidades Destacadas

### Rendimiento

- Lazy loading de rutas y componentes
- Optimización de bundle con Vite
- Cache inteligente con React Query
- Paginación infinita en listados

### UX/UI

- Diseño responsive mobile-first
- Animaciones fluidas con Framer Motion
- Feedback visual para todas las acciones
- Manejo elegante de estados de carga y error

### Seguridad

- Validación exhaustiva en frontend y backend
- Manejo seguro de tokens JWT
- Protección de rutas privadas
- Sanitización de datos de entrada

## 👨‍💻 Desarrollo

Este proyecto fue desarrollado como una prueba técnica completa, demostrando:

- Arquitectura escalable y mantenible
- Mejores prácticas de React y TypeScript
- Testing comprehensivo
- Código limpio y bien documentado
- Configuración profesional de herramientas de desarrollo

---

**Desarrollado por:** Faber Grajales  
**Repositorio:** [million_app](https://github.com/faber1999/million_app)
