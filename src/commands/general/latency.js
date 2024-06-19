const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Interaction } = require('discord.js');
const colors = require('../../tools/colors.json');
const Discord = require('discord.js');

module.exports = {
  name: 'latency',
  description: 'Reponds with the latency from the Discord API and myself',
  devOnly: false,
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
    const latencyTest = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Retry').setCustomId('Retry').setStyle(ButtonStyle.Primary));

    let authorSuccess = {
      name: "Bot & API Latency",
      iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
    }

    let authorError = {
      name: "Error",
      iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp"
    }	
		
		let latestEmbed = new Discord.EmbedBuilder()
			.setAuthor(authorSuccess)
			.setDescription(`Heckernetic's Latency is \`${Date.now() - interaction.createdTimestamp}\` ms. \n Discord API Latency is \`${Math.round(client.ws.ping)}\` ms.`)
			.setColor(colors["MainColor"]);

		interaction.editReply({embeds: [latestEmbed], allowedMentions: { repliedUser: true }, components: [latencyTest] }).then((reply) => {
      let collector = reply.createMessageComponentCollector({ time: 300000, dispose: true });
      collector.on("collect", async (press) => {
          if (press.user.id !== interaction.user.id) {
              const unauthorizedAction = new Discord.EmbedBuilder()
                  .setAuthor(authorError)
                  .setColor(colors["MainColor"])
                  .setDescription("You cannot perform this action!");

              press.reply({ embeds: [unauthorizedAction], allowedMentions: { repliedUser: true } }).then(() => {
                  setTimeout(function() {
                      interaction.deleteReply()
                  }, 5000);
              });
          } else {
              await press.deferUpdate();

              const embed = new Discord.EmbedBuilder()
                  .setAuthor(authorSuccess)
                  .setColor(colors["MainColor"])
                  .setDescription(`Heckernetic's Latency is \`${Date.now() - press.createdTimestamp}\` ms. \n Discord API Latency is \`${Math.round(client.ws.ping)}\` ms.`)
                  
              latestEmbed = embed;
              press.editReply({ embeds: [embed], allowedMentions: { repliedUser: true } });
          }
      });

      collector.on("end", () => {interaction.editReply({ embeds: [latestEmbed], allowedMentions: { repliedUser: true }, components: [latencyTest] }) });
    });
  },
};