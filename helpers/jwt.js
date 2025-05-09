const jwt = require('jsonwebtoken');

const generateJWT = ( uid, name ) => {

    return new Promise( (resolve, reject) => {
        const payload = { uid, name }; // Creamos el payload con el uid y el name del usuario
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' // El token expirará en 2 horas
        }, (err, token) => { // Si hay un error al generar el token, lo rechazamos
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT'); // Rechazamos la promesa con un mensaje de error
            } else {
                resolve(token); // Si no hay error, resolvemos la promesa con el token generado
            }
        });
    });
}

module.exports = {
    generateJWT
}