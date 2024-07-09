const { Client, Discord, Interaction } = require('discord.js');
const colors = require('../../tools/colors.json');
const User = require('../../models/User');

const dailyAmount = {
    netherite: 0,
    diamonds: 1,
    iron: 5
};

module.exports = {
    name: 'daily',
    description: 'Responds with the balance of the user or the specified user',
    devOnly: true,
    testOnly: false,
    // options: Object[]
    deleted: false,

    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {

        let authorError = {
            name: "Error",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        let authorSuccess = {
            name: `Daily Bonus`,
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        if(!interaction.inGuild()) {
            const serverOnly = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('This command can only be used in a server.')

            return interaction.reply({ embeds: [serverOnly], ephemeral: true });
        }

        try {
            await interaction.deferReply({ ephemeral: false });

            let query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            }

            let user = await User.findOne(query);

            if(user) {
                const lastDaily = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString();

                if(lastDaily === currentDate) {
                    const dailyError = new Discord.EmbedBuilder()
                        .setAuthor(authorError)
                        .setColor(colors["ErrorColor"])
                        .setDescription(`You have already claimed your daily bonus for today. Please try again tomorrow.`);

                    return interaction.editReply({ embeds: [dailyError], allowedMentions: { repliedUser: true } });
                }

                user.lastDaily = new Date();
            } else {
                const user404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["ErrorColor"])
                    .setDescription('You have not created your account yet. Please create your account by using the \`/create\` command.');

                return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
            }

            user.netherite += dailyAmount.netherite;
            user.diamonds += dailyAmount.diamonds;
            user.iron += dailyAmount.iron;

            await user.save();

            const dailySuccess = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setColor(colors["MainColor"])
                .setDescription(`You have claimed your daily bonus! You have received \`${user.iron}\` iron, \`${user.diamonds}\` diamonds, and \`${user.netherite}\` netherite. Run \`/balance\` in order to see your updated balance.`)

            interaction.editReply({ embeds: [dailySuccess], allowedMentions: { repliedUser: true } });

        } catch (error) {
            console.error("There was an error when trying to give the user their daily bonus: ", error);
        }
    }
}