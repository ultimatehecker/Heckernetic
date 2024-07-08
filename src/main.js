const { ActivityType, Client, IntentsBitField, Partials } = require('discord.js');
const Discord = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Discord.Client({
    partials: [ Partials.Channel, Partials.Message, Partials.Reaction ],
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildPresences,
        IntentsBitField.Flags.MessageContent,
    ],
});

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", () => {
    console.log('Connected to MongoDB Atlas Server');

    client.commands = new Discord.Collection();
    client.contexts = new Discord.Collection();
    client.events = new Discord.Collection();

    client.login(process.env.HECKERNETIC_TOKEN);

    client.once("ready", () => {
        const currentDate = new Date(Date.now());
        
        console.log("Heckernetic Client PFP", client.user.displayAvatarURL());
        console.log(`Heckernetic has been successfully started at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`);

        client.user.setPresence({
            activities: [
                { name: 'https://github.com/ultimatehecker/Heckernetic', type: ActivityType.Watching },
            ],
            status: 'online',
        });

        ["commandHandler", "eventHandler"].forEach((handler) => {
            require(`./handlers/${handler}`)(Discord, client);
        });
    });
});