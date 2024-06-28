const { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, Client, Interaction, resolveColor } = require('discord.js');
const colors = require(`../../tools/colors.json`);
const Discord = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Gives people credit where credit is due for making the bot possible.',
    devOnly: true,
    testOnly: false,
    options: [
        {
            name: 'title',
            description: 'The title for the embed',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'color',
            description: 'The color for the embed',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
                    name: 'WHITE',
                    value: 'White'
                }
            ]
        },
        {
            name: 'description',
            description: 'The description for the embed',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    deleted: false,
  
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        const colorButton = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Color Options").setStyle(ButtonStyle.Link).setURL('https://discord.js.org/docs/packages/discord.js/14.15.2/ColorResolvable:TypeAlias'));

        const title = interaction.options.get("title")?.value
        const color = interaction.options.get("color")?.value
        const description = interaction.options.get("description")?.value

        if(!title || !description) {
            const error = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription('You need to provide a title and a description for the embed. For a list of color options, click the button below.')

            interaction.editReply({ embeds: [error], components: [colorButton], allowedMentions: { repliedUser: true } });
        }

        const embed = new Discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)

            if (color) {
                embed.setColor(color)
            } else {
                embed.setColor(colors["Black"])
            }

        interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
    }
}