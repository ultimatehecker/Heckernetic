const { Client, IntentsBitField } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', () => {
    console.log('Heckernetic is ready!');
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
});

client.login(process.env.HECKERNETIC_TOKEN);