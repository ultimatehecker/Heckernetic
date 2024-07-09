const { ApplicationCommandOptionType, AttachmentBuilder, Client, Discord, Interaction } = require('discord.js');
const { Font, LeaderboardBuilder, BuiltInGraphemeProvider, LeaderboardBuilder } = require('canvacord');
const calculateLevelXp = require(`../../utilities/calculateLevelXp`);
const colors = require('../../tools/colors.json');
const Level = require(`../../models/Level`);
const fileSystem = require('fs');
const path = require('path');

module.exports = {
    name: 'leaderboard',
    description: 'Responds with the balance of the user or the specified user',
    devOnly: true,
    testOnly: false,
    deleted: false,

    /**
     * @param {Discord} Discord
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (Discord, client, interaction, serverDocument) => {

        async function getOrderedLeaderboard() {
            let leaderboard = [];
            let rankIndex = 1;

            for (let i = 0; i < fetchedLevel.length; i++) {
                let { User, level, xp } = fetchedLevel[i];
        
                let member = await client.users.fetch(User);
        
                leaderboard.push({
                  avatar: member.displayAvatarURL(),
                  username: member.username,
                  displayName: member.globalName,
                  level: level,
                  xp: xp,
                  rank: rankIndex,
                });
        
                rankIndex++;
              }
        
              return leaderboard;
            }

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

        const fetchedLevel = await Level.find({ guildId: interaction.guild.id });
        console.log(fetchedLevel);

        if(!fetchedLevel) {
            const user404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('There aren\'t any members on the leaderboard yet')

            return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
        }

        const leaderboardUsers = await getOrderedLeaderboard();

        Font.loadDefault();
        const leaderboard = new LeaderboardBuilder() 
            .setHeader({ title: `${interaction.guild.name} Leaderboard`, image: interaction.guild.iconURL()  || client.user.displayAvatarURL(), subtitle: `${guild.members.cache.size} Members`, })
            .setVariant(`horizontal`)
            .setPlayers(leaderboardUsers)

        /*

        let backgroundImage = path.join(__dirname, '../../images/rankcard.jpg');
        const bufferedCard = fileSystem.readFileSync(backgroundImage);

        const rank = new LeaderboardBuilder()
            .setDisplayName(targetUserObject.displayName)
            .setUsername(targetUserObject.user.username)
            .setAvatar(targetUserObject.user.displayAvatarURL({ format: 'jpg', size: 512 }))
            .setBackground(bufferedCard)
            .setGraphemeProvider(BuiltInGraphemeProvider.FluentEmojiHighContrast)
            .setStatus(targetUserObject.presence.status)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            .setLevel(fetchedLevel.level)
            .setRank(currentRank)
            .setOverlay(40)
            .setTextStyles({
                level: "LEVEL:", 
                xp: "EXP:", 
                rank: "RANK:",
            })
            .setStyles({
                progressbar: {
                  thumb: {
                    style: {
                      backgroundColor: "#d61a1a",
                    },
                  },
                },
            });
            
        rank.build().then((data) => {
            const attachment = new AttachmentBuilder(data, 'rank.png');
            return interaction.editReply({ files: [attachment], allowedMentions: { repliedUser: true } });
        });

        */
    }
}