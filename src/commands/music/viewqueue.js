/* This module allows the author to view the current music queue */
const BaseCommand = require('../../utils/structures/BaseCommand');
const { MessageEmbed } = require('discord.js');

module.exports = class ViewQueueCommand extends BaseCommand {
  constructor () {
    super("viewqueue", ["view", "queue"], "CONNECT", "music", false, false, "");
  }

  async run (para) {
    // shortcut variables
    const msg = para.message;
    const { id } = msg.guild;
    const player = para.bot.music.players.get(id);

    // checks if the queue is empty, if so return a message to inform the author
    if (player.queue.empty) return msg.channel.send(`**${msg.author.username}**-sama, Aqukin the queue is currently empty.`);
    
    let currentPage = 0;
    const embeds = generateQueueEmbed(player.queue);
    const queueEmbed = await msg.channel.send(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
    await queueEmbed.react('⬅️');
    await queueEmbed.react('➡️');
    await queueEmbed.react('❌');

    const filter = (reaction, user) => ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && (msg.author.id === user.id);
    const collector = queueEmbed.createReactionCollector(filter);

    collector.on('collect', async (reaction, user) => {
      // If there are 2 embeds.
      if (reaction.emoji.name === '➡️') {
        if (currentPage < embeds.length-1) {
          currentPage++;
          queueEmbed.edit(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
        } 
      } else if (reaction.emoji.name === '⬅️') {
          if (currentPage !== 0) {
            --currentPage;
            queueEmbed.edit(`Current Page ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
          }
        } else {
          collector.stop();
          console.log('Stopped collector..');
          await queueEmbed.delete();
        }
    });
  }
}

/* This function is for generating an embed with the queue information */
function generateQueueEmbed(queue) {
  const embeds = [];
  let k = 10;
  for(let i = 0; i < queue.length; i += 10) {
    const current = queue.slice(i, k);
    let j = i;
    k += 10;
    const info = current.map(track => `${++j}) [${track.title}](${track.uri})`).join('\n');
    const embed = new MessageEmbed()
      .setDescription(`**[Current Song: ${queue[0].title}](${queue[0].uri})**\n${info}`);
    embeds.push(embed);
  }
  return embeds;
}