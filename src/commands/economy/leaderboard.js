const { AttachmentBuilder, Client, Discord, Interaction } = require('discord.js');
const { BuiltInGraphemeProvider, Font, LeaderboardBuilder } = require('canvacord');
const calculateLevelXp = require(`../../utilities/calculateLevelXp`);
const colors = require('../../tools/colors.json');
const Level = require(`../../models/Level`);
const fileSystem = require('fs');
const path = require('path');

module.exports = {
    name: 'leaderboard',
    description: 'Responds with the balance of the user or the specified user',
    defaultPermission: true,
    options: [],
    example: '/leaderboard',
    usage: '/leaderboard',
    //devOnly: true,
    //testOnly: false,
    //deleted: false,

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

        if(!interaction.inGuild()) {
            const serverOnly = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('This command can only be used in a server.')

            return interaction.reply({ embeds: [serverOnly], ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: false });

        const fetchedLevel = await Level.find();

        /*

        if(!fetchedLevel) {
            const user404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('There aren\'t any members on the leaderboard yet')

            return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
        }

        */

        fetchedLevel.sort((a, b) => {
            if(a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        }).filter(user => client.users.cache.has(user.userId)).slice(0, 10); // Keep only the top 10 users

        const leaderboardEntries = [];
        let rankNumber = 1;

        for(const members of fetchedLevel) {
            const member = await client.users.fetch(members.userId);
            const avatar = member.displayAvatarURL({ format: 'png', forceStatic: true });
            const username = member.username;
            const displayName = member.displayName;
            const level = members.level;
            const xp = members.xp;
            const rank = rankNumber;

            leaderboardEntries.push({ avatar, username, displayName, level, xp, rank });
            rankNumber++;
        }

        Font.loadDefault();
        //Font.fromFileSync(path.join(__dirname, '..', '..', 'tools', 'fonts', 'PlaywriteHU.ttf'));

        let backgroundImage = path.join(__dirname, '../../images/rankcard.jpg');
        const bufferedCard = fileSystem.readFileSync(backgroundImage);
        const totalMembers = interaction.guild.memberCount;

        const leaderboard = new LeaderboardBuilder() 
            .setHeader({ title: `${interaction.guild.name} Leaderboard`, image: interaction.guild.iconURL()  || client.user.displayAvatarURL(), subtitle: `${totalMembers} Members` })
            .setGraphemeProvider(BuiltInGraphemeProvider.FluentEmojiHighContrast)
            .setBackground(bufferedCard)
            .setVariant(`default`)
            .setPlayers(leaderboardEntries)

        leaderboard.build().then((data) => {
            const attachment = new AttachmentBuilder(data, 'leaderboard.png');
            return interaction.editReply({ files: [attachment], allowedMentions: { repliedUser: true } });
        });
    }
}