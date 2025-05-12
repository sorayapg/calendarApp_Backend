const { response } = require('express');
const Event = require('../models/Event'); // Importar el modelo del evento

const getEvents = ( req, res = response ) => {

    return res.status(200).json({
        ok: true,
        msj: 'getEvents',
    })
}

const createEvent = async ( req, res = response ) => {

    // verificar que tenga el evento
    const event = new Event( req.body );

    // grabar en la base de datos 
    try {

       event.user = req.uid; // uid del usuario que crea el evento
        
       const eventSaved = await event.save();

       res.json({
            ok: true,
            event : eventSaved
       });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}


const updateEvent = ( req, res = response ) => {

    res.json({
        ok: true,
        msg: 'updateEvent',
    })
}


const deleteEvent = ( req, res = response ) => {

    res.json({
        ok: true,
        msg: 'deleteEvent',
    })
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}