const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Discord, Interaction } = require('discord.js');
const colors = require(`../../tools/colors.json`);
module.exports = {
    name: "invite",
    description: "Responds with a link to invite Heckernetic to your server.",
    devOnly: false,
    testOnly: false,
    //options: Object[],
    deleted: false,

    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {
        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Heckernetic Invite Link",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const botInvite = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Invite Heckernetic").setStyle(ButtonStyle.Link).setURL('https://discord.com/oauth2/authorize?client_id=1148422189129941032&permissions=8&integration_type=0&scope=applications.commands+bot'));

        const invite = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription('Invite Heckernetic to your server by clicking the button below. Heckernetic requires the Administrator permission to function properly.')

        interaction.editReply({ embeds: [invite], components: [botInvite], allowedMentions: { repliedUser: true } });
    }
}