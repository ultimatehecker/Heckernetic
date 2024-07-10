const {ApplicationCommandOptionType, Client, Discord, Interaction } = require(`discord.js`)
const colors = require(`../../tools/colors.json`)

module.exports = {
    name: `rng`,
    description: `Generates a random number between a minimum and maximum value.`,
    defaultPermission: true,
    options: [
        {
            name: `minimum`,
            description: `The minimum value of the random number.`,
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
        {
            name: `maximum`,
            description: `The maximum value of the random number.`,
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    example: "/rng [minimum] [maximum]",
    usage: "/rng 1 20",

    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {
        await interaction.deferReply({ ephemeral: false });

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        let authorSuccess = {
            name: "RNG",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        let response = [Math.round(Math.random() * (Number(interaction.options.get("maximum")?.value) - Number(interaction.options.get("minimum")?.value)) + Number(interaction.options.get("minimum")?.value))];

        if(Number.isNaN(interaction.options.get("minimum")?.value) || Number.isNaN(interaction.options.get("maximum")?.value)){
			const nan = new Discord.EmbedBuilder()
				.setAuthor(authorError)
				.setColor(colors["ErrorColor"])
				.setDescription("That is not a number! Please enter a valid number.")

			return interaction.editReply({ embeds: [nan], allowedMentions: { repliedUser: true } });
        } else {
            const rng = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setColor(colors["MainColor"])
                .setDescription(`You got \`${response}\`!`)
                
            interaction.editReply({ embeds: [rng], allowedMentions: { repliedUser: true } });
        }
    }
}