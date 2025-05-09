/** 
 * Rutas de Usuarios / Auth
 * *host + /api/auth/new
 * 
*/


const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validateJwt');

const router = Router();



//endpoints

// Para crear un nuevo usuario
//*POST: /api/auth/new
router.post(
    '/new',
    [// middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El paswword debe de ser de 6 caracteres').isLength({ min: 6}),
        validateFields

    ], 
    createUser);

// Para hacer login y obtener el token de autorización
//*POST: /api/auth
router.post(
    '/', 
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El paswwor debe de ser de 6 caracteres').isLength({ min: 6}),
        validateFields
    ], 
    loginUser );

// Para renovar o revalidar el token
//*GET: /api/auth/renew
router.get('/renew', validateJWT ,revalidateToken );


module.exports = router;