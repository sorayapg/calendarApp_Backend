const { response } = require('express');
const prisma = require('../database/prisma');

// Obtener todos los eventos del usuario autenticado
// Filtra por userId para garantizar que cada usuario solo accede a sus propios datos
const getEvents = async ( req, res = response ) => {

    try {
        const events = await prisma.event.findMany({
            where: { userId: Number(req.uid) },
            include: { user: { select: { id: true, name: true } } } // incluye datos del propietario
        });

        res.json({
            ok: true,
            events
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

// Crear un nuevo evento en PostgreSQL asociado al usuario autenticado
const createEvent = async ( req, res = response ) => {

    const { title, notes, start, end } = req.body;

    try {

        const event = await prisma.event.create({
            data: {
                title,
                notes,
                start: new Date(start),  // convierte string ISO a Date para PostgreSQL
                end:   new Date(end),
                userId: Number(req.uid)   // asocia el evento al usuario autenticado
            },
            include: { user: { select: { id: true, name: true } } }
        });

        res.json({
            ok: true,
            event
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}

// Actualizar un evento existente, solo si el usuario autenticado es el propietario
const updateEvent = async ( req, res = response ) => {

    const eventId = Number(req.params.id);
    const uid     = Number(req.uid);

    try {

        // Verificar que el evento existe en la base de datos
        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado por ese id'
            });
        }

        // Control de autorización: solo el propietario puede modificar su evento
        if ( event.userId !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            });
        }

        const { title, notes, start, end } = req.body;

        // Actualizar el evento en PostgreSQL mediante Prisma
        const eventUpdated = await prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                notes,
                start: new Date(start),
                end:   new Date(end)
            },
            include: { user: { select: { id: true, name: true } } }
        });

        res.json({
            ok: true,
            event: eventUpdated
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });        
    }
}

// Eliminar un evento, solo si el usuario autenticado es el propietario
const deleteEvent = async ( req, res = response ) => {
    
    const eventId = Number(req.params.id);
    const uid     = Number(req.uid);

    try {

        // Verificar que el evento existe antes de intentar eliminarlo
        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado por ese id'
            });        
        }

        // Control de autorización: solo el propietario puede eliminar su evento
        if ( event.userId !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            });
        }

        await prisma.event.delete({ where: { id: eventId } });
        
        res.json({
            ok: true
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        }); 
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}