const { ApplicationCommandOptionType, Client, Discord, Interaction } = require('discord.js');
const colors = require('../../tools/colors.json');
const axios = require('axios');

module.exports = {
    name: 'xkcd',
    description: 'Responds with the xkcd of the day or the specified comic numbers',
    devOnly: true,
    testOnly: false,
    options: [
    {
        name: 'number',
        description: 'The comic number you want to see',
        type: ApplicationCommandOptionType.Integer,
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
        await interaction.deferReply({ ephemeral: false });
        const number = interaction.options.get("number")?.value;

        let author = {
            name: "Randall Munroe",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        let comic;
        if(number) {
            comic = (await axios.get(`https://xkcd.com/${number}/info.0.json`)).data;  
        } else {
            comic = (await axios.get(`https://xkcd.com/info.0.json`)).data;
        }

        const xkcdEmbed = new Discord.EmbedBuilder()
            .setTitle(`XKCD #${comic.num} - ${comic.title}`)
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setImage(comic.img)
            .setDescription(comic.alt)
            .setFooter({ text: `Published on ${comic.month}/${comic.day}/${comic.year}` });

        interaction.editReply({ embeds: [xkcdEmbed], allowedMentions: { repliedUser: true } });
    }
}