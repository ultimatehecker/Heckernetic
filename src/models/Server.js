const { Schema, model } = require('mongoose');

const serverSchema = new Schema({
    guildId: {
        type: String,
        required: true
    },

    prefix: {
        type: String,
        required: true,
        default: "-"
    },

    welcomeMessage: {
        type: String,
        default: "{member-mention} joined the server!"
    },

    welcomeMessageID: {
        type: String,
        default: "none"
    },
    
    leaveMessage: {
        type: String,
        default: "{member-tag} left the server"
    },

    leaveMessageID: {
        type: String,
        default: "none"
    },

    reactionRoles: {
        type: Array,
        default: []
    },
});

module.exports = model('Server', serverSchema);