const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Discord, Interaction } = require('discord.js');
const colors = require(`../../tools/colors.json`);

module.exports = {
    name: 'github',
    description: 'Responds with the link to Hecknetic\'s GitHub Repository.',
    defaultPermission: true,
    options: [],
    example: '/github',
    usage: '/github',
    //devOnly: true,
    //testOnly: false,
    //deleted: false,
  
    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {
        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "GitHub Repository",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const button = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("GitHub Repository").setStyle(ButtonStyle.Link).setURL('https://github.com/ultimatehecker/Heckernetic'))
        const github = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription('Heckernetic is an open-source Discord bot. You can view the source code on GitHub where you can open issues, view the codebase and potentially contribute to the project.')

        interaction.editReply({ embeds: [github], components: [button], allowedMentions: { repliedUser: true } });
    }   
}