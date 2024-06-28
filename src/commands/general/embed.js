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
                    name: 'Default',
                    value: 'Default'
                },
                {
                    name: 'White',
                    value: 'White'
                },
                {
                    name: 'Aqua',
                    value: 'Aqua'
                },
                {
                    name: 'Green',
                    value: 'Green'
                },
                {
                    name: 'Blue',
                    value: 'Blue'
                },
                {
                    name: 'Yellow',
                    value: 'Yellow'
                },
                {
                    name: 'Purple',
                    value: 'Purple'
                },
                {
                    name: 'Luminous Vivid Pink',
                    value: 'LuminousVividPink'
                },
                {
                    name: 'Fuchsia',
                    value: 'Fuchsia'
                },
                {
                    name: 'Gold',
                    value: 'Gold'
                },
                {
                    name: 'Orange',
                    value: 'Orange'
                },
                {
                    name: 'Red',
                    value: 'Red'
                },
                {
                    name: 'Grey',
                    value: 'Grey'
                },
                {
                    name: 'Navy',
                    value: 'Navy'
                },
                {
                    name: 'Dark Aqua',
                    value: 'DarkAqua'
                },
                {
                    name: 'Dark Green',
                    value: 'DarkGreen'
                },
                {
                    name: 'Dark Blue',
                    value: 'DarkBlue'
                },
                {
                    name: 'Dark Purple',
                    value: 'DarkPurple'
                },
                {
                    name: 'Dark Vivid Pink',
                    value: 'DarkVividPink'
                },
                {
                    name: 'Dark Gold',
                    value: 'DarkGold'
                },
                {
                    name: 'Dark Orange',
                    value: 'DarkOrange'
                },
                {
                    name: 'Dark Red',
                    value: 'DarkRed'
                },
                {
                    name: 'Dark Grey',
                    value: 'DarkGrey'
                },
                {
                    name: 'Darker Grey',
                    value: 'DarkerGrey'
                },
                {
                    name: 'Light Grey',
                    value: 'LightGrey'
                },
                {
                    name: 'Dark Navy',
                    value: 'DarkNavy'
                },
                {
                    name: 'Blurple',
                    value: 'Blurple'
                },
                {
                    name: 'Greyple',
                    value: 'Greyple'
                },
                {
                    name: 'Dark But Not Black',
                    value: 'DarkButNotBlack'
                },
                {
                    name: 'Not Quite Black',
                    value: 'NotQuiteBlack'
                },
                {
                    name: 'Random',
                    value: 'Random'
                },
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