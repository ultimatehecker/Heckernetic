const { ApplicationCommandOptionType, AttachmentBuilder, Client, Interaction } = require('discord.js');
const calculateLevelXp = require(`../../utilities/calculateLevelXp`);
const { Font, RankCardBuilder } = require('canvacord');
const colors = require('../../tools/colors.json');
const Level = require(`../../models/Level`);
const Discord = require('discord.js');

module.exports = {
    name: 'level',
    description: 'Responds with the balance of the user or the specified user',
    devOnly: true,
    testOnly: false,
    options: [
        {
            name: 'user',
            description: 'The user you want to see the level of',
            type: ApplicationCommandOptionType.Mentionable,
            required: false,
        }
    ],
    deleted: false,

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {

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

        const fetchedLevel = Level.findOne({ userId: targetUserId, guildId: interaction.guild.id });

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

        const rank = new RankCardBuilder()
            .setAvatar(targetUserObject.user.displayAvatarURL({ size: 256 }))
            .setRank(currentRank)
            .setLevel(fetchedLevel.level)
            .setCurrentXP(fetchedLevel.xp)
            .setRequiredXP(calculateLevelXp(fetchedLevel.level))
            // .setStatus(targetUserObject.presence.status)
            // .setRank('#FFA500', 'COLOR')
            .setUsername(targetUserObject.user.username)
            // .setDiscriminator(targetUserObject.user.discriminator)
            .setTextStyles({
                level: "LEVEL:", 
                xp: "EXP:", 
                rank: "RANK:",
            });
           
           const image = await rank.build({ format: 'png',});
           const attachment = new AttachmentBuilder(image);

        interaction.editReply({ files: [attachment], allowedMentions: { repliedUser: true } });
    }
}