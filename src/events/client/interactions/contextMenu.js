const { Client, Discord, Interaction } = require('discord.js');
const colors = require(`../../../tools/colors.json`);
const Server = require(`../../../models/Server`);

/**
 * 
 * @param {Discord} Discord 
 * @param {Client} client 
 * @param {Interaction} interaction 
 */

module.exports = async (Discord, client, interaction) => {
    console.log(`Context Menu Interaction Recieved - ${interaction.commandName} from ${interaction.user.tag} in ${interaction.guild.name}`);

    let authorError = {
        name: "Level Up!",
        iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
    }

    if(!client.commands.has(interaction.commandName) || !interaction.guild) return;

    const query = {
        guildId: message.guild.id,
    };

    let serverDocument = await Server.findOne(query);

    if(!serverDocument) {
        const newServerDocument = new Server({
            guildId: message.guild.id,
            prefix: "h!",
            welcomeMessage: "{member-mention} has joined the server",
            welcomeChannelID: "none",
            leaveChannelID: "none",
            leaveMessage: "{member-tag} has left the server :(",
            reactionRoles: [],
        });

        await newServerDocument.save().catch((err) => {
            console.error("There was an error when saving the newly created server document: ", err);
        });
    } 

    try {
        await client.contexts.get(interaction.commandName).callback(Discord, client, interaction, serverDocument);
    } catch (error) {
        const errorEmbed = new Discord.EmbedBuilder()
            .setAuthor(authorError)
            .setColor(colors["ErrorColor"])
            .setDescription(`An error was encountered while executing this command. The issue has been reported to the developer. We are sorry for the inconvenience.`);

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        console.error(`An error was encountered while executing the ${interaction.commandName} command: `, error);
    }
}