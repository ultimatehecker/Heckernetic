const { Schema, model } = require('mongoose');

const levelSchema = new Schema({
    userId: {
        type: String,
        required: true
    },

    guildId: {
        type: String,
        required: true
    },

    level: {
        type: Number,
        default: 0
    },

    rank: {
        type: Number,
        default: 0
    },

    xp: {
        type: Number,
        default: 0
    },

    lifetimeXp: {
        type: Number,
        default: 0
    },
});

module.exports = model('Level', levelSchema);