const {Schema, model } = require('mongoose');

// User Schema para el registro de usuarios
const EvenSchema = Schema({

    title: {
        type: String,
        required: true
    },

    notes: {
        type: String,
    },

    start: {
        type: Date,
        required: true
    },

    end: {
        type: Date,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } 
});

// personalizar el modelo solo para mostrar lo que queremos 
EvenSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Event', EvenSchema );