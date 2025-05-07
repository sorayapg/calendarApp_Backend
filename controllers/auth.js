const { response } = require('express');
const bcrypt = require('bcryptjs'); // Importamos bcrypt para encritar la contraseña
const User = require('../models/User'); // Importamos el modelo de usuario



const createUser = async(req, res = response) => {
    const { email, password } = req.body;

    // Validar si el usuario ya exite en la BD
    try {

        let user = await User.findOne({ email }); // Buscamos si el usuario ya existe en BD
        // Si el usuario exste, devolvemos un error 400
        
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        /**
         * Creamos una nueva instancia del modelo User con los datos del cuerpo de la solicitud 
         * si el usuario no existe en la base de datos , es decir, si no se encontró un usuario con el mismno email.
         * Entonces, se crea un nuevo usuario 
         * */
        user = new User( req.body );
        
        // Encriptamos la contraseña del usuario con bcrypt 
        const salt = bcrypt.genSaltSync(); // Generamos un salt para encriptar la contraseña
        user.password = bcrypt.hashSync( password, salt ); // Encriptamos la contraseña con el salt generado 

        /**
         * Guardamos el usuario en la BD
         * El método save() se utiliza para guardar el documento en la BD
         * 
         */
        await user.save();
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
    
}

const loginUser = (req, res = response) => {
    
    const { email, password } = req.body;

    res.status(200).json({
        ok: true,
        msg: 'login',
        email,
        password
    })
}

const revalidateToken = (req, res = response) => {
    
    res.json({
        ok: true,
        msg: 'renew'
    })
}


module.exports = {
    createUser,
    loginUser,
    revalidateToken
}