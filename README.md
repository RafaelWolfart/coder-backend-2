# Sistema de Autenticación y CRUD de Usuarios - Backend

Aplicación backend completa construida con **Node.js** y **Express** que implementa un sistema robusto de autenticación, autorización basada en roles, y CRUD de usuarios con MongoDB.

## 🎯 Características Principales

- ✅ **Autenticación JWT**: Sistema seguro con JSON Web Tokens
- ✅ **Encriptación de Contraseñas**: Bcrypt con 10 salts
- ✅ **Estrategias Passport**: LocalStrategy, JWTStrategy y CurrentStrategy
- ✅ **Autorización por Roles**: user, admin, moderator
- ✅ **CRUD Completo**: Usuarios, Estudiantes y Carritos
- ✅ **MongoDB**: Soporte para local y MongoDB Atlas
- ✅ **Validaciones**: Campos requeridos, emails únicos, formatos válidos
- ✅ **Manejo de Errores**: Respuestas claras y coherentes
- ✅ **Middleware de Logging**: Seguimiento de peticiones HTTP

## 📁 Estructura del Proyecto

```
server-backend-2/
├── config/
│   ├── db/
│   │   └── connect.config.js          # Conexión MongoDB (LOCAL/ATLAS)
│   ├── models/
│   │   ├── user.model.js              # Modelo Usuario (con bcrypt)
│   │   ├── cart.model.js              # Modelo Carrito
│   │   └── student.model.js           # Modelo Estudiante
│   ├── env.config.js                  # Config variables entorno
│   └── passport.config.js             # Estrategias Passport
├── middlewares/
│   ├── auth.middleware.js             # JWT Authentication
│   ├── role.middleware.js             # Role Authorization
│   └── logger.middleware.js           # HTTP Logging
├── routes/
│   ├── auth.router.js                 # /sessions - Auth endpoints
│   ├── user.router.js                 # /api/users - User CRUD
│   ├── student.router.js              # /api/students - Student CRUD
│   ├── home.router.js                 # Home endpoints
│   └── index.js                       # Router padre/principal
├── .env                               # Variables de entorno
├── .gitignore                         # Archivos ignorados
├── app.js                             # Entrada principal
├── test.js                            # Script de testing
├── package.json                       # Dependencias npm
└── README.md                          # Este archivo
```

## 🚀 Instalación y Configuración

### 1. Clonar Repositorio

```bash
git clone https://github.com/RafaelWolfart/coder-backend-2.git
cd server-backend-2
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/backend77080
MONGO_ATLAS_URL=mongodb+srv://user:password@cluster.mongodb.net/databasename
MONGO_TARGET=LOCAL
JWT_SECRET=tu_clave_secreta_super_segura_aqui_change_in_production
JWT_EXPIRE=24h
SECRET_SESSION=clave_secreta
NODE_ENV=development

# OAuth GitHub (opcional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=http://localhost:8000/api/auth/github/callback
```

### 4. Asegurar MongoDB está corriendo

**Windows:**

```bash
net start MongoDB
```

**Mac/Linux:**

```bash
brew services start mongodb-community
mongod
```

## ▶️ Ejecutar la Aplicación

**Modo Development** (con auto-reinicio):

```bash
npm run dev
```

**Modo Production:**

```bash
npm start
```

El servidor estará disponible en: `http://localhost:8000`

## 🧪 Testing

Ejecutar suite completa de testing:

```bash
node test.js
```

**Resultados esperados:**

- ✅ POST /sessions/register - Registrar nuevo usuario
- ✅ POST /sessions/login - Obtener token JWT
- ✅ GET /sessions/current - Obtener usuario autenticado
- ✅ GET /api/users/:id - Obtener usuario por ID
- ✅ GET /api/users - Sin token, debe retornar 401
- ✅ GET /ruta-inexistente - Debe retornar 404
- ✅ POST /sessions/register - Rechazar email duplicado

## 📚 API Endpoints

### Autenticación (`/sessions`)

#### Registrar Usuario

```http
POST /sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "password123"
}

Response (201):
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "_id": "...",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@example.com",
    "age": 25,
    "role": "user",
    "cart": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Login

```http
POST /sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "password123"
}

Response (200):
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "first_name": "Juan",
    "email": "juan@example.com",
    ...
  }
}
```

#### Obtener Usuario Actual

```http
GET /sessions/current
Authorization: Bearer <tu_token_jwt>

Response (200):
{
  "message": "Usuario actual obtenido",
  "user": {
    "_id": "...",
    "first_name": "Juan",
    "email": "juan@example.com",
    ...
  }
}
```

### Usuarios (`/api/users`)

#### Obtener Todos (Solo Admin)

```http
GET /api/users
Authorization: Bearer <token_admin>

Response (200):
{
  "message": "Usuarios obtenidos exitosamente",
  "users": [...]
}
```

#### Obtener por ID

```http
GET /api/users/:id
Authorization: Bearer <token_jwt>

Response (200):
{
  "message": "Usuario obtenido exitosamente",
  "user": {...}
}
```

#### Crear Usuario (Solo Admin)

```http
POST /api/users
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "first_name": "María",
  "last_name": "García",
  "email": "maria@example.com",
  "age": 30,
  "password": "securepass123",
  "role": "user"
}

Response (201)
```

#### Actualizar Usuario

```http
PUT /api/users/:id
Authorization: Bearer <token_jwt>
Content-Type: application/json

{
  "first_name": "María",
  "age": 31
}

Response (200)
```

#### Eliminar Usuario (Solo Admin)

```http
DELETE /api/users/:id
Authorization: Bearer <token_admin>

Response (200)
```

### Estudiantes (`/api/students`)

#### Obtener Todos

```http
GET /api/students
Authorization: Bearer <token_jwt>

Response (200)
```

#### Crear Estudiante (Solo Admin)

```http
POST /api/students
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "name": "Carlos López",
  "email": "carlos@example.com",
  "age": 20
}
```

#### Actualizar Estudiante (Solo Admin)

```http
PUT /api/students/:id
Authorization: Bearer <token_admin>
```

#### Eliminar Estudiante (Solo Admin)

```http
DELETE /api/students/:id
Authorization: Bearer <token_admin>
```

## 📋 Modelo de Usuario

```javascript
{
  _id: ObjectId,
  first_name: String (requerido),
  last_name: String (requerido),
  email: String (requerido, único, validación email),
  age: Number (requerido),
  password: String (requerido, encriptado con bcrypt),
  cart: ObjectId (referencia a Cart),
  role: String (enum: ['user','admin','moderator'], default: 'user'),
  createdAt: Date (timestamp automático),
  updatedAt: Date (timestamp automático)
}
```

## 🔐 Seguridad

### Encriptación de Contraseña

- **Algoritmo**: bcrypt
- **Salts**: 10
- **Método**: Automático en middleware pre('save')
- **Comparación**: Método seguro `comparePassword()`

### JWT (JSON Web Tokens)

- **Firma**: Con JWT_SECRET del .env
- **Expiración**: 24 horas (configurable)
- **Extracción**: Header `Authorization: Bearer <token>`

### Validaciones

- Email único en la BD
- Formato email válido regex
- Contraseña nunca se devuelve en respuestas
- Passwords hasheadas almacenadas en BD

## 👥 Sistema de Roles

### User (por defecto)

- Ver su propio perfil
- Editar su propio perfil
- Ver estudiantes

### Admin

- Ver todos los usuarios
- Crear, editar y eliminar usuarios
- Crear, editar y eliminar estudiantes
- Cambiar roles de usuarios
- Cambiar su propio rol

### Moderator

- Similar a User (acceso base)
- Preparado para extensiones futuras

## 🔧 Configuración Avanzada

### Variables de Entorno

| Variable          | Descripción              | Default                                |
| ----------------- | ------------------------ | -------------------------------------- |
| `PORT`            | Puerto del servidor      | 8000                                   |
| `MONGO_URL`       | URI MongoDB local        | mongodb://127.0.0.1:27017/backend77080 |
| `MONGO_ATLAS_URL` | URI MongoDB Atlas        | -                                      |
| `MONGO_TARGET`    | Selecciona LOCAL o ATLAS | LOCAL                                  |
| `JWT_SECRET`      | Clave secreta JWT        | clave_secreta_jwt                      |
| `JWT_EXPIRE`      | Expiración JWT           | 24h                                    |
| `SECRET_SESSION`  | Clave para sesiones      | clave_secreta                          |
| `NODE_ENV`        | Ambiente app             | development                            |

### Seleccionar Base de Datos

**Usar MongoDB Local:**

```env
MONGO_TARGET=LOCAL
MONGO_URL=mongodb://127.0.0.1:27017/backend77080
```

**Usar MongoDB Atlas:**

```env
MONGO_TARGET=ATLAS
MONGO_ATLAS_URL=mongodb+srv://user:pass@cluster.mongodb.net/db
```

## 📦 Dependencias Principales

```json
{
  "express": "5.2.1",
  "mongoose": "9.1.2",
  "bcrypt": "^5.1.x",
  "passport": "^0.7.x",
  "passport-jwt": "^4.0.x",
  "passport-local": "^1.0.x",
  "jsonwebtoken": "^9.x.x",
  "dotenv": "^16.x.x",
  "nodemon": "3.1.11"
}
```

## 🛠️ Desarrollo

### Script Disponibles

```bash
# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start

# Ejecutar tests
node test.js
```

### Debugging

Los endpoints retornan mensajes claros:

```json
{
  "message": "Descripción del error o éxito"
}
```

### Códigos HTTP

| Código | Significado                        |
| ------ | ---------------------------------- |
| 200    | Exitoso                            |
| 201    | Creado exitosamente                |
| 400    | Solicitud incorrecta               |
| 401    | No autorizado (sin JWT)            |
| 403    | Prohibido (permisos insuficientes) |
| 404    | Recurso no encontrado              |
| 500    | Error del servidor                 |

## 🔍 Ejemplo de Flujo Completo

### 1. Registrar Usuario

```bash
curl -X POST http://localhost:8000/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"Juan",
    "last_name":"Pérez",
    "email":"juan@example.com",
    "age":25,
    "password":"password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"juan@example.com",
    "password":"password123"
  }'
```

Respuesta:

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...}
}
```

### 3. Obtener Usuario Actual

```bash
curl -X GET http://localhost:8000/sessions/current \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Actualizar Perfil

```bash
curl -X PUT http://localhost:8000/api/users/USER_ID \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"age":26}'
```

## 📝 Notas Importantes

1. **Seguridad en Producción**:
   - Cambiar `JWT_SECRET` por una clave segura
   - Usar HTTPS en producción
   - Validar CORS según necesidad
   - Usar variables de entorno seguras

2. **MongoDB**:
   - Asegurar que MongoDB está corriendo antes de iniciar
   - Para desarrollo usar MongoDB local
   - Para producción usar MongoDB Atlas con SSL

3. **JWT**:
   - Los tokens expiran en 24 horas (configurable)
   - Guardar token en cliente (localStorage, cookies, etc)
   - Incluir en header: `Authorization: Bearer <token>`

4. **Contraseñas**:
   - Nunca aparecen en respuestas JSON
   - Se encriptan automáticamente
   - Se comparan utilizando bcrypt.compare()

5. **Emails**:
   - Deben ser únicos en la base de datos
   - Se almacenan en minúsculas
   - Se validan con regex

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - Libre para uso comercial y personal

## 👤 Autor

**Rafael Wolfart**

- GitHub: [@RafaelWolfart](https://github.com/RafaelWolfart)
- Repositorio: [coder-backend-2](https://github.com/RafaelWolfart/coder-backend-2)

## 📞 Soporte

Para reportar bugs o sugerencias, abre un issue en GitHub.

---

**Última actualización:** Febrero 2026
**Estado:** ✅ Producción Ready
**Tests:** 7/7 Pasados (100%)
