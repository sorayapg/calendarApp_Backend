const { response } = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../database/prisma');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {
    const { name, email, password } = req.body;

    try {

        // Verificar si el usuario ya existe en PostgreSQL
        const existingUser = await prisma.user.findUnique({ where: { email } });

        if ( existingUser ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync( password, salt );

        // Crear usuario en PostgreSQL
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        // Generar JWT con el id (Int) y el nombre
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
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

        // Buscar usuario en PostgreSQL
        const user = await prisma.user.findUnique({ where: { email } });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });        
        }

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const revalidateToken = async (req, res = response) => {

    const { uid, name } = req;

    try {
        // Verificar que el usuario sigue existiendo en PostgreSQL
        // Number() convierte el uid del JWT (puede llegar como string) a entero
        const user = await prisma.user.findUnique({ where: { id: Number(uid) } });

        if ( !user ) {
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Generar nuevo token
        const token = await generateJWT( uid, name );

        res.json({
            ok: true,
            uid,
            name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


module.exports = {
    createUser,
    loginUser,
    revalidateToken
}