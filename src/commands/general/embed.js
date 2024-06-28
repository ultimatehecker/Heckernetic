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
            required: trues,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'color',
            description: 'The color for the embed',
            required: false,
            type: ApplicationCommandOptionType.String,
            choices: [
                {
					name: "DEFAULT",
					value: 'Default'
				},
                {
					name: "WHITE",
					value: 'White'
				},
				{
					name: "AQUA",
					value: 'Aqua'
				},
				{
					name: "GREEN",
					value: 'Green'
				},
				{
					name: "BLUE",
					value: 'Blue'
				},
				{
					name: "YELLOW",
					value: 'Yellow'
				},
				{
					name: "PURPLE",
					value: 'Purple'
				},
				{
					name: "LUMINOUS VIVID PINK",
					value: 'LuminousVividPink'
				},
				{
					name: "GOLD",
					value: 'Gold'
				},
				{
					name: "ORANGE",
					value: 'Orange'
				},
				{
					name: "RED",
					value: 'Red'
				},
				{
					name: "GREY",
					value: 'Grey'
				},
				{
					name: "NAVY",
					value: 'Navy'
				},
				{
					name: "DARK AQUA",
					value: 'DarkAqua'
				},
				{
					name: "DARK GREEN",
					value: 'DarkGreen'
				},
				{
					name: "Dark BLUE",
					value: 'DarkBlue'
				},
				{
					name: "DARK PURPLE",
					value: 'DarkPurple'
				},
				{
					name: "DARK VIVID PINK",
					value: 'DarkVividPink'
				},
				{
					name: "DARK GOLD",
					value: 'DarkGold'
				},
				{
					name: "DARK ORANGE",
					value: 'DarkOrange'
				},
				{
					name: "DARK RED",
					value: 'DarkRed'
				},
				{
					name: "DARK GREY",
					value: 'DarkGrey'
				},
				{
					name: "LIGHT GREY",
					value: 'LightGrey'
				},
				{
					name: "BLURPLE",
					value: 'Blurple'
				},
				{
					name: "GREYPLE",
					value: 'Greyple'
				},
            ]
        },
        {
            name: 'footer',
            description: 'The footer for the embed',
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
        const footer = interaction.options.get("footer")?.value

        try {
            const embed = new Discord.EmbedBuilder()
            .setTitle(title)
            .setDescription(description)

            if (footer) embed.setFooter(footer)

            if (color) {
                embed.setColor(color)
            } else {
                embed.setColor(colors["Black"])
            }

            interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
            
        } catch (err) {
            const error = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription(`You must enter a valid ColorResolvable. Please click the button below to view the ColorResolvable options.`)

            interaction.editReply({ embeds: [error], components: [colorButton], allowedMentions: { repliedUser: true } });
        }
    }
}