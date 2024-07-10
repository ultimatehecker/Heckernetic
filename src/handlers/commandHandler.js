const getAllFiles = require('../utilities/getAllFiles');
const { Client, Discord} = require('discord.js');
const fileSystem = require('fs');
const path = require('path');

let slashCommands;

/**
 * 
 * @param {Discord} Discord 
 * @param {Client} client 
 */

module.exports = (Discord, client) => {
    const commandFolders = fileSystem.readdirSync(`./src/commands/`);
    const basicCommands = new Discord.Collection();
    let folder;
    console.time("Finished Loading Slash (/) Command Data in");

    for (folder of commandFolders) {
        const commandFiles = fileSystem.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`)

            if(command.name) {
                basicCommands.set(command.name, command)
            } else {
                continue;
            }
        }
    }                                      

    client.user.id = process.env.CLIENT_ID
    slashCommands = basicCommands.map((command) => {
        let slashCommand = {
            name: command.name,
            type: command.type,
            description: command.description,
            options: command.options,
            defaultPermission: command.defaultPermission,
            example: command.example,
            usage: command.usage,
            callback: command.callback
        }

        if(fileSystem.existsSync(`./src/commands/${folder}/${command.name}/`)) {
            let subDirectory = fileSystem.readdirSync(`./src/commands/${folder}/${command.name}/`, { withFileTypes: true });
            for(let entry of subDirectory) {
                if(entry.isDirectory()) {
                    if (entry.name === command.name) continue;
                    let groupMeta = require(`../commands/${folder}/${command.name}/${entry.name}/.meta.js`);
                    let index = slashCommand.options.push({ 
                        name: entry.name,
                        description: groupMeta.description,
                        type: "SUB_COMMAND_GROUP",
                        options: [],
                    }) - 1;

                    let subCommandGrp = fileSystem
                        .readdirSync(`./src/commands/${folder}/${command.name}/${entry.name}/`)
                        .filter((file) => file.endsWith('.js'));

                    for(let subGrpCommandName of subCommandGrp) {
                        if (subGrpCommandName === ".meta.js") continue;
                        const subGrpCommand = require(`../commands/${folder}/${command.name}/${entry.name}/${subGrpCommandName}`);
                        slashCommand.options[index].options.push({
                            name: subGrpCommand.name,
                            description: subGrpCommand.description,
                            type: "SUB_COMMAND",
                            options: subGrpCommand.options,
                            example: subGrpCommand.example,
                            usage: subGrpCommand.usage,
                            callback: subGrpCommand.callback
                        });
                    }
                } else if(entry.name.endsWith('.js')) {
                    let subCommand = require(`../commands/${folder}/${command.name}/${entry.name}`);
                    slashCommand.options.push({
                        name: subCommand.name,
                        description: subCommand.description,
                        type: "SUB_COMMAND",
                        options: subCommand.options,
                        example: subCommand.example,
                        usage: subCommand.usage,
                        callback: subCommand.callback
                    });
                }
            }      
        }

        client.commands.set(slashCommand.name, slashCommand);
        return slashCommand;
    });

    console.timeEnd("Finished Loading Slash (/) Command Data in");

    if(process.argv.includes('-d')) {
        if(!process.env.GUILD_ID) {
            throw new ReferenceError("❌ Please provide a GUILD_ID in the .env file to deploy commands to a specific guild.");
        }

        console.time(`Finished Sending Slash (/) Command Data to Discord for Guild ${process.env.GUILD_ID} in`);
        client.application.commands.set(slashCommands, process.env.GUILD_ID).then(() => {
            console.timeEnd(`Finished Sending Slash (/) Command Data to Discord for Guild ${process.env.GUILD_ID} in`);
        });
    } else if(process.argv.includes('-D')) {
        console.time(`Finished Sending Slash (/) Command Data to Discord Globally in`);
        client.application.commands.set(slashCommands).then(() => {
            console.timeEnd(`Finished Sending Slash (/) Command Data to Discord Globally in`);
        });
    }else if(process.argv.includes('-r')) {
        client.application.commands.set([], process.env.GUILD_ID).then(() => {
            console.log(`⚠️ Successfully purged all commands (/) from the guild ${process.env.GUILD_ID}`);
        });
    } else if(process.argv.includes('-R')) {
        client.application.commands.set([]).then(() => {
            console.log(`⛔ Successfully purged all commands (/) globally.`);
        });
    }
}

module.exports.slashCommands = slashCommands;