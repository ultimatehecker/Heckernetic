const calculateLevelXp = require(`../../utilities/calculateLevelXp`);
const { Client, Discord, Message } = require('discord.js');
const getRandomXp = require('../../functions/getRandomXp');
const colors = require(`../../tools/colors.json`);
const Server = require(`../../models/Server`);
const Level = require(`../../models/Level`);
const cooldowns = new Set();

function splitCommandLine(commandLine) {
	var doubleDoubleQuote = "<DDQ>";
	while (commandLine.indexOf(doubleDoubleQuote) > -1) doubleDoubleQuote += "@";
	var noDoubleDoubleQuotes = commandLine.replace(/""/g, doubleDoubleQuote);
	var spaceMarker = "<SP>";
	while (commandLine.indexOf(spaceMarker) > -1) spaceMarker += "@";

	var noSpacesInQuotes = noDoubleDoubleQuotes.replace(/"([^"]*)"?/g, (fullMatch, capture) => {
			return capture.replace(/ /g, spaceMarker).replace(RegExp(doubleDoubleQuote, "g"), '"');
    });

	var mangledParamArray = noSpacesInQuotes.split(/ +/);
	var paramArray = mangledParamArray.map((mangledParam) => {
		return mangledParam.replace(RegExp(spaceMarker, "g"), " ").replace(RegExp(doubleDoubleQuote, "g"), "");
	});

	return paramArray;
}

/**
 * 
 * @param {Discord} Discord 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (Discord, client, message) => {

    let authorLevelUp = {
        name: "Level Up!",
        iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
    }

    let authorError = {
        name: "Level Up!",
        iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
    }

    if(message.author.bot) return;
    let serverDocument

    const query = {
        guildId: message.guild.id,
    };

    const levelQuery = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

    serverDocument = await Server.findOne(query);
    const level = await Level.findOne(levelQuery);

    try {
        if(!serverDocument) {
            const newServerDocument = new Server({
                guildId: message.guild.id,
                prefix: "h!",
                welcomeMessage: "{member-mention} has joined the server",
                welcomeChannelID: "none",
                leaveChannelID: "none",
                leaveMessage: "{member-tag} has left the server :(",
                reactionRoles: [],
            });
    
            await newServerDocument.save().catch((err) => {
                console.error("There was an error when saving the newly created server document: ", err);
            });
        } 
    
        if(level) {
            const calculatedXpDistribution = getRandomXp.randomizeXp(level.level);
    
            level.xp += calculatedXpDistribution;
            level.lifetimeXp += calculatedXpDistribution;
    
            if (level.xp > calculateLevelXp(level.level)) {
                level.xp = level.xp - calculateLevelXp(level.level);
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
                }, (60000 - (level.level * 1000)));
            }
        } else {
            const newLevel = new Level({
              userId: message.author.id,
              guildId: message.guild.id,
              xp: xpToDistribute,
            });
      
            await newLevel.save();
            cooldowns.add(message.author.id);
            setTimeout(() => {
              cooldowns.delete(message.author.id);
            }, 60000);
        }
    } catch (error) {
        console.error("There was an error somewhere: ", error)
    }

    if (!message.content.startsWith(serverDocument.prefix) || message.author.bot) return;

    const arguments = splitCommandLine(message.content.slice(1));
    const cmd = arguments.shift().toLowerCase();

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    if(!command) return;

    const unsupported = new Discord.EmbedBuilder()
        .setAuthor(authorError)
        .setColor(colors["ErrorColor"])
        .setDescription(`It seems like your trying to use message-based commands. Message-based commands have been depricated by the Discord API in favor of slash commands. Please use slash commands instead.`);

    message.reply({ embeds: [unsupported], allowedMentions: { repliedUser: true } });
}