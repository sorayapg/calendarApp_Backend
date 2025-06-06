const { response } = require('express');
const bcrypt = require('bcryptjs'); // Importamos bcrypt para encritar la contraseña
const User = require('../models/User'); // Importamos el modelo de usuario
const { generateJWT } = require('../helpers/jwt');// Importamos la funcion para generar el JWT

const createUser = async(req, res = response) => {
    console.log('Body recibido:', req.body);
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

        // Generar JWT

        const token = await generateJWT( user.id, user.name ); // generamos el token con el id y el nombre del usuario

        // Devolvemos el usuario creado y el token generado
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token // Devolvemos el token generado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
    
}

const loginUser = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email }); // Buscamos si el usuario ya existe en BD
        // Si el usuario no existe, devolvemos un error 400
        
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Validar o confimar las contraseñas 
        // Si el usuario existe, comparamos la contraseña ingresada con la contraseña encriptada en la BD
        const validPassword = bcrypt.compareSync( password, user.password ); // Comparamos la contraseña ingresada con la contraseña encriptada en la BD
        // Si la contraseña no es valida, devolvemos un error 400
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });        
        }

        //Generar el JWT ( JSON Web Token ) para el usuario

        // Generar JWT

        const token = await generateJWT( user.id, user.name ); // generamos el token con el id y el nombre del usuario

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token // Devolvemos el token generado

        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }


}

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req; // Extraemos el uid y el name y Obtenemos el uid y el name del usuario del token
   


    // Generar un nuevo token 
    const token = await generateJWT( uid.id, name ); // generamos el token con el id y el nombre del usuario
    // Devolvemos el nuevo token y el uid y name del usuario
    
    res.json({
        ok: true,
        uid,
        name,
        token
    })
}


module.exports = {
    createUser,
    loginUser,
    revalidateToken
}