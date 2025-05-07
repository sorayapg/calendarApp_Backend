const {Schema, model } = require('mongoose');

// User Schema para el registro de usuarios
const UserSchema = Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

module.exports = model('User', UserSchema );