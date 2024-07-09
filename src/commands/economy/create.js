const { Client, Discord, Interaction } = require('discord.js');
const colors = require('../../tools/colors.json');
const User = require(`../../models/User`);

module.exports = {
    name: 'create',
    description: 'Creates a database entry for the user for the economy system.',
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
            name: `Successfuly Registered`,
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        if(!interaction.inGuild()) {
            const serverOnly = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["ErrorColor"])
                .setDescription('This command can only be used in a server.')

            return interaction.reply({ embeds: [serverOnly], allowedMentions: { repliedUser: true } });
        }

        try {
            await interaction.deferReply({ ephemeral: false });

            let query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            }

            let user = await User.findOne(query);

            if(user) {
                const user404 = new Discord.EmbedBuilder()
                    .setAuthor(authorError)
                    .setColor(colors["Error"])
                    .setDescription('Tou have already created your account.')

                return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
            } else {
                const ssn = Math.floor(Math.random()*8+1)+Math.random().toString().slice(2,10);
                user = new User({
                    ...query,
                    lastDaily: new Date().setDate(new Date().getDate() - 1),
                    ssn: ssn,
                    infractions: 0,
                    netherite: 0,
                    diamonds: 0,
                    iron: 0,
                    infractions: [],
                    inventory: []
                });

                user.bank.push({ netherite: 0, diamonds: 0, iron: 0 });

                await user.save();

                const userSuccess = new Discord.EmbedBuilder()
                    .setAuthor(authorSuccess)
                    .setColor(colors["MainColor"])
                    .setDescription('You have successfully created your account.')
                
                return interaction.editReply({ embeds: [userSuccess], allowedMentions: { repliedUser: true } });
            }
        } catch (error) {
            console.error("There was an error when creating the account: ", error)
        }
    }
}