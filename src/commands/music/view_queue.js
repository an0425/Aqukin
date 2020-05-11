/* This module allows the author to view the current music queue */
const { Utils } = require("erela.js");
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class ViewQueueCommand extends BaseCommand {
  constructor () {
    super("queue", ["view", "show", "viewqueue"], "View the current music queue", "CONNECT", "music", false, false, "");
  }

  async run (para) {
    // shortcut variables
    const {message, player} = para;

    // checks if the queue is empty, if so return a message to inform the author
    if (player.queue.empty) return message.channel.send(`**${message.author.username}**-sama, Aqukin the queue is currently empty~`, para.ridingAqua);
    
    let currentPage = 0; // default current page to the first page
    const embeds = generateQueueEmbed(player.queue);
    const queueEmbed = await message.channel.send(`Current Page -> ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
    await queueEmbed.react("⬅️");
    await queueEmbed.react("➡️");
    await queueEmbed.react('❌');

    const filter = (reaction, user) => ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id); // author's reactions filter
    const collector = queueEmbed.createReactionCollector(filter); // a collector for collecting the author's reactions

    collector.on("collect", async (reaction, user) => {
      // If there are 2 embeds.
      switch(reaction.emoji.name){
        case "➡️":
          if (currentPage < embeds.length-1) { // checks if the current page is not the last page
            currentPage++; // current page with now be the next page
            queueEmbed.edit(`Current Page -> ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
          } 
          break;
        
        case "⬅️":
          if (currentPage !== 0) { // checks if the current page is not the first page
            --currentPage; // current page will now be the previous page
            queueEmbed.edit(`Current Page ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
          }
          break;
        
        // a default case for other reactions, which will stop the collector and end the method
        default:
          collector.stop();
          console.log('Stopped collector..');
          await queueEmbed.delete();
          break;
      } // end of switch case
    }); // end of collector
  } // end of run
} // end of module.exports

/* This function is for generating an embed with the queue information */
function generateQueueEmbed(queue) {
  const embeds = [];
  let k = 8;
  for(let i = 0; i < queue.length; i += 7) {
    const next = queue.slice(i+1, k)
    let j = i;
    k += 7;
    const info = next.map(track => `${++j}) [${track.title}](${track.uri}) | length \`${Utils.formatTime(track.duration, true)}\` | requested by **${track.requester.username}**-sama`).join('\n\n');
    const embed = new MessageEmbed()
      .setColor(0x1DE2FE)
      .addFields({name: "⬇️ Currently playing ⬇️", value: `[${queue[0].title}](${queue[0].uri}) | length \`${Utils.formatTime(queue[0].duration, true)}\` | requested by **${queue[0].requester.username}**-sama`},
                 {name: "⬇️ Next in queue ⬇️", value: info})
      .setImage("https://media1.tenor.com/images/db59d6409b27b749fe7226246e73f1b2/tenor.gif?itemid=16625248")
      .setFooter("Vive La Résistance le Hololive~");
    embeds.push(embed);
  }
  return embeds;
} // end of gerenateQueueEmbed(queue) function