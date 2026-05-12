<h1 align="center">📅 CalendarApp — Backend</h1>

<p align="center">
  <b>API REST para la gestión de eventos y autenticación de usuarios</b><br>
  Desarrollada con <code>Node.js</code>, <code>Express</code> y <code>PostgreSQL</code>.<br>
  Proyecto Full Stack — <strong>DAW 2025/2026</strong>
</p>

---

## 1. Descripción del proyecto

El **backend de CalendarApp** es una API REST independiente que proporciona los servicios de autenticación y gestión de eventos del calendario.

- Autenticación segura mediante **JWT**
- **CRUD completo** de eventos por usuario
- **Base de datos relacional PostgreSQL** alojada en Neon
- **Prisma** como ORM para modelar y consultar la base de datos
- Cada usuario solo puede ver y gestionar sus propios eventos
- Desplegado como servicio independiente en **Render**

---

## 2. Arquitectura del sistema

```
┌─────────────────────────┐        ┌──────────────────────────┐
│   Frontend (React)      │        │   Backend (Node.js)      │
│   GitHub Pages          │ ──────▶│   Render                 │
│   sorayapg.github.io    │  REST  │   /api/auth              │
│   /calendarApp/         │        │   /api/events            │
└─────────────────────────┘        └──────────────┬───────────┘
                                                  │
                                                  ▼
                                   ┌──────────────────────────┐
                                   │   PostgreSQL (Neon)      │
                                   │   Tablas: users, events  │
                                   └──────────────────────────┘
```

- El frontend y el backend están en **repositorios separados**
- Se comunican exclusivamente mediante la API REST
- El token JWT viaja en el header `x-token` de cada petición autenticada

---

## 3. Tecnologías utilizadas

| Tecnología | Versión | Descripción |
|---|---|---|
| **Node.js** | 18+ | Entorno de ejecución JavaScript en el servidor |
| **Express** | 4.x | Framework para construir la API REST |
| **PostgreSQL** | — | Base de datos relacional |
| **Neon** | — | Proveedor cloud de PostgreSQL (gratuito) |
| **Prisma ORM** | 6.x | Gestión de modelos, consultas y migraciones |
| **JWT (jsonwebtoken)** | — | Autenticación y protección de rutas |
| **bcryptjs** | — | Cifrado de contraseñas |
| **express-validator** | — | Validación de datos en las peticiones |
| **cors** | — | Control de acceso entre dominios |
| **dotenv** | — | Carga de variables de entorno |
| **Render** | — | Plataforma de despliegue en la nube |

---

## 4. Modelo relacional de base de datos

El backend utiliza una base de datos **relacional** con dos tablas principales relacionadas entre sí.

### Tabla `users`

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | INT | PRIMARY KEY, autoincremental | Identificador único del usuario |
| `name` | VARCHAR | NOT NULL | Nombre del usuario |
| `email` | VARCHAR | NOT NULL, UNIQUE | Correo electrónico (no puede repetirse) |
| `password` | VARCHAR | NOT NULL | Contraseña cifrada con bcryptjs |
| `created_at` | TIMESTAMP | DEFAULT now() | Fecha de registro |
| `updated_at` | TIMESTAMP | Automático | Última modificación |

### Tabla `events`

| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| `id` | INT | PRIMARY KEY, autoincremental | Identificador único del evento |
| `user_id` | INT | FOREIGN KEY → users.id | Usuario propietario del evento |
| `title` | VARCHAR | NOT NULL | Título del evento |
| `notes` | VARCHAR | NULL | Notas opcionales |
| `start_date` | TIMESTAMP | NOT NULL | Fecha y hora de inicio |
| `end_date` | TIMESTAMP | NOT NULL | Fecha y hora de fin |
| `created_at` | TIMESTAMP | DEFAULT now() | Fecha de creación |
| `updated_at` | TIMESTAMP | Automático | Última modificación |

### Relación entre tablas

```
users                        events
─────────────────            ──────────────────────────
id (PK) ◄──────────────────  user_id (FK)
name                         id (PK)
email                        title
password                     notes
created_at                   start_date
updated_at                   end_date
                             created_at
                             updated_at
```

**Tipo de relación: 1:N (uno a muchos)**

- Un usuario puede tener **muchos eventos**
- Cada evento pertenece a **un único usuario**
- Si se elimina un usuario, sus eventos se eliminan automáticamente en **cascada**

> **Conceptos clave:**
> - **Clave primaria (PK):** identifica de forma única cada fila de la tabla
> - **Clave foránea (FK):** referencia el `id` de otra tabla, creando la relación
> - **Cascada:** al borrar un usuario, PostgreSQL borra automáticamente todos sus eventos

---

## 5. Esquema Prisma

El archivo `prisma/schema.prisma` define los modelos que Prisma usa para generar las tablas en PostgreSQL y las consultas en Node.js:

```prisma
model User {
  id        Int      @id @default(autoincrement())  // clave primaria
  name      String
  email     String   @unique                         // sin duplicados
  password  String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  events    Event[]                                  // relación 1:N

  @@map("users")                                     // nombre real de la tabla en PostgreSQL
}

model Event {
  id        Int      @id @default(autoincrement())
  userId    Int      @map("user_id")                 // clave foránea
  title     String
  notes     String?                                  // campo opcional
  start     DateTime @map("start_date")
  end       DateTime @map("end_date")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("events")
}
```

**Anotaciones relevantes:**
- `@id` — define la clave primaria
- `@default(autoincrement())` — el id se asigna solo, incrementándose
- `@unique` — garantiza que no haya dos registros con el mismo valor
- `@relation` — define la relación entre tablas
- `onDelete: Cascade` — elimina eventos si se borra el usuario
- `@map` — mapea el nombre en Prisma al nombre real de la columna en PostgreSQL

---

## 6. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.template`:

```env
SECRET_JWT_SEED=tu_clave_secreta_para_jwt
DATABASE_URL=postgresql://usuario:contraseña@host/base_de_datos?sslmode=require
```

| Variable | Descripción |
|---|---|
| `SECRET_JWT_SEED` | Clave secreta para firmar y verificar tokens JWT |
| `DATABASE_URL` | URL de conexión a PostgreSQL en Neon |

> ⚠️ **Importante:** El archivo `.env` está incluido en `.gitignore` y **nunca debe subirse a GitHub**. Contiene credenciales privadas.

---

## 7. Instalación y ejecución en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/10-calendar-backend.git
cd 10-calendar-backend

# 2. Instalar dependencias
npm install
# (ejecuta automáticamente prisma generate gracias a postinstall)

# 3. Crear el archivo .env
cp .env.template .env
# Editar .env con tus valores reales

# 4. Ejecutar migraciones (crea las tablas en PostgreSQL)
npx prisma migrate dev

# 5. Arrancar el servidor en modo desarrollo
npm run dev
```

El servidor quedará disponible en `http://localhost:4000`.

---

## 8. Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| Desarrollo | `npm run dev` | Arranca con nodemon (recarga automática) |
| Producción | `npm start` | Arranca con node |
| Generar cliente | `npx prisma generate` | Genera el cliente Prisma tras cambios en el schema |
| Migrar (dev) | `npx prisma migrate dev` | Aplica migraciones y crea tablas en local |
| Migrar (prod) | `npx prisma migrate deploy` | Aplica migraciones en producción |

> `postinstall` en `package.json` ejecuta `prisma generate` automáticamente tras cada `npm install`, tanto en local como en Render.

---

## 9. Migraciones Prisma

Las migraciones son archivos SQL generados automáticamente por Prisma que definen cómo crear o modificar las tablas en la base de datos.

- Se almacenan en `prisma/migrations/`
- Cada migración tiene un nombre con timestamp: `20260511160607_init/migration.sql`
- En **desarrollo local**: `npx prisma migrate dev --name nombre`
- En **producción (Render)**: Prisma aplica las migraciones pendientes automáticamente

> La primera migración (`init`) creó las tablas `users` y `events` en PostgreSQL/Neon con todas sus columnas, restricciones y relaciones.

---

## 10. Endpoints de autenticación

Base URL producción: `https://calendarapp-backend-fes0.onrender.com`

### `POST /api/auth/new` — Registro de usuario

No requiere token.

**Body:**
```json
{
  "name": "Nombre Usuario",
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "uid": 1,
  "name": "Nombre Usuario",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

### `POST /api/auth` — Login

No requiere token.

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "uid": 1,
  "name": "Nombre Usuario",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

### `GET /api/auth/renew` — Renovar token

Requiere header `x-token`.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "uid": 1,
  "name": "Nombre Usuario",
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

## 11. Endpoints de eventos

Todos requieren el header `x-token` con un JWT válido.  
Cada usuario **solo accede a sus propios eventos** — el backend filtra por `userId` usando `req.uid` extraído del token.

### `GET /api/events` — Obtener eventos del usuario

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "events": [
    {
      "id": 1,
      "userId": 1,
      "title": "Reunión de equipo",
      "notes": "Sala B",
      "start": "2026-06-01T10:00:00.000Z",
      "end": "2026-06-01T11:00:00.000Z",
      "user": { "id": 1, "name": "Nombre Usuario" }
    }
  ]
}
```

---

### `POST /api/events` — Crear evento

**Body:**
```json
{
  "title": "Reunión de equipo",
  "notes": "Sala B",
  "start": "2026-06-01T10:00:00.000Z",
  "end": "2026-06-01T11:00:00.000Z"
}
```

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "event": { "id": 1, "title": "Reunión de equipo", ... }
}
```

---

### `PUT /api/events/:id` — Editar evento

Solo el propietario puede editarlo. Mismo body que POST.

**Respuesta exitosa (200):**
```json
{
  "ok": true,
  "event": { "id": 1, "title": "Título actualizado", ... }
}
```

---

### `DELETE /api/events/:id` — Eliminar evento

Solo el propietario puede eliminarlo.

**Respuesta exitosa (200):**
```json
{ "ok": true }
```

---

## 12. Health check

### `GET /`

Sin autenticación. Útil para comprobar que el servicio está activo.

**Respuesta:**
```json
{ "ok": true, "message": "CalendarApp Backend API running" }
```

---

## 13. Seguridad

- **Contraseñas cifradas** con `bcryptjs` — nunca se almacenan en texto plano
- **JWT** firmado con `SECRET_JWT_SEED` — expira en 2 horas
- **Rutas privadas** protegidas por el middleware `validateJWT`
- **Aislamiento de eventos** — cada consulta filtra por `userId` del token, impidiendo acceso cruzado
- **Variables sensibles** fuera del repositorio (`.env` en `.gitignore`)
- **HTTPS** en producción gestionado por Render/Cloudflare

---

## 14. Despliegue en Render

El backend está desplegado como servicio Node.js en Render con integración automática con GitHub.

### Configuración del servicio

| Campo | Valor |
|---|---|
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

> `npm install` ejecuta automáticamente `prisma generate` gracias al script `postinstall` del `package.json`.

### Variables de entorno en Render

Configurar en **Environment → Add Environment Variable**:

| Variable | Valor |
|---|---|
| `SECRET_JWT_SEED` | Tu clave secreta JWT |
| `DATABASE_URL` | URL de conexión a Neon PostgreSQL |

### URLs de producción

| Recurso | URL |
|---|---|
| Health check | https://calendarapp-backend-fes0.onrender.com/ |
| API base | https://calendarapp-backend-fes0.onrender.com/api |
| Frontend | https://sorayapg.github.io/calendarApp/ |

> El plan gratuito de Render puede entrar en reposo tras inactividad. La primera petición puede tardar unos segundos.

---

## 15. Estructura de carpetas

```
10-calendar-backend/
├── controllers/
│   ├── auth.js          # Registro, login y renovación de token
│   └── events.js        # CRUD de eventos (Prisma)
├── database/
│   └── prisma.js        # Instancia única del cliente Prisma
├── helpers/
│   ├── isDate.js        # Validador de fechas
│   └── jwt.js           # Generación de JWT
├── middlewares/
│   ├── validateFields.js # Validación de campos con express-validator
│   └── validateJwt.js   # Protección de rutas privadas
├── prisma/
│   ├── migrations/      # Historial de migraciones SQL
│   └── schema.prisma    # Definición del modelo relacional
├── routes/
│   ├── auth.js          # Rutas de autenticación
│   └── events.js        # Rutas de eventos
├── .env                 # Variables de entorno (no subir a GitHub)
├── .env.template        # Plantilla de variables de entorno
├── .gitignore
├── index.js             # Punto de entrada del servidor
└── package.json
```

---

## 16. Migración realizada — de MongoDB a PostgreSQL

Este backend fue migrado durante el desarrollo del proyecto de MongoDB/Mongoose a PostgreSQL/Prisma por requisito académico de uso de base de datos relacional.

**Situación anterior:**
- Base de datos: MongoDB Atlas (NoSQL)
- ORM: Mongoose
- Modelos: `models/User.js`, `models/Event.js`
- Variable de conexión: `DB_CNN`

**Situación actual:**
- Base de datos: PostgreSQL en Neon (relacional)
- ORM: Prisma
- Modelos: definidos en `prisma/schema.prisma`
- Variable de conexión: `DATABASE_URL`

**Cambios realizados:**
- Eliminados `models/User.js` y `models/Event.js`
- Eliminado `database/config.js` (conexión Mongoose)
- Eliminada dependencia `mongoose`
- Eliminada variable `DB_CNN`
- Eliminada carpeta `public/` (build legacy del frontend)
- El backend queda como API independiente limpia

---

## 17. Validaciones realizadas en producción

Se realizaron las siguientes pruebas en el entorno de producción (Render + Neon):

| Prueba | Resultado |
|---|---|
| Registro de usuario | ✅ 201 Created |
| Login con usuario existente | ✅ 200 OK |
| Renovación de token (renew) | ✅ 200 OK |
| Crear evento | ✅ 200 OK |
| Editar evento | ✅ 200 OK |
| Eliminar evento | ✅ 200 OK |
| Refrescar página (persistencia) | ✅ Correcto |
| Privacidad entre usuarios | ✅ Cada usuario ve solo sus eventos |
| Health check en producción | ✅ JSON correcto |

---

## 18. Notas para evaluación académica

Este proyecto demuestra el uso de una **base de datos relacional real** con los siguientes conceptos:

| Concepto | Implementación |
|---|---|
| **Tabla** | `users` y `events` en PostgreSQL |
| **Clave primaria (PK)** | Campo `id` autoincremental en ambas tablas |
| **Clave foránea (FK)** | `user_id` en `events` referencia `users.id` |
| **Relación 1:N** | Un usuario → muchos eventos |
| **Integridad referencial** | `onDelete: Cascade` en la relación |
| **Unicidad** | `email` con restricción `UNIQUE` |
| **Campos opcionales** | `notes` nullable en `events` |
| **ORM** | Prisma gestiona modelos, consultas y migraciones |
| **Migraciones** | Historial versionado en `prisma/migrations/` |
| **Separación frontend/backend** | Repositorios y despliegues independientes |
| **Despliegue real** | Backend en Render, BD en Neon, Frontend en GitHub Pages |

