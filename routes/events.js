const { Router } = require('express');
const router = Router();
const { validateJWT } = require('../middlewares/validateJwt');
const { getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/events');

/* 
    Event Routes
    //*host: /api/events

*/
// Middleware para validar el JWT
router.use( validateJWT );

// Obtener todos los eventos
//*GET: /api/events
router.get('/', getEvents );

// Crear un nuevo evento 
//*POST: /api/events
router.post('/', createEvent );

// Actualizar evento 
//*PUT: /api/events/:id
router.put('/:id', updateEvent );

// Eliminar o borrar evento
//*DELETE: /api/events/:id
router.delete('/:id', deleteEvent)


module.exports = router;