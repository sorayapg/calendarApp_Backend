const { response } = require('express');

const getEvents = ( req, res = response ) => {

    return res.status(200).json({
        ok: true,
        msj: 'getEvents',
    })
}

const createEvent = ( req, res = response ) => {

    res.json({
        ok: true,
        msg: 'crateEvent',
    })
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