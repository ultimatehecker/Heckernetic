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
    
    infractions: {
        type: Number,
        default: 0
    },

    netherite: {
        type: Number,
        default: 0
    },

    emeralds: {
        type: Number,
        default: 0
    },

    diamonds: {
        type: Number,
        default: 0
    },

    bank: {
        type: Number,
        required: true
    },

    lastDaily: {
        type: Date,
        required: true,
    },

    infractions: {
        type: Array,
        default: []
    }
});

module.exports = model('User', userSchema);