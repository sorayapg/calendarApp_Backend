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
- Despliegue en Render

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
| **Render** | Plataforma de despliegue en la nube |

---

## ⚙️ 3. Requisitos previos

Antes de comenzar, asegúrate de tener:

- 🟢 **Node.js 18+**
- 🟢 **npm** (gestor de paquetes)
- 🟢 **Cuenta en MongoDB Atlas**
- 🟢 **Cuenta en Render** (para despliegue en la nube)

---

## ☁️ 4. Despliegue en Render (producción)

El backend está desplegado en Render mediante integración con GitHub.

### ⚡ Despliegue automático

- El servicio está conectado al repositorio de GitHub
- Cada push a la rama `main` dispara un nuevo deploy automático

### 🔧 Variables de entorno en Render

Configurar en el panel de Render:

- DB_CNN → URI de MongoDB Atlas
- SECRET_JWT_SEED → clave secreta para JWT

### 🌐 URL pública

https://calendarapp-backend-fes0.onrender.com

### 🔗 Base API

https://calendarapp-backend-fes0.onrender.com/api

### 🧠 Nota importante

El servicio utiliza el plan gratuito de Render, por lo que puede entrar en reposo tras inactividad.

La primera petición puede tardar unos segundos.



## ⚙️ 5. Ejecución en local


# 1️⃣ Entra en la carpeta del backend
cd calendarApp_Backend

# 2️⃣ Instala las dependencias
npm install

# 3️⃣ Verifica que todo funcione en local
npm start

## 🌐 Configuración CORS

Para permitir el acceso desde el frontend en producción:
CORS_ORIGIN=https://sorayapg.github.io


En desarrollo:
CORS_ORIGIN=http://localhost:5173

## ⚙️ 6. Despliegue en Render (producción)

### ⚡ Despliegue automático desde GitHub

Render ya está vinculado al repositorio.  
Cada vez que hagas un push en la rama principal (`main`), Render desplegará automáticamente una nueva versión.


# 1️⃣ Entra en la carpeta del backend
cd calendarApp_Backend

# 2️⃣ Verifica que todo funcione en local
npm install
npm start

# 3️⃣ Añade y sube tus cambios a GitHub
git add .
git commit -m "Actualización del backend - nueva versión"
git push origin main

* Render detectará el nuevo commit y ejecutará el despliegue.
* Puedes seguir el proceso en el panel: Deployments → View Logs


## ⚙️ Despliegue manual con Render CLI

# Instalar CLI (una sola vez)
npm install -g @Render/cli

# Iniciar sesión
Render login

# Vincular el proyecto local al de Render
Render link

# Desplegar cambios
Render up

#🔗 URL pública del backend:
# https://calendarapp-backend-fes0.onrender.com


## 🧰 7. Comandos útiles de Render CLI

| Acción                     | Comando                                   |
| -----------------------    |:----------------------------------------  |    
| Ver estado del servicio    |  Render status                           |    
| Ver logs en tiempo real    |  Render logs                             |
| Abrir el panel web         |  Render open                             |
| Ver variables de entorno   |  Render variables                        |
| Modificar variable         |  Render variables set NOMBRE=valor       |

## 🔗 Integración Full Stack

Este backend está conectado con el frontend desplegado en GitHub Pages:

Frontend:
https://sorayapg.github.io/calendarApp/

Tecnologías combinadas:

- React (Frontend)
- Node.js + Express (Backend)
- MongoDB Atlas (Base de datos)
- JWT (Autenticación)
- GitHub Pages + Render (Deploy)

Proyecto completo desplegado en producción.


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
(invalid ELF header)         |  Entorno Render sin binarios nativos      |  Usa bcryptjs                                  |
| CORS bloqueado             |  Origen del frontend no permitido          |  Añade el dominio en CORS_ORIGIN               |
| JWT inválido o expirado    |  Token incorrecto o caducado               |  Revisa el header Authorization                |


