const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Discord, Interaction } = require('discord.js');

module.exports = {
  name: 'latency',
  description: 'Reponds with the latency from the Discord API and myself',
  //devOnly: false,
  //testOnly: true,
  //options: Object[],
  deleted: false,

  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: false });
    const latencyTest = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Retry').setCustomId('Retry').setStyle(ButtonStyle.PRIMARY));

    const authorSuccess = {
      name: "Bot & API Latency",
      iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp",
    }

    const authorError = {
      name: "Error",
      iconURL: "https://cdn.discordapp.com/avatars/1148422189129941032/05c7d704c2a36b00f7c08d25fe16675c.webp",
    }

    let latencyEmbed = new Discord.EmbedBuilder()
      .setAuthor(authorSuccess)
      .setDescription(`Heckernetic's Latency is: \`${Date.now() - interaction.createdTimestamp}\`ms. \n The Discord API Latency is: \`${Math.round(client.ws.ping)}\`ms.`)
      .setColor('#00FF00');

      interaction.editReply({embeds: [latencyEmbed], allowedMentions: { repliedUser: true }, components: [latencyTest] }).then((reply) => {
        let collector = reply.createMessageComponentCollector({ time: 300000, dispose: true });
        collector.on("collect", async (press) => {
          if(press.user.id != interaction.user.id) {
            const unauthorizedAction = new Discord.EmbedBuilder()
              .setAuthor(authorError)
              .setDescription(`You are not authorized to perform this action.`)
              .setColor('#FF0000');

            press.reply({ embeds: [unauthorizedAction], allowedMentions: { repliedUser: false } }).then(() => {
              setTimeout(function() {
                interaction.deleteReply();
              }, 5000)
            })
          } else {
            await press.deferUpdate();
            const retestedLatencyEmbed = new Discord.EmbedBuilder()
              .setAuthor(authorSuccess)
              .setDescription(`Heckernetic's Latency is: \`${Date.now() - interaction.createdTimestamp}\`ms. \n The Discord API Latency is: \`${Math.round(client.ws.ping)}\`ms.`)
              .setColor('#00FF00');

            latencyEmbed = retestedLatencyEmbed;
            press.editReply({ embeds: [retestedLatencyEmbed], allowedMentions: { repliedUser: true } });
          }
        });

        collector.on("end", () => { interaction.editReply({ embeds: [latencyEmbed], allowedMentions: { repliedUser: true }, components: [latencyTest] }) });
      });
  },
};