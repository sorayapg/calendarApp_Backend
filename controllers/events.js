const { response } = require('express');
const prisma = require('../database/prisma');

const getEvents = async ( req, res = response ) => {

    try {
        // Obtener solo los eventos del usuario autenticado
        const events = await prisma.event.findMany({
            where: { userId: Number(req.uid) },
            include: { user: { select: { id: true, name: true } } }
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

const createEvent = async ( req, res = response ) => {

    const { title, notes, start, end } = req.body;

    try {

        const event = await prisma.event.create({
            data: {
                title,
                notes,
                start: new Date(start),
                end:   new Date(end),
                userId: Number(req.uid)
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

const updateEvent = async ( req, res = response ) => {

    const eventId = Number(req.params.id);
    const uid     = Number(req.uid);

    try {

        // Verificar que el evento existe
        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado por ese id'
            });
        }

        // Verificar que el usuario es el propietario
        if ( event.userId !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            });
        }

        const { title, notes, start, end } = req.body;

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

const deleteEvent = async ( req, res = response ) => {
    
    const eventId = Number(req.params.id);
    const uid     = Number(req.uid);

    try {

        // Verificar que el evento existe
        const event = await prisma.event.findUnique({ where: { id: eventId } });

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado por ese id'
            });        
        }

        // Verificar que el usuario es el propietario
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