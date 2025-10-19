# 🚀 NestJS Authentication API

API REST completa construida con NestJS, que incluye sistema de autenticación con JWT, verificación de email, gestión de usuarios y proyectos con TypeORM y PostgreSQL.

## ✨ Características Principales

- 🔐 **Autenticación JWT completa** - Registro, login y validación de tokens
- ✉️ **Verificación por Email** - Sistema de validación de cuentas mediante correo electrónico
- 👥 **Gestión de Usuarios** - CRUD completo con roles (BASIC, ADMIN)
- 📁 **Gestión de Proyectos** - Sistema de proyectos con niveles de acceso
- 🔒 **Encriptación de Contraseñas** - Usando bcrypt para máxima seguridad
- 🛡️ **Guards y Decoradores** - Protección de rutas basada en roles
- 📊 **TypeORM** - ORM robusto con migraciones automáticas
- 📚 **Documentación Swagger** - API totalmente documentada e interactiva
- ✅ **Validación de DTOs** - Validación automática con class-validator

## 🛠️ Tecnologías

- **Framework**: NestJS 10.x
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Encriptación**: bcryptjs
- **Validación**: class-validator & class-transformer
- **Documentación**: Swagger/OpenAPI
- **Email**: Nodemailer
- **Gestor de Paquetes**: pnpm

## 📋 Prerequisitos

- Node.js >= 18.x
- PostgreSQL >= 13.x
- pnpm (recomendado) o npm

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd nest-bases
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Environment
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=db_nest_bases

# JWT Configuration
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRATION=1d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM=noreply@tuapp.com

# Server
PORT=3001
```

4. **Crear la base de datos**
```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE db_nest_bases;
```

5. **Ejecutar migraciones**
```bash
pnpm run typeorm:run-migrations
```

6. **Iniciar el servidor**
```bash
# Desarrollo
pnpm run start:dev

# Producción
pnpm run build
pnpm run start:prod
```

## 📖 Documentación API

Una vez iniciado el servidor, accede a la documentación interactiva de Swagger:

```
http://localhost:3001/v1/api/docs
```

## 🔑 Endpoints Principales

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/v1/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/v1/api/auth/login` | Iniciar sesión | No |
| GET | `/v1/api/auth/check-auth-status` | Verificar estado del token | Sí |
| GET | `/v1/api/auth/validate-email/:token` | Validar email del usuario | No |


## 🔐 Sistema de Autenticación

### Flujo de Registro y Verificación

1. **Registro**: El usuario se registra con sus datos
2. **Email de Verificación**: Se envía automáticamente un email con un token de validación
3. **Validación**: El usuario hace clic en el link del email para verificar su cuenta
4. **Login**: Una vez verificado, puede iniciar sesión y recibir su JWT

### Uso del Token JWT

Una vez autenticado, incluye el token en el header de tus peticiones:

```bash
Authorization: Bearer <tu_token_jwt>
```

### Ejemplo de Registro

```bash
curl -X POST http://localhost:3001/v1/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "age": 25,
    "email": "juan@example.com",
    "username": "juanperez",
    "password": "Password123!",
    "role": "BASIC"
  }'
```

### Ejemplo de Login

```bash
curl -X POST http://localhost:3001/v1/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

## 👤 Roles de Usuario

- **BASIC**: Usuario estándar con permisos limitados
- **ADMIN**: Administrador con acceso completo al sistema

## 🎯 Niveles de Acceso a Proyectos

- **OWNER**: Propietario del proyecto (control total)
- **DEVELOPER**: Desarrollador con permisos de edición
- **VIEWER**: Solo lectura

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm run start:dev          # Inicia en modo desarrollo con watch

# Producción
pnpm run build              # Compila el proyecto
pnpm run start:prod         # Inicia en modo producción

# Testing
pnpm run test               # Ejecuta tests unitarios
pnpm run test:e2e           # Ejecuta tests e2e
pnpm run test:cov           # Genera reporte de cobertura

# Migraciones
pnpm run typeorm:create-migration --name=NombreMigracion
pnpm run typeorm:generate-migration --name=NombreMigracion
pnpm run typeorm:run-migrations
pnpm run typeorm:revert-migrations

# Formato y Linting
pnpm run format             # Formatea código con Prettier
pnpm run lint               # Ejecuta ESLint
```



## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ Tokens JWT con expiración configurable
- ✅ Validación de datos con class-validator
- ✅ Guards para protección de rutas
- ✅ CORS configurado
- ✅ Verificación de email obligatoria

## 🚨 Manejo de Errores

La API utiliza un sistema de excepciones personalizadas con códigos HTTP apropiados:

- `400` - Bad Request (datos inválidos)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no encontrado)
- `409` - Conflict (recurso ya existe)
- `500` - Internal Server Error

## 📧 Configuración de Email

Para Gmail, necesitas crear una **App Password**:

1. Ve a tu cuenta de Google
2. Seguridad → Verificación en dos pasos
3. Contraseñas de aplicaciones
4. Genera una nueva contraseña para "Mail"
5. Úsala en `EMAIL_PASSWORD` en tu `.env`



## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Tu Nombre - [@valerio06Dev](https://github.com/valerio06Dev)

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!