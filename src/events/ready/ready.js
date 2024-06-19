const { ActivityType, Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */

module.exports = (client) => {
    const currentDate = new Date(Date.now());
    client.user.setPresence({
        activities: [
            { name: 'https://github.com/ultimatehecker/Heckernetic', type: ActivityType.Watching },
        ],
        status: 'online',
    });

    console.log("Heckernetic Client PFP", client.user.displayAvatarURL());
    console.log(`Heckernetic has been successfully started at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`);
}