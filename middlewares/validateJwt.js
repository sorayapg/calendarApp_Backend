const { response } = require('express');
const jwt = require('jsonwebtoken'); // Importar el paquete jsonwebtoken para verificar el token

const validateJWT = ( req, res = response, next ) => {

    // x-token headers - leer el token
    const token = req.header('x-token');

    // verificar si no hay token
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    // verificar si ya hay un token
    try {

        const { uid, name } = jwt.verify(
            token, // el token que viene en la petición
            process.env.SECRET_JWT_SEED // La semilla secreta para verificar el token
        )

        req.uid = uid; // guarda el uid que se estrae de la respuesta del token
        req.name = name; // guarda el name que se extrae de la respuesta del token
        
    } catch (error) {
        // Si el token no es válido o ha expirado, devolvemos un error 401, con un mensaje de error
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();

}

module.exports = {
    validateJWT
}