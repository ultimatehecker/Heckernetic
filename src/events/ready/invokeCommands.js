const areCommandsDifferent = require('../../utilities/areCommandsDifferent');
const getApplicationCommands = require('../../utilities/getApplicationCommands');
const getLocalCommands = require('../../utilities/getLocalCommands');
const AsciiTable = require('ascii-table')
const { Client } = require('discord.js');

/**
 * 
 * @param {Client} client 
 */


module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, process.env.GUILD_ID);
        let commandTable = new AsciiTable('Heckernetic Commands');
        let iteration = 0
    
        for (const localCommand of localCommands) {
          const { name, description, options } = localCommand;
          const existingCommand = await applicationCommands.cache.find((cmd) => cmd.name === name);

          iteration++;

          if(process.argv.includes('-r')) {
            client.application.commands.set([], process.env.GUILD_ID).then(() => {
              console.log(`⚠️ Successfully purged all commands (/) from the guild ${process.env.GUILD_ID}`);
            });
          } else if(process.argv.includes('-R')) {
            client.application.commands.set([]).then(() => {
              console.log(`⛔ Successfully purged all commands (/) globally.`);
            });
          } else if (existingCommand) {
            if (localCommand.deleted) {
              await applicationCommands.delete(existingCommand.id);
              //console.log(`🗑 Successfuly deleted the command "${name}".`);
              commandTable.addRow(iteration, name, `🗑 Successfuly deleted`);
              continue;
            }
    
            if (areCommandsDifferent(existingCommand, localCommand)) {
              await applicationCommands.edit(existingCommand.id, { description, options });
              //console.log(`🔁 Successfully updated the edited command "${name}".`);
              commandTable.addRow(iteration, name, `🔁 Successfully updated`);
            }

          } else {
            if (localCommand.deleted) {
              //console.log(`⏩ Skipping registering the command "${name}". as it is marked as deleted`);
              commandTable.addRow(iteration, name, `🔁 Skipping registering, set to delete`);
              continue;
            }
    
            await applicationCommands.create({ name, description, options });
            //console.log(`👍 Successfully registered the command "${name}."`);
            commandTable.addRow(iteration, name, `🔁 Successfully registered`);
          }

          commandTable.setHeading('', 'Command', 'Status')
            .addRow(iteration, name, `h`);
        }

        console.log(commandTable.toString())
      } catch (error) {
        console.log(`There was an error: ${error}`);
      }
};