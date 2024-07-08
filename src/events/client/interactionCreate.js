const handleCommand = require(`./interactions/command`);
const handleComponent = require(`./interactions/component`);
const { Client, Discord, Interaction} = require(`discord.js`);
const handleContextMenu = require(`./interactions/contextMenu`);

/**
 * @param {Discord} Discord
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = (Discord, client, interaction) => {
    if(interaction.isCommand()) {
        return handleCommand(Discord, client, interaction);
    }

    if(interaction.isMessageComponent()) {
        return handleComponent(Discord, client, interaction);
    }

    if(interaction.isContextMenu()) {
        return handleContextMenu(Discord, client, interaction);
    }
}