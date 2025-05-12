const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJwt');
const { getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/events');

const router = Router();
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
router.post(
    '/', 
    [
        // validar el titulo
        check( 'title', 'El titulo es obligatorio' ).not().isEmpty(),
        // validar la fecha de inicio
        check( 'start', 'La fecha de inicio es obligatoria' ).custom( isDate),
        // validar la fecha de fin
        check( 'end', 'La fecha de fin es obligatoria' ).custom( isDate ),
        validateFields
    ],
    createEvent 
);

// Actualizar evento 
//*PUT: /api/events/:id
router.put('/:id', updateEvent );

// Eliminar o borrar evento
//*DELETE: /api/events/:id
router.delete('/:id', deleteEvent)


module.exports = router;