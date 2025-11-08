# 📚 API de Películas - Documentación para Frontend

## 🌟 Información General

**Base URL:** `http://localhost:8000`  
**Formato de respuesta:** JSON  
**Autenticación:** JWT Bearer Token (para endpoints protegidos)

---

## 📋 Índice de Endpoints

1. [🔐 Autenticación](#autenticación)
2. [👥 Usuarios](#usuarios)
3. [🎬 Películas](#películas)
4. [⭐ Favoritos](#favoritos)

---

## 🔐 Autenticación

### 🔑 Iniciar Sesión
**POST** `/api/auth/login`

#### Request Body:
```json
{
  "correo": "usuario@example.com",
  "contraseña": "password123"
}
```

#### Response (200):
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "expires_at": "2024-01-01T12:00:00Z",
  "user": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "usuario@example.com",
    "fecha_registro": "2024-01-01T10:00:00Z"
  }
}
```

#### Errors:
- **401**: Credenciales inválidas
- **422**: Datos de entrada inválidos

---

### 🔄 Renovar Token
**POST** `/api/auth/refresh`

#### Request Body:
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Response (200):
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "expires_at": "2024-01-01T12:00:00Z"
}
```

---

### ✅ Validar Token
**GET** `/api/auth/validate`

#### Headers:
```
Authorization: Bearer <access_token>
```

#### Response (200):
```json
{
  "valid": true,
  "user_id": 1,
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "expires_at": "2024-01-01T12:00:00Z"
}
```

---

### 👤 Obtener Usuario Actual
**GET** `/api/auth/me`

#### Headers:
```
Authorization: Bearer <access_token>
```

#### Response (200):
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "usuario@example.com",
  "fecha_registro": "2024-01-01T10:00:00Z"
}
```

---

### 🚪 Cerrar Sesión
**POST** `/api/auth/logout`

#### Headers:
```
Authorization: Bearer <access_token>
```

#### Response (200):
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 👥 Usuarios

### 📝 Crear Usuario
**POST** `/api/usuarios/`

#### Request Body:
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "contraseña": "password123",
  "confirmarContraseña": "password123"
}
```

#### Validaciones:
- **nombre**: 2-50 caracteres, solo letras, números y espacios
- **correo**: Formato de email válido, único en el sistema
- **contraseña**: Mínimo 8 caracteres, debe contener al menos 1 número y 1 letra
- **confirmarContraseña**: Debe coincidir con la contraseña

#### Response (201):
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "fecha_registro": "2024-01-01T10:00:00Z"
}
```

#### Errors:
- **400**: Email ya en uso
- **422**: Datos de validación incorrectos

---

### 📋 Listar Usuarios
**GET** `/api/usuarios/`

#### Query Parameters:
- `page` (opcional): Número de página (default: 1, mínimo: 1)
- `limit` (opcional): Elementos por página (default: 10, máximo: 100)

#### Example: `/api/usuarios/?page=2&limit=20`

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan.perez@email.com",
      "fecha_registro": "2024-01-01T10:00:00Z"
    }
  ],
  "total_records": 150,
  "current_pg": 2,
  "limit": 20,
  "pages": 8,
  "has_next": true,
  "has_prev": true,
  "next_page": 3,
  "prev_page": 1
}
```

---

### 👤 Obtener Usuario por ID
**GET** `/api/usuarios/{usuario_id}`

#### Path Parameters:
- `usuario_id`: ID del usuario (entero)

#### Response (200):
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "correo": "juan.perez@email.com",
  "fecha_registro": "2024-01-01T10:00:00Z"
}
```

#### Errors:
- **404**: Usuario no encontrado

---

### ✏️ Actualizar Usuario
**PUT** `/api/usuarios/{usuario_id}`

#### Headers:
```
Authorization: Bearer <access_token>
```

#### Path Parameters:
- `usuario_id`: ID del usuario

#### Request Body (todos los campos opcionales):
```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "nuevo.email@example.com",
  "contraseña": "newpassword123"
}
```

#### Response (200):
```json
{
  "id": 1,
  "nombre": "Juan Carlos Pérez",
  "correo": "nuevo.email@example.com",
  "fecha_registro": "2024-01-01T10:00:00Z"
}
```

#### Errors:
- **401**: Token inválido o faltante
- **403**: No autorizado para modificar este usuario
- **404**: Usuario no encontrado
- **400**: Email ya en uso

---

### 🗑️ Eliminar Usuario
**DELETE** `/api/usuarios/{usuario_id}`

#### Headers:
```
Authorization: Bearer <access_token>
```

#### Path Parameters:
- `usuario_id`: ID del usuario

#### Response (204): Sin contenido

#### Errors:
- **401**: Token inválido
- **403**: No autorizado
- **404**: Usuario no encontrado

---

### ⭐ Obtener Favoritos de Usuario
**GET** `/api/usuarios/{usuario_id}/favoritos`

#### Path Parameters:
- `usuario_id`: ID del usuario

#### Response (200):
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2024-01-01T10:00:00Z",
    "image_url": "/api/peliculas/imagen/1"
  }
]
```

---

### ➕ Marcar Película como Favorita
**POST** `/api/usuarios/{usuario_id}/favoritos/{pelicula_id}`

#### Path Parameters:
- `usuario_id`: ID del usuario
- `pelicula_id`: ID de la película

#### Response (201):
```json
{
  "message": "Película marcada como favorita exitosamente"
}
```

#### Errors:
- **400**: La película ya está marcada como favorita
- **404**: Usuario o película no encontrada

---

### ➖ Eliminar Película de Favoritos
**DELETE** `/api/usuarios/{usuario_id}/favoritos/{pelicula_id}`

#### Path Parameters:
- `usuario_id`: ID del usuario
- `pelicula_id`: ID de la película

#### Response (204): Sin contenido

#### Errors:
- **404**: Favorito no existe

---

## 🎬 Películas

### 🎭 Crear Película
**POST** `/api/peliculas/`

#### Request Body:
```json
{
  "titulo": "Inception",
  "director": "Christopher Nolan",
  "genero": "Ciencia Ficción, Acción",
  "duracion": 148,
  "año": 2010,
  "clasificacion": "PG-13",
  "sinopsis": "Un ladrón que roba secretos mediante tecnología de sueños..."
}
```

#### Validaciones:
- **titulo**: 1-200 caracteres, requerido
- **director**: 1-150 caracteres, requerido
- **genero**: 1-100 caracteres, requerido
- **duracion**: 1-600 minutos, requerido
- **año**: 1888-año actual, requerido
- **clasificacion**: G, PG, PG-13, R, NC-17, NR, ATP, +13, +16, +18
- **sinopsis**: 0-1000 caracteres, opcional

#### Response (201):
```json
{
  "id": 1,
  "titulo": "Inception",
  "director": "Christopher Nolan",
  "genero": "Ciencia Ficción, Acción",
  "duracion": 148,
  "año": 2010,
  "clasificacion": "PG-13",
  "sinopsis": "Un ladrón que roba secretos...",
  "fecha_creacion": "2024-01-01T10:00:00Z",
  "image_url": null
}
```

#### Errors:
- **400**: Ya existe una película con el mismo título y año
- **422**: Datos de validación incorrectos

---

### 📋 Listar Películas
**GET** `/api/peliculas/`

#### Query Parameters:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 5, máximo: 100)

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "titulo": "Inception",
      "director": "Christopher Nolan",
      "genero": "Ciencia Ficción",
      "duracion": 148,
      "año": 2010,
      "clasificacion": "PG-13",
      "sinopsis": "Un ladrón que roba secretos...",
      "fecha_creacion": "2024-01-01T10:00:00Z",
      "image_url": "/api/peliculas/imagen/1"
    }
  ],
  "total_records": 50,
  "current_pg": 1,
  "limit": 5,
  "pages": 10,
  "has_next": true,
  "has_prev": false,
  "next_page": 2,
  "prev_page": null
}
```

---

### 🎬 Obtener Película por ID
**GET** `/api/peliculas/{pelicula_id}`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Response (200):
```json
{
  "id": 1,
  "titulo": "Inception",
  "director": "Christopher Nolan",
  "genero": "Ciencia Ficción",
  "duracion": 148,
  "año": 2010,
  "clasificacion": "PG-13",
  "sinopsis": "Un ladrón que roba secretos...",
  "fecha_creacion": "2024-01-01T10:00:00Z",
  "image_url": "/api/peliculas/imagen/1"
}
```

#### Errors:
- **404**: Película no encontrada

---

### ✏️ Actualizar Película
**PUT** `/api/peliculas/{pelicula_id}`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Request Body (todos los campos opcionales):
```json
{
  "titulo": "Inception - Director's Cut",
  "sinopsis": "Nueva sinopsis actualizada..."
}
```

#### Response (200):
```json
{
  "id": 1,
  "titulo": "Inception - Director's Cut",
  "director": "Christopher Nolan",
  "genero": "Ciencia Ficción",
  "duracion": 148,
  "año": 2010,
  "clasificacion": "PG-13",
  "sinopsis": "Nueva sinopsis actualizada...",
  "fecha_creacion": "2024-01-01T10:00:00Z",
  "image_url": "/api/peliculas/imagen/1"
}
```

---

### 🗑️ Eliminar Película
**DELETE** `/api/peliculas/{pelicula_id}`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Response (204): Sin contenido

#### Errors:
- **404**: Película no encontrada

---

### 🔍 Buscar Películas
**GET** `/api/peliculas/buscar/`

#### Query Parameters (todos opcionales, se pueden combinar):
- `titulo`: Buscar por título (texto parcial)
- `director`: Buscar por director (texto parcial)
- `genero`: Buscar por género (texto parcial)
- `año`: Buscar por año exacto
- `año_min`: Año mínimo
- `año_max`: Año máximo

#### Example: `/api/peliculas/buscar/?titulo=inception&año_min=2000&año_max=2020`

#### Response (200):
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2024-01-01T10:00:00Z",
    "image_url": "/api/peliculas/imagen/1"
  }
]
```

---

### 🏆 Películas Populares
**GET** `/api/peliculas/populares/top`

#### Query Parameters:
- `limit` (opcional): Número de películas (default: 10, máximo: 50)

#### Response (200):
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2024-01-01T10:00:00Z",
    "image_url": "/api/peliculas/imagen/1"
  }
]
```

---

### 🎯 Películas por Clasificación
**GET** `/api/peliculas/clasificacion/{clasificacion}`

#### Path Parameters:
- `clasificacion`: G, PG, PG-13, R, NC-17

#### Query Parameters:
- `limit` (opcional): Elementos por página (default: 10, máximo: 100)

#### Response (200):
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2024-01-01T10:00:00Z",
    "image_url": "/api/peliculas/imagen/1"
  }
]
```

---

### 🆕 Películas Recientes
**GET** `/api/peliculas/recientes/nuevas`

#### Query Parameters:
- `limit` (opcional): Número de películas (default: 10, máximo: 100)

#### Response (200):
```json
[
  {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2024-01-01T10:00:00Z",
    "image_url": "/api/peliculas/imagen/1"
  }
]
```

---

## 📸 Gestión de Imágenes

### 📷 Obtener Imagen de Película
**GET** `/api/peliculas/imagen/{pelicula_id}`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Response (200): 
- **Content-Type**: `image/jpeg`
- **Headers**: 
  - `Content-Disposition: inline; filename=pelicula_{id}.jpg`
  - `Cache-Control: public, max-age=3600`

#### Errors:
- **404**: Película no encontrada o no tiene imagen

---

### 📤 Subir Imagen de Película
**POST** `/api/peliculas/{pelicula_id}/imagen`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Request Body (multipart/form-data):
```
image: <archivo_imagen>
```

#### Restricciones:
- **Tipos permitidos**: JPEG, PNG, JPG, WebP
- **Tamaño máximo**: 5MB

#### Response (201):
```json
{
  "message": "Imagen subida exitosamente",
  "image_url": "/api/peliculas/imagen/1",
  "pelicula_id": 1
}
```

#### Errors:
- **400**: Tipo de archivo no permitido o archivo muy grande
- **404**: Película no encontrada
- **500**: Error al procesar la imagen

#### Ejemplo en JavaScript:
```javascript
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('/api/peliculas/1/imagen', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

---

### 🗑️ Eliminar Imagen de Película
**DELETE** `/api/peliculas/{pelicula_id}/imagen`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Response (204): Sin contenido

#### Errors:
- **404**: Película no encontrada o no tiene imagen

---

## ⭐ Favoritos

### 📋 Listar Todos los Favoritos
**GET** `/api/favoritos/`

#### Query Parameters:
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, máximo: 100)

#### Response (200):
```json
{
  "items": [
    {
      "id": 1,
      "id_usuario": 1,
      "id_pelicula": 1,
      "fecha_marcado": "2024-01-01T10:00:00Z"
    }
  ],
  "total_records": 25,
  "current_pg": 1,
  "limit": 10,
  "pages": 3,
  "has_next": true,
  "has_prev": false,
  "next_page": 2,
  "prev_page": null
}
```

---

### ➕ Crear Favorito
**POST** `/api/favoritos/`

#### Request Body:
```json
{
  "id_usuario": 1,
  "id_pelicula": 1
}
```

#### Response (201):
```json
{
  "message": "Favorito creado exitosamente",
  "detail": "La película con ID 1 fue marcada como favorita para el usuario con ID 1"
}
```

#### Errors:
- **400**: El favorito ya existe
- **404**: Usuario o película no encontrada

---

### 👤 Obtener Favorito por ID
**GET** `/api/favoritos/{favorito_id}`

#### Path Parameters:
- `favorito_id`: ID del favorito

#### Response (200):
```json
{
  "id": 1,
  "id_usuario": 1,
  "id_pelicula": 1,
  "fecha_marcado": "2024-01-01T10:00:00Z",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "fecha_registro": "2024-01-01T09:00:00Z"
  },
  "pelicula": {
    "id": 1,
    "titulo": "Inception",
    "director": "Christopher Nolan",
    "genero": "Ciencia Ficción",
    "duracion": 148,
    "año": 2010,
    "clasificacion": "PG-13",
    "sinopsis": "Un ladrón que roba secretos...",
    "fecha_creacion": "2024-01-01T08:00:00Z",
    "image_url": "/api/peliculas/imagen/1"
  }
}
```

---

### 🗑️ Eliminar Favorito
**DELETE** `/api/favoritos/{favorito_id}`

#### Path Parameters:
- `favorito_id`: ID del favorito

#### Response (204): Sin contenido

#### Errors:
- **404**: Favorito no encontrado

---

### 👥 Favoritos por Usuario
**GET** `/api/favoritos/usuario/{usuario_id}`

#### Path Parameters:
- `usuario_id`: ID del usuario

#### Query Parameters:
- `limit` (opcional): Máximo de favoritos (default: 100)

#### Response (200):
```json
[
  {
    "id": 1,
    "id_usuario": 1,
    "id_pelicula": 1,
    "fecha_marcado": "2024-01-01T10:00:00Z",
    "usuario": {
      "id": 1,
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "fecha_registro": "2024-01-01T09:00:00Z"
    },
    "pelicula": {
      "id": 1,
      "titulo": "Inception",
      "director": "Christopher Nolan",
      "genero": "Ciencia Ficción",
      "duracion": 148,
      "año": 2010,
      "clasificacion": "PG-13",
      "sinopsis": "Un ladrón que roba secretos...",
      "fecha_creacion": "2024-01-01T08:00:00Z",
      "image_url": "/api/peliculas/imagen/1"
    }
  }
]
```

---

### 🎬 Favoritos por Película
**GET** `/api/favoritos/pelicula/{pelicula_id}`

#### Path Parameters:
- `pelicula_id`: ID de la película

#### Query Parameters:
- `limit` (opcional): Máximo de favoritos (default: 100)

#### Response (200): Mismo formato que favoritos por usuario

---

### ✅ Verificar Favorito
**GET** `/api/favoritos/verificar/{usuario_id}/{pelicula_id}`

#### Path Parameters:
- `usuario_id`: ID del usuario
- `pelicula_id`: ID de la película

#### Response (200):
```json
{
  "es_favorito": true,
  "favorito_id": 1,
  "fecha_marcado": "2024-01-01T10:00:00Z",
  "usuario_id": 1,
  "pelicula_id": 1
}
```

Si no es favorito:
```json
{
  "es_favorito": false,
  "favorito_id": null,
  "fecha_marcado": null,
  "usuario_id": 1,
  "pelicula_id": 1
}
```

---

## 🚨 Códigos de Error Comunes

### Códigos HTTP:
- **200**: OK - Solicitud exitosa
- **201**: Created - Recurso creado exitosamente
- **204**: No Content - Operación exitosa sin contenido
- **400**: Bad Request - Datos inválidos o lógica de negocio
- **401**: Unauthorized - Token inválido o faltante
- **403**: Forbidden - No autorizado para esta acción
- **404**: Not Found - Recurso no encontrado
- **422**: Unprocessable Entity - Errores de validación
- **500**: Internal Server Error - Error del servidor

### Formato de Error:
```json
{
  "error": true,
  "status_code": 404,
  "message": "Recurso no encontrado",
  "timestamp": "2024-01-01T10:00:00Z",
  "path": "/api/peliculas/999",
  "method": "GET"
}
```

---

## 📱 Ejemplos de Uso en Frontend

### Autenticación con Axios:
```javascript
// Login
const loginResponse = await axios.post('/api/auth/login', {
  correo: 'usuario@example.com',
  contraseña: 'password123'
});

const { access_token } = loginResponse.data;

// Configurar token para próximas requests
axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
```

### Paginación:
```javascript
// Obtener películas con paginación
const getPeliculas = async (page = 1, limit = 10) => {
  const response = await axios.get(`/api/peliculas/`, {
    params: { page, limit }
  });
  
  return response.data;
};
```

### Subir imagen:
```javascript
const subirImagen = async (peliculaId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await axios.post(
    `/api/peliculas/${peliculaId}/imagen`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  
  return response.data;
};
```

### Buscar películas:
```javascript
const buscarPeliculas = async (filtros) => {
  const response = await axios.get('/api/peliculas/buscar/', {
    params: filtros // { titulo: 'Inception', año_min: 2000 }
  });
  
  return response.data;
};
```

---

## 📋 Notas Importantes

1. **Autenticación**: Endpoints protegidos requieren header `Authorization: Bearer <token>`
2. **Paginación**: Siempre usar parámetros `page` y `limit` para listas grandes
3. **Imágenes**: URLs de imagen son generadas automáticamente cuando hay imagen disponible
4. **Validación**: Todos los campos tienen validaciones específicas, revisa los errores 422
5. **Cache**: Las imágenes tienen cache de 1 hora para mejor performance
6. **Límites**: Respetar límites de tamaño de archivo (5MB) y elementos por página (100)

---

**Última actualización**: Noviembre 2024  
**Versión de la API**: 1.0.0