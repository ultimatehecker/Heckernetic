const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userId: {
        type: String,
        required: true
    },

    guildId: {
        type: String,
        required: true
    },

    lastDaily: {
        type: Date,
        required: true,
    },

    ssn: {
        type: String,
        required: true
    },

    bank: {
        type: Array,
        default: []
    },
    
    infractions: {
        type: Number,
        default: 0
    },

    netherite: {
        type: Number,
        default: 0
    },

    diamonds: {
        type: Number,
        default: 0
    },

    iron: {
        type: Number,
        default: 0
    },

    infractions: {
        type: Array,
        default: []
    },

    inventory: {
        type: Array,
        default: []
    }
});

module.exports = model('User', userSchema);