const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./database/config');

// Crear el servidor de express
const app = express();

// Conexión a base de datos
dbConnection();

// Configuración básica de CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Directorio Público
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// ⚠️ Importante: esta ruta debe ir después de las rutas API
// Esto permite que React maneje las rutas del frontend como /calendar, /auth, etc.


app.use( '*', ( req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});


// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
// });

// Escuchar peticiones
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
