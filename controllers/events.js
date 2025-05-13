const { response } = require('express');
const Event = require('../models/Event'); // Importar el modelo del evento

const getEvents = async ( req, res = response ) => {

    //Obtener el listado de todos los eventos
    const events = await Event.find()
                              .populate('user', 'name') // para obtener el nombre del usuario que creo el evento
                                
    res.json({
        ok: true,
        events
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


const updateEvent = async ( req, res = response ) => {

    const eventId = req.params.id; // obtenemos el id del evento
    const uid = req.uid; // obtenemos el uid del usuario que quiere actualizar el evento

    try {

        // Verificar que el evento existe
        const event = await Event.findById( eventId );
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado por ese id'
            });
        }
        /**
         * Verificar que el usuario que quiere actualizar el evento es el mismo que lo creo,
         * si no es el mismo, no podrá actualizar ya que no esta autorizado 
         */

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            });
        }

        // Crear un nuevo objeto con los datos que se van actualizar
        const newEvent = {
            ...req.body,
            user: uid // El usuario que actualiza el evento
        }

        // Actualizar el evento
        const eventUpdated = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );
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
    
    const eventId = req.params.id // obtenemos el id del evento
    const uid = req.uid; // Obtenemos el uid del usuario que quiere eliminar el evento
    

    try {

        // verificar que el evento existe
        const event = await Event.findById( eventId );
        if ( !event ) {
            return res. status(404).json({
                ok: false,
                msg: 'Evento no encontrado por ese id'
            });        
        }

        /**
         * verificar que el usuario que quiere eliminar el evento es el mismo que lo creo,
         * si no es el mismo, no podrá eliminar ya que no esta autorizado
         */

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminaar este evento'
            });
        }

        // Eliminar el evento 
        await Event.findByIdAndDelete( eventId); 
        
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
    const event = Event.findById( eventId );
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}