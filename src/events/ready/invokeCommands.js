const areCommandsDifferent = require('../../utilities/areCommandsDifferent');
const getApplicationCommands = require('../../utilities/getApplicationCommands');
const getLocalCommands = require('../../utilities/getLocalCommands');
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */


module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, process.env.GUILD_ID);
    
        for (const localCommand of localCommands) {
          const { name, description, options } = localCommand;
          const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);
    
          if (existingCommand) {
            if (localCommand.deleted) {
              await applicationCommands.delete(existingCommand.id);
              console.log(`🗑 Successfuly deleted the command "${name}".`);
              continue;
            }
    
            if (areCommandsDifferent(existingCommand, localCommand)) {
              await applicationCommands.edit(existingCommand.id, { description, options });
              console.log(`🔁 Successfully updated the edited command "${name}".`);
            }

          } else {
            if (localCommand.deleted) {
              console.log(`⏩ Skipping registering the command "${name}". as it is marked as deleted`);
              continue;
            }
    
            await applicationCommands.create({ name, description, options });
            console.log(`👍 Successfully registered the command "${name}."`);
          }
        }
      } catch (error) {
        console.log(`TThere was an error: ${error}`);
      }
};