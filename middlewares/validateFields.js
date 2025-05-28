

const { response } = require('express');
const { validationResult } = require('express-validator');

const validateFields = (req , res = response, next) => {

    // manejo de errores
    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        // Devuelve solo el primer mensaje de error (más simple para el frontend)
        return res.status(400).json({
            ok: false,
            // errors: errors.mapped()
            msg: errors.array()[0].msg
        });
    }


    next();
}

module.exports = {
    validateFields
}