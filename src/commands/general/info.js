const { Client, Interaction } = require('discord.js');
const colors = require(`../../tools/colors.json`);
const importPrettyMS = import('pretty-ms');
const Discord = require('discord.js');
const os = require('os-utils');

module.exports = {
    name: 'info',
    description: 'Responds with various information about the bot and the server',
    devOnly: true,
    testOnly: false,
    //options: Object[],
    deleted: false,
  
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Heckernetic Information",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const prettyMS = (await (importPrettyMS)).default;

        os.cpuUsage((percentage) => {
            const information = new Discord.EmbedBuilder()
                .setAuthor(author) 
                .setColor(colors["MainColor"])
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription('Heckernetic is a multi-purpose Discord bot aimed to simplify servers and allow everything to be centralized to one Discord bot.')
                .setFields([
                    { name: "Uptime", value: `\`${prettyMS(os.processUptime() * 1000, {verbose: true,})}\``, inline: true },
					{ name: "Latency", value: `Bot's Latency: \`${Date.now() - interaction.createdTimestamp}\` ms \n API Latency: \`${Math.round(client.ws.ping)}\` ms`, inline: true },
					{ name: "System", value: `CPU Usage: \`${Math.round((percentage * 100) / os.cpuCount())}%\` \n RAM Usage: \`${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB\``, inline: true },
					{ name: "Popularity", value: `Number of Servers: \`${client.guilds.cache.size}\``, inline: true },
                ])

            interaction.editReply({ embeds: [information], allowedMentions: { repliedUser: true } });
        });
    }
}