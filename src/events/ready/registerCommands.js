const areCommandsDifferent = require('../../utilities/areCommandsDifferent');
const getApplicationComands = require('../../utilities/getApplicationCommands');
const getLocalCommands = require('../../utilities/getLocalCommands');
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationComands(client, process.env.GUILD_ID);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            const existingCommand = await applicationCommands.cache.find((command) => command.name === name);

            if(existingCommand) {
                if(localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Successfully deleted the command: ${name}`);
                    continue;
                }

                if(areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    });

                    console.log(`Successfully edited the command: ${name}`);
                } else {
                    if(localCommand.deleted) {
                        console.log(`Skipping registering the command ${name}, as it is set to delete.`);
                    }

                    continue;
                }

                await applicationCommands.create({
                    name,
                    description,
                    options,
                });

                console.log(`Successfully registered the command: ${name}`);
            }
        }
    } catch (error) {
        console.error(`Unfortunately, an error occurred: ${error}`);
    }
}