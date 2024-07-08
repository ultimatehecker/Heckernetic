const {ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Interaction} = require('discord.js');
const colors = require(`../../tools/colors.json`);
const Discord = require('discord.js');
const { callback } = require('./info');

module.exports = {
    name: "discord",
    description: "Reponds with a link to invite yourself to the Support Server.",
    defaultPermission: true,
    options: [],
    type: "general",
    example: "/discord",
    usage: "/discord",
    //devOnly: false,
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
            name: "Heckernetic Support Server",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const discordInvite = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Support Server").setStyle(ButtonStyle.Link).setURL('https://discord.gg/4hv23VguQY'))

        const discord = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription('Heckernetic has a support server where you can ask questions, get help, report bugs, and suggest features. Join the server by clicking the button below.')

        interaction.editReply({ embeds: [discord], components: [discordInvite], allowedMentions: { repliedUser: true } });
    }
}