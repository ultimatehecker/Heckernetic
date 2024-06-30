const calculateLevelXp = require(`../../utilities/calculateLevelXp`);
// const getRandomXp = require('../../functions/getRandomXp');
const { Client, Message } = require('discord.js');
const colors = require(`../../tools/colors.json`);
const Level = require('../../models/Level');
const Discord = require('discord.js');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (client, message) => {

    let authorLevelUp = {
        name: "Level Up!",
        iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
    }

    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;
    const xpToDistribute = getRandomXp(5, 15);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

    try {
        const level = await Level.findOne(query);

        if(level) {
            level.xp += xpToDistribute;
            console.log(level.xp)

            if (level.xp > calculateLevelXp(level.level)) {
                level.xp = 0;
                level.level += 1;

                const levelUp = new Discord.EmbedBuilder()
                    .setAuthor(authorLevelUp)
                    .setColor(colors["MainColor"])
                    .setDescription(`Congratulations ${message.author.username}! You've leveled up to level \`${level.level}\`!`);

                message.reply({ embeds: [levelUp], allowedMentions: { repliedUser: true } });

                await level.save().catch((err) => {
                    console.error("There as an error when saving the level: ", err);
                });

                cooldowns.add(message.author.id);
                setTimeout(() => {
                    cooldowns.delete(message.author.id);
                }, 60000);
            }
        } else {
            const newLevel = new Level({
              userId: message.author.id,
              guildId: message.guild.id,
              xp: xpToDistribute,
            });
      
            await newLevel.save();
            console.log(newLevel)
            cooldowns.add(message.author.id);
            setTimeout(() => {
              cooldowns.delete(message.author.id);
            }, 60000);
        }
    } catch (err) {
        console.error("There was an error when assigning xp: ", err);
    }
}