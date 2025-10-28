<h1 align="center">📅 CalendarApp_Backend</h1>

<p align="center">
  <b>API REST para la gestión de eventos y autenticación de usuarios</b><br>
  Desarrollada con <code>Node.js</code>, <code>Express</code> y <code>MongoDB (Atlas)</code>.<br>
  Proyecto Full Stack — <strong>DAW 2025</strong>
</p>

---

## 🚀 1. Descripción del proyecto

El **backend de CalendarApp** proporciona todos los servicios de autenticación y gestión de eventos para la aplicación de calendario.  
Su función principal es manejar usuarios, iniciar sesión mediante **JWT**, y gestionar las operaciones **CRUD** sobre los eventos del calendario.

- Autenticación segura (JWT)
- Validación de usuarios
- API REST modular
- Conexión con MongoDB Atlas
- Despliegue en Railway

---

## 🧠 2. Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|--------------|
| **Node.js** | Entorno de ejecución de JavaScript en el servidor |
| **Express.js** | Framework backend minimalista y rápido |
| **MongoDB Atlas** | Base de datos NoSQL en la nube |
| **Mongoose** | ODM para modelar datos MongoDB |
| **JWT (jsonwebtoken)** | Autenticación y manejo de sesiones seguras |
| **bcryptjs** | Encriptación de contraseñas |
| **dotenv** | Configuración de variables de entorno |
| **CORS** | Control de acceso entre dominios |
| **Railway** | Plataforma de despliegue en la nube |

---

## ⚙️ 3. Requisitos previos

Antes de comenzar, asegúrate de tener:

- 🟢 **Node.js 18+**
- 🟢 **npm** (gestor de paquetes)
- 🟢 **Cuenta en MongoDB Atlas**
- 🟢 **Cuenta en Railway** (para despliegue en la nube)

---

## 🧩 4. Configuración de variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes copiar el contenido de `.env.template`):

```
PORT=4000
DB_CNN=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/mern_calendar
SECRET_JWT_SEED=<clave-secreta-jwt>
CORS_ORIGIN=http://localhost:5173

```



## ⚙️ 5. Ejecución en local


# 1️⃣ Entra en la carpeta del backend
cd calendarApp_Backend

# 2️⃣ Instala las dependencias
npm install

# 3️⃣ Verifica que todo funcione en local
npm start



## ⚙️ 6. Despliegue en Railway (producción)

### ⚡ Despliegue automático desde GitHub

Railway ya está vinculado al repositorio.  
Cada vez que hagas un push en la rama principal (`main`), Railway desplegará automáticamente una nueva versión.


# 1️⃣ Entra en la carpeta del backend
cd calendarApp_Backend

# 2️⃣ Verifica que todo funcione en local
npm install
npm start

# 3️⃣ Añade y sube tus cambios a GitHub
git add .
git commit -m "Actualización del backend - nueva versión"
git push origin main

* Railway detectará el nuevo commit y ejecutará el despliegue.
* Puedes seguir el proceso en el panel: Deployments → View Logs


## ⚙️ Despliegue manual con Railway CLI

# Instalar CLI (una sola vez)
npm install -g @railway/cli

# Iniciar sesión
railway login

# Vincular el proyecto local al de Railway
railway link

# Desplegar cambios
railway up

#🔗 URL pública del backend:
# https://calendar-app-backend-pro.up.railway.app


## 🧰 7. Comandos útiles de Railway CLI

| Acción                     | Comando                                   |
| -----------------------    |:----------------------------------------  |    
| Ver estado del servicio    |  railway status                           |    
| Ver logs en tiempo real    |  railway logs                             |
| Abrir el panel web         |  railway open                             |
| Ver variables de entorno   |  railway variables                        |
| Modificar variable         |  railway variables set NOMBRE=valor       |



## 🧩 8. Endpoints principales

| Acción                     | Endpoint                                   | Descripción 
| -----------------------    |:----------------------------------------   |---------------------------------- |   
| POST                       |  /api/auth/new                             |  Registrar un nuevo usuario       |
| POST                       |  /api/auth                                 |  Iniciar sesión (login)           |
| GET                        |  /api/events                               |  Listar eventos (JWT requerido)   |
| POST                       |  /api/events                               |  Crear evento (JWT requerido)     |
| PUT                        |  /api/events/:id                           |  Actualizar evento                |
| DELETE                     |  /api/events/:id                           |  Eliminar evento                  |


## 🧩 9. Health Check (opcional)
```
app.get('/api/health', (req, res) => { 
  const mongoose = require('mongoose'); 
  res.json({ 
    ok: true, 
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  }); 
});

```

## 🔍 10. Solución de problemas comunes

| Error                      | Causa probable                             | Solución 
| -----------------------    |:----------------------------------------   |------------------------------------------------|   
|500 Internal Server Error   |  Conexión fallida a MongoDB                |  Verifica DB_CNN y la IP permitida en Atlas    |
|bcrypt error 
(invalid ELF header)         |  Entorno Railway sin binarios nativos      |  Usa bcryptjs                                  |
| CORS bloqueado             |  Origen del frontend no permitido          |  Añade el dominio en CORS_ORIGIN               |
| JWT inválido o expirado    |  Token incorrecto o caducado               |  Revisa el header Authorization                |


