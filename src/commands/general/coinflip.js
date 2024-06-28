const { Client, Interaction } = require('discord.js');
const colors = require(`../../tools/colors.json`);
const Discord = require('discord.js');

module.exports = {
    name: 'coinflip',
    description: 'Starts a coinflip between two people',
    devOnly: true,
    testOnly: false,
    //options: Object[],
    deleted: false,
  
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        let author = {
            name: "Coinflip",
            iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
        }

        function randomFlip() {
            const random = Math.random();
            if (random <= 0.5) {
                return "heads";
            } else {
                return "tails";
            }
        }

        const coinflip = new Discord.EmbedBuilder()
            .setAuthor(author)
            .setColor(colors["MainColor"])
            .setDescription(`The coin landed on ${randomFlip()}.`)

        interaction.editReply({ embeds: [coinflip], allowedMentions: { repliedUser: true } });
    }
}