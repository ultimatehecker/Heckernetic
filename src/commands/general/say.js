const { ApplicationCommandOptionType, Client, Discord, Interaction } = require(`discord.js`);
const colors = require(`../../tools/colors.json`);

module.exports = {
    name: `say`,
    description: `Responds with something that you provide the bot to say.`,
    defaultPermission: true,
    options: [
        {
            name: `message`,
            description: `The message the bot should repeat.`,
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    example: "/say [message]",
    usage: "/say Summer Break!!!",

    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {
        await interaction.deferReply({ ephemeral: false });

        if (interaction.user.id === "724798908278112309" && interaction.options.get("message").value.startsWith("~")) {
			interaction.channel.send(`${interaction.options.get("message").value.slice(1)}`);

			const embed = new Discord.EmbedBuilder()
				.setColor(colors["MainColor"])
				.setDescription("Done! *This message will delete itself in 5 seconds!*")

			interaction.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } }).then(() => {
                setTimeout(function() {
                    interaction.deleteReply()
                }, 5000);
            });
		} else {
			interaction.editReply({ content: `**${interaction.user.tag}:** ${interaction.options.get("message").value}`, allowedMentions: { parse: ["everyone", "roles", "users"], users: [], roles: [] } });
		}
    }
}