const { ApplicationCommandOptionType, Client, Discord, Interaction } = require('discord.js');
const colors = require('../../tools/colors.json');
const Level = require('../../models/Level');
const User = require('../../models/User');
const axios = require('axios');

module.exports = {
    name: 'inventory',
    description: 'Responds with the balance of the user or the specified user',
    devOnly: true,
    testOnly: false,
    options: [
        {
            name: 'user',
            description: 'The user you want to see the bank balance of',
            type: ApplicationCommandOptionType.User,
            required: false,
        }
    ],
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
            name: `Balance`,
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        if(!interaction.inGuild()) {
            const serverOnly = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('This command can only be used in a server.')

            return interaction.reply({ embeds: [serverOnly], ephemeral: true });
        }

        /*

        if(interaction.options.getSubcommand() === "info") {
            const economyInfo = new Discord.EmbedBuilder()
                .setAuthor(authorSuccess)
                .setColor(colors["MainColor"])
                .setDescription(`
                    **What is SmartInventory?** \n SmartInventory allows you to show off your progress in a server in a whole new way. Instead of
                    just an ordinary balance, you can now show off your wealth in a more detailed way by building your inventory of items. \n
                    **How does it work?** \n By being active in a server and interacting with others, you will be able to earn minecraft ores
                    like iron, diamonds and netherite. Using these ores, you can build your inventory and create cool farms to show off
                    your wealth, just like in Minecraft. You will also be able to interact with other players to play games, trade items or
                    play some dirty tricks on those you don't like. \n
                `)

            return interaction.reply({ embeds: [economyInfo], ephemeral: true });
        }

        */

        const targetUserId = interaction.options.get("user")?.value || interaction.member.id;
        const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });
        const level = await Level.findOne({ userId: targetUserId, guildId: interaction.guild.id });
        await interaction.deferReply({ ephemeral: false });

        if(!user) {
            const user404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('The user you are trying to find has not created their profile.')

            return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
        } else if (!level) {
            const user404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('The user you are trying to find has not accumilated any experience. Please converse a little more to gain some experience.')

            return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
        }

        const iron = client.emojis.cache.find(emoji => emoji.name === "iron");
        const diamond = client.emojis.cache.find(emoji => emoji.name === "diamond");
        const netherite = client.emojis.cache.find(emoji => emoji.name === "netherite");
        const xpbottle = client.emojis.cache.find(emoji => emoji.name === "xpbottle");

        authorSuccess.name = `${interaction.member.user.displayName}'s Balance`;

        const balance = new Discord.EmbedBuilder()
            .setAuthor(authorSuccess)
            .setColor(colors["MainColor"])
            .setThumbnail(interaction.member.user.displayAvatarURL())
            .setDescription(`${iron} Iron: \`${user.iron}\` \n ${diamond} Diamonds: \`${user.diamonds}\` \n ${netherite} Netherite: \`${user.netherite}\` \n ${xpbottle} Lifetime Experience: \`${level.lifetimeXp}\``)

        interaction.editReply({ embeds: [balance], allowedMentions: { repliedUser: true } });
    }
}