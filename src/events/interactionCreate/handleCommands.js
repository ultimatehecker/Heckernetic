const { Client, Interaction, Discord } = require('discord.js');
const getLocalComands = require(`../../utilities/getLocalCommands`);
const developers = ["724798908278112309"]

/**
 * 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */

module.exports = async (client, interaction) => {
    const author = {
        name: "Error",
        iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp",
    }

    if(!interaction.isChatInputCommand()) return;
    const localCommands = getLocalComands();

    try {
        const commandObject = localCommands.find((comand) => comand.name === interaction.commandName);
        if(!commandObject) return;
        if(commandObject.devOnly) {
            if(!developers.includes(interaction.member.id)) {
                const missingPermissions = Discord.EmbedBuilder()
                    .setAuthor(author)
                    .setDescription(`Only developers are allowed to use this command.`)

                await interaction.reply({ embeds: [missingPermissions], ephemeral: true, allowedMentions: { repliedUser: false } });
                return;
            }
        }

        if(commandObject.testOnly) {
            if(!interaction.guild.id === process.env.GUILD_ID) {
                const wrongLocation = new Discord.EmbedBuilder()
                    .setAuthor(author)
                    .setDescription(`This command cannot be run here.`)

                await interaction.reply({ embeds: [wrongLocation], ephemeral: true, allowedMentions: { repliedUser: false } });
                return;
            }
        }

        if(commandObject.botPermissions?.length) {
            for(const permissions of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;
                if(!bot.permissions.has(permissions)) {
                    const missingPermissions = Discord.EmbedBuilder()
                        .setAuthor(author)
                        .setDescription(`I dont have the correct permissions to operate.`)

                    await interaction.reply({ embeds: [missingPermissions], ephemeral: true, allowedMentions: { repliedUser: false } });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);
    } catch (error) {
        console.error(`Unfortunately, an error occurred while running this command: ${error}`);
    }
}