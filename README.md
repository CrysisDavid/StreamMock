# CineStream

Sistema de gestión de películas estilo Netflix con autenticación de usuarios, favoritos, búsqueda en tiempo real y CRUD completo.

## 📋 Descripción

CineStream es una aplicación web full-stack que permite a los usuarios:
- 🎬 Crear, editar y eliminar películas
- ⭐ Marcar películas como favoritas
- 🔍 Buscar películas en tiempo real
- 👤 Autenticación y gestión de usuarios
- 📱 Diseño responsive estilo Netflix

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** - Build tool
- **Wouter** - Routing
- **TanStack Query** - Data fetching y caché
- **Axios** - HTTP client
- **Zustand** - State management
- **Tailwind CSS** - Estilos
- **shadcn/ui** - Componentes UI
- **Lucide React** - Iconos

### Backend
- **FastAPI** (Python) - API REST
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación

## 📁 Estructura del Proyecto

```
StreamViteTail/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilidades (API, auth, stores)
│   │   └── main.tsx       # Entry point
│   ├── public/            # Assets estáticos
│   └── index.html
├── server/                # Backend (si aplica)
├── shared/                # Código compartido
├── package.json
└── vite.config.ts
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ y npm
- PostgreSQL 14+
- Python 3.9+ (para el backend FastAPI)
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/CrysisDavid/StreamMock.git
cd StreamViteTail
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/cinestream

# Puerto del servidor
PORT=5000

# Backend API (si está separado)
VITE_API_URL=http://localhost:8000
```

### 3. Instalar Dependencias

```bash
# Instalar dependencias del frontend
npm install
```

### 4. Configurar la Base de Datos

```bash
# Ejecutar migraciones de Drizzle ORM
npm run db:push
```

### 5. Iniciar el Backend (FastAPI)

Asegúrate de tener el servidor FastAPI corriendo en `http://localhost:8000`

```bash
# En el directorio del backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 6. Iniciar el Frontend

```bash
# En modo desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor en modo producción

# Base de datos
npm run db:push      # Ejecuta migraciones de la base de datos

# Type checking
npm run check        # Verifica tipos de TypeScript
```

## 🔑 Funcionalidades Principales

### Autenticación
- Registro de usuarios
- Login con JWT tokens
- Sesión persistente con Zustand
- Protección de rutas

### Gestión de Películas
- **Crear**: Formulario completo con validación
- **Editar**: Actualizar información y subir imagen (solo una vez)
- **Eliminar**: Con confirmación
- **Listar**: Vista de películas creadas por el usuario

### Búsqueda
- Búsqueda en tiempo real con debounce
- Dropdown con resultados visuales
- Click directo a detalles de película

### Favoritos
- Marcar/desmarcar películas
- Lista personalizada de favoritos
- Sincronización con backend

### Vistas
- **Home**: Todas las películas con paginación
- **Recientes**: Películas más nuevas
- **Populares**: Películas más populares
- **Mi Lista**: Películas favoritas del usuario
- **Mis Películas**: Películas creadas por el usuario

## 🎨 Diseño

El proyecto utiliza un diseño inspirado en Netflix con:
- Tema oscuro (black → zinc-900)
- Gradientes sutiles
- Animaciones suaves
- Componentes responsive
- Efectos hover y elevación

## 🔐 Seguridad

- Tokens JWT para autenticación
- Refresh tokens para renovación automática
- Validación de formularios
- Protección de rutas en frontend
- Autenticación requerida para operaciones CRUD

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `GET /api/auth/me` - Obtener usuario actual
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios
- `POST /api/usuarios/` - Registrar usuario
- `GET /api/usuarios/{id}` - Obtener usuario

### Películas
- `GET /api/peliculas/` - Listar películas (paginado)
- `GET /api/peliculas/{id}` - Obtener película
- `POST /api/peliculas/` - Crear película
- `PUT /api/peliculas/{id}` - Actualizar película
- `DELETE /api/peliculas/{id}` - Eliminar película
- `GET /api/peliculas/buscar/` - Buscar películas
- `GET /api/peliculas/populares/top` - Películas populares
- `GET /api/peliculas/recientes/nuevas` - Películas recientes
- `GET /api/peliculas/usuario/{id}` - Películas por usuario

### Imágenes
- `POST /api/peliculas/{id}/imagen` - Subir imagen
- `DELETE /api/peliculas/{id}/imagen` - Eliminar imagen
- `GET /api/peliculas/imagen/{id}` - Obtener imagen

### Favoritos
- `GET /api/usuarios/{id}/favoritos` - Listar favoritos
- `POST /api/usuarios/{id}/favoritos/{movie_id}` - Agregar favorito
- `DELETE /api/usuarios/{id}/favoritos/{movie_id}` - Quitar favorito
- `GET /api/favoritos/verificar/{user_id}/{movie_id}` - Verificar favorito

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que PostgreSQL esté corriendo
- Asegúrate de que la variable `DATABASE_URL` esté configurada
- Revisa que el puerto 5000 esté disponible

### Errores de autenticación
- Limpia localStorage: `localStorage.clear()`
- Verifica que el backend esté corriendo en el puerto 8000
- Revisa las credenciales de usuario

### Las imágenes no se muestran
- Verifica que el backend esté sirviendo archivos estáticos
- Revisa que la ruta `/api/peliculas/imagen/{id}` esté funcionando
- Asegúrate de que las imágenes no excedan 50MB

## 👥 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**David Crysis**
- GitHub: [@CrysisDavid](https://github.com/CrysisDavid)
- Repositorio: [StreamMock](https://github.com/CrysisDavid/StreamMock)
- API: [API del proyecto](https://github.com/CrysisDavid/lp3-taller2)

## 🙏 Agradecimientos

- shadcn/ui por los componentes
- Lucide por los iconos
- La comunidad de React y Vite

