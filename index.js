const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// console.log(process.env);

// Crear el servidor de express
const app = express();

// Base de datos
dbConnection();

// Configuración basica de CORS
app.use(cors());

// Directorio Público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas 
app.use('/api/auth', require('./routes/auth') );

// Ruta de prueba para la raíz
app.get('/', (req, res) => {
  res.send('Backend de Calendar App corriendo correctamente 🚀');
});

// CRUD: eventos
app.use('/api/events', require('./routes/events') );

// Escuchar peticiones

const PORT = process.env.PORT || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// app.listen(process.env.PORT, () => {
//     console.log(`Servidor escuchando en el puerto ${ process.env.PORT}`);

// });

