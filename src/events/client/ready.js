const { ActivityType, Client, Discord } = require('discord.js');

/**
 * 
 * @param {Client} client 
 * @param {Discord} Discord
 */

module.exports = (Discord, client) => {
    const currentDate = new Date(Date.now());
    client.user.setPresence({
        activities: [
            { name: 'https://github.com/ultimatehecker/Heckernetic', type: ActivityType.Watching },
        ],
        status: 'online',
    });

    ["command_handler", "event_handler"].forEach((handler) => {
        require(`./handlers/${handler}`)(Discord, client);
    });

    console.log("Heckernetic Client PFP", client.user.displayAvatarURL());
    console.log(`Heckernetic has been successfully started at ${currentDate.getUTCMonth()}/${currentDate.getUTCDate()}/${currentDate.getUTCFullYear()} @ ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()} UTC`);
}