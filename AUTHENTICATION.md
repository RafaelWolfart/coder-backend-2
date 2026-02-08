# Sistema de Autenticación y CRUD de Usuarios - Backend

Este proyecto es una aplicación backend completa con sistema de autenticación, autorización basada en roles, y CRUD de usuarios.

## Características Principales

- ✅ **Autenticación con JWT**: Sistema seguro de autenticación basado en JSON Web Tokens
- ✅ **Modelo de Usuario**: Campos completos incluyendo encriptación de contraseña con bcrypt
- ✅ **Estrategias de Passport**: Implementadas estrategias LocalStrategy, JWTStrategy y Current
- ✅ **CRUD Completo**: Operaciones completas de usuarios y estudiantes
- ✅ **Autorización por Roles**: Middleware para validar roles (user, admin, moderator)
- ✅ **Express Server**: Servidor Node.js con Express
- ✅ **MongoDB**: Base de datos MongoDB local o Atlas

## Estructura del Proyecto

```
server-backend-2/
├── config/
│   ├── db/
│   │   └── connect.config.js      # Configuración de conexión a MongoDB
│   ├── models/
│   │   ├── user.model.js          # Modelo de Usuario
│   │   ├── cart.model.js          # Modelo de Carrito
│   │   └── student.model.js       # Modelo de Estudiante
│   ├── env.config.js              # Configuración de variables de entorno
│   └── passport.config.js         # Estrategias de Passport
├── middlewares/
│   ├── auth.middleware.js         # Middleware de autenticación JWT
│   ├── role.middleware.js         # Middleware de autorización por roles
│   └── logger.middleware.js       # Middleware de logging
├── routes/
│   ├── auth.router.js             # Rutas de autenticación (register, login, current)
│   ├── user.router.js             # CRUD de usuarios
│   ├── student.router.js          # CRUD de estudiantes (con autenticación)
│   ├── home.router.js             # Rutas principales
│   └── index.js                   # Enrutador padre
├── .env                           # Variables de entorno
├── .gitignore                     # Archivo de git
├── app.js                         # Archivo principal
└── package.json                   # Dependencias
```

## Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno** (.env):
```
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/backend77080
MONGODB_ATLAS_URI=mongodb+srv://user:password@cluster.mongodb.net/databasename
JWT_SECRET=tu_clave_secreta_super_segura_aqui_change_in_production
JWT_EXPIRE=24h
NODE_ENV=development
```

3. **Asegurar que MongoDB esté corriendo**:
```bash
# En Windows
net start MongoDB

# En Mac/Linux
brew services start mongodb-community

# O ejecutar manualmente
mongod
```

## Uso

### Iniciar el servidor

**Modo development** (con nodemon):
```bash
npm run dev
```

**Modo production**:
```bash
npm start
```

El servidor estará disponible en `http://localhost:8000`

## Rutas de API

### Autenticación (`/sessions`)

#### Registrar nuevo usuario
```
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
```
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

#### Obtener usuario actual
```
GET /sessions/current
Authorization: Bearer <tu_token_jwt>

Response (200):
{
  "message": "Usuario actual obtenido",
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

### Usuarios (`/api/users`)

#### Obtener todos los usuarios (Solo Admin)
```
GET /api/users
Authorization: Bearer <token_admin>

Response (200):
{
  "message": "Usuarios obtenidos exitosamente",
  "users": [...]
}
```

#### Obtener usuario por ID
```
GET /api/users/:id
Authorization: Bearer <token_jwt>

Response (200):
{
  "message": "Usuario obtenido exitosamente",
  "user": {...}
}
```

#### Crear usuario (Solo Admin)
```
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
```

#### Actualizar usuario
```
PUT /api/users/:id
Authorization: Bearer <token_jwt>
Content-Type: application/json

{
  "first_name": "María",
  "age": 31
}
```

#### Eliminar usuario (Solo Admin)
```
DELETE /api/users/:id
Authorization: Bearer <token_admin>
```

### Estudiantes (`/api/students`)

#### Obtener todos los estudiantes (Requiere autenticación)
```
GET /api/students
Authorization: Bearer <token_jwt>
```

#### Crear estudiante (Solo Admin)
```
POST /api/students
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "name": "Carlos López",
  "email": "carlos@example.com",
  "age": 20
}
```

#### Actualizar estudiante (Solo Admin)
```
PUT /api/students/:id
Authorization: Bearer <token_admin>
Content-Type: application/json

{
  "name": "Carlos López Actualizado"
}
```

#### Eliminar estudiante (Solo Admin)
```
DELETE /api/students/:id
Authorization: Bearer <token_admin>
```

## Modelo de Usuario

```javascript
{
  first_name: String (requerido),
  last_name: String (requerido),
  email: String (requerido, único),
  age: Number (requerido),
  password: String (requerido, encriptado con bcrypt),
  cart: ObjectId (referencia a Cart),
  role: String (valores: 'user', 'admin', 'moderator', default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

## Estrategias de Passport

### 1. LocalStrategy ('login')
- Usada para autenticar usuarios con email y contraseña
- Compara la contraseña ingresada con la almacenada en la BD
- Retorna el usuario si las credenciales son válidas

### 2. JWTStrategy ('jwt')
- Valida el token JWT en las peticiones autenticadas
- Extrae el token del header Authorization como Bearer Token
- Retorna el usuario asociado al token

### 3. Current Strategy ('current')
- Similar a JWTStrategy pero diseñada específicamente para obtener el usuario actual
- Usada en el endpoint /api/sessions/current

## Middleware de Autorización

- `authenticateJWT`: Valida que el usuario tenga un token JWT válido
- `isAdmin`: Verifica que el usuario tenga rol 'admin'
- `isUserOrAdmin`: Verifica que el usuario sea 'user' o 'admin'
- `authorize(...roles)`: Middleware genérico para validar roles específicos

## Encriptación de Contraseña

Las contraseñas se encriptan automáticamente usando bcrypt:

1. **Al guardar**: El middleware `pre('save')` del modelo User encripta la contraseña
2. **Al comparar**: El método `comparePassword()` compara contraseñas de forma segura

```javascript
// Encriptación automática
const usuario = new User({ ..., password: "micontraseña" });
await usuario.save(); // La contraseña se encripta automáticamente

// Comparación segura
const esValida = await usuario.comparePassword("micontraseña");
```

## Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| PORT | Puerto del servidor | 8000 |
| MONGODB_URI | URI de MongoDB local | mongodb://127.0.0.1:27017/backend77080 |
| MONGODB_ATLAS_URI | URI de MongoDB Atlas | - |
| JWT_SECRET | Clave secreta para firmar JWT | configurar en producción |
| JWT_EXPIRE | Tiempo de expiración del JWT | 24h |
| NODE_ENV | Ambiente (development/production) | development |

## Roles y Permisos

### User (por defecto)
- Ver su propio perfil
- Editar su propio perfil
- Ver lista de estudiantes

### Admin
- Ver todos los usuarios
- Crear, editar y eliminar usuarios
- Crear, editar y eliminar estudiantes
- Cambiar roles de otros usuarios
- Cambiar su propio rol

### Moderator
- Similar a user, con acceso a funciones de moderación (si se implementan)

## Manejo de Errores

El servidor incluye manejo centralizado de errores:

- 400: Solicitud incorrecta (datos faltantes, validación)
- 401: No autorizado (token faltante o inválido)
- 403: Prohibido (permisos insuficientes)
- 404: No encontrado (recurso no existe)
- 500: Error interno del servidor

## Ejemplo de Flujo Completo

1. **Registrar usuario**:
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

2. **Login y obtener token**:
```bash
curl -X POST http://localhost:8000/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"juan@example.com",
    "password":"password123"
  }'
```

3. **Usar token para obtener usuario actual**:
```bash
curl -X GET http://localhost:8000/sessions/current \
  -H "Authorization: Bearer eyJhbGciOi..."
```

4. **Obtener usuario específico**:
```bash
curl -X GET http://localhost:8000/api/users/USER_ID \
  -H "Authorization: Bearer eyJhbGciOi..."
```

## Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **passport**: Autenticación flexible
- **passport-jwt**: Estrategia JWT para Passport
- **passport-local**: Estrategia Local para Passport
- **jsonwebtoken**: Generación y validación de JWT
- **bcrypt**: Encriptación de contraseñas
- **dotenv**: Manejo de variables de entorno
- **nodemon**: Auto-reinicio en desarrollo

## Notas Importantes

1. **Seguridad**: En producción, cambiar la variable `JWT_SECRET` por una clave segura
2. **MongoDB**: Asegurar que MongoDB esté corriendo antes de iniciar el servidor
3. **CORS**: Si necesitas CORS, instalar y configurar `cors`
4. **Variables de Entorno**: Nunca comitear el archivo `.env` a Git
5. **Tokens**: Los tokens JWT expiran según la configuración (por defecto 24h)

## Autor

Rafael Wolfart

## Licencia

MIT
