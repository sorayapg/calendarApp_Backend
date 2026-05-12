const express = require('express');
require('dotenv').config();
const cors = require('cors');

// Crear el servidor de express
const app = express();

// Configuración básica de CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'CalendarApp Backend API running' });
});

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Escuchar peticiones
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
