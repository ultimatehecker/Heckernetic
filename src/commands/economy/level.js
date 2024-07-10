const { ApplicationCommandOptionType, AttachmentBuilder, Client, Discord, Interaction } = require('discord.js');
const { Font, RankCardBuilder, BuiltInGraphemeProvider } = require('canvacord');
const calculateLevelXp = require(`../../utilities/calculateLevelXp`);
const colors = require('../../tools/colors.json');
const Level = require(`../../models/Level`);
const fileSystem = require('fs');
const path = require('path');

module.exports = {
    name: 'level',
    description: 'Responds with the balance of the user or the specified user',
    defaultPermission: true,
    options: [
        {
            name: 'user',
            description: 'The user you want to see the level of',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        }
    ],
    example: '/level (user)',
    usage: '/level ultimate_hecker',
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

        const mentionedUserId = interaction.options.get('user')?.value;
        const targetUserId = mentionedUserId || interaction.user.id;
        const targetUserObject = await interaction.guild.members.fetch(targetUserId);

        const fetchedLevel = await Level.findOne({ userId: targetUserId, guildId: interaction.guild.id });

        if(!fetchedLevel) {
            const user404 = new Discord.EmbedBuilder()
                .setAuthor(authorError)
                .setColor(colors["Error"])
                .setDescription('The user you are trying to find has not accumilated any experience. Please converse a little more to gain some experience.')

            return interaction.editReply({ embeds: [user404], allowedMentions: { repliedUser: true } });
        }

        let allLevels = await Level.find({ guildId: interaction.guild.id }).select('-_id userId level xp');
        allLevels.sort((a, b) => {
            if(a.level === b.level) {
                return b.xp - a.xp;
            } else {
                return b.level - a.level;
            }
        });

        let currentRank = allLevels.findIndex((level) => level.userId === targetUserId) + 1;

        Font.loadDefault();
        //Font.fromFileSync(path.join(__dirname, '..', '..', 'tools', 'fonts', 'PlaywriteHU.ttf'));

        let backgroundImage = path.join(__dirname, '../../images/rankcard.jpg');
        const bufferedCard = fileSystem.readFileSync(backgroundImage);

        const rank = new RankCardBuilder()
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
    }
}