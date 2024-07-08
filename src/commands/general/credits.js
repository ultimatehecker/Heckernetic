const { Client, Interaction } = require('discord.js');
const colors = require(`../../tools/colors.json`);
const Discord = require('discord.js');

module.exports = {
    name: 'credits',
    description: 'Gives people credit where credit is due for making the bot possible.',
    defaultPermission: true,
    options: [],
    type: 'general',
    example: '/credits',
    usage: '/credits',
    //devOnly: true,
    //testOnly: false,
    //deleted: false,
  
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Credits",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const credits = new Discord.EmbedBuilder()
		    .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`Heckernetic was made by \`ultimate_hecker#1165\` using Discord.js v14! Heckernetic is fully open source under the license GPL 3.0. \n \n Check out the full GitHub Repository: https://github.com/ultimatehecker/Heckernetic \n \n Join the support server at: https://discord.gg/4hv23VguQY`)

		interaction.editReply({ embeds: [credits], allowedMentions: { repliedUser: true } });

    }
}