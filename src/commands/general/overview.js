const { Client, Discord, Interaction } = require('discord.js');
const colors = require(`../../tools/colors.json`);

module.exports = {
    name: 'overview',
    description: 'Responds with a brief overview of the server.',
    devOnly: true,
    testOnly: false,
    // options: Object[]
    deleted: false,

    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {
        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Server Overview",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const overview = new Discord.EmbedBuilder()
            .setTitle(`${interaction.guild.name}'s Overview`)
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`Here is a brief overview of ${interaction.guild.name}.`)
            .setThumbnail(interaction.guild.iconURL())
            .addFields([
                { name: "Member Count", value: `\`${interaction.guild.members.cache.size}\``, inline: true },
				{ name: "Discord Server Role Count", value: `\`${interaction.guild.roles.cache.size}\``, inline: true },
				{ name: "Server Owner", value: `\`${interaction.guild.members.resolve(interaction.guild.ownerId).user.tag}\``, inline: true },
				{ name: "Channel Count", value: `\`${interaction.guild.channels.cache.size}\``, inline: true },
				{ name: "Server ID", value: `\`${interaction.guild.id}\``, inline: true },
				{ name: "Date Created", value: `\`${interaction.guild.createdAt.getMonth()}/${interaction.guild.createdAt.getDate()}/${interaction.guild.createdAt.getFullYear()}\``, inline: true },
			]);

        interaction.editReply({ embeds: [overview], allowedMentions: { repliedUser: true } });
    }
}