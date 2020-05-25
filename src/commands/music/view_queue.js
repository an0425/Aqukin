/* This module allows the author to view the current music queue */
const { Utils } = require("erela.js");
const { MessageEmbed } = require('discord.js');
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class ViewQueueCommand extends BaseCommand {
  constructor () {
    super("viewqueue", ["vq", "view", "show", "queue"], "View the current music queue", "CONNECT", "music", false, false, "");
  }

  async run (para) {
    // shortcut variables
    const {message, player} = para;

    // checks if the queue is empty, if so return a message to inform the author
    if (player.queue.empty) return message.channel.send(`**${message.author.username}**-sama, Aqukin the queue is currently empty~`, para.ridingAqua);
    
    let currentPage = 0; // default current page to the first page
    const embeds = generateQueueEmbed(player.queue, para.bot.music.thumbnails);
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
function generateQueueEmbed(queue, thumbnails) {
  const embeds = [];
  let k = 8;
  let info;
  for(let i = 0; i < queue.length; i += 7) { // for loop going through all the tracks in the queue
    const next = queue.slice(i+1, k)
    // checks if there's anything next in queue
    if (!next.empty){
      let j = i;
      k += 7;
      info = next.map(track => `${++j}) [${track.title}](${track.uri}) | length \`${Utils.formatTime(track.duration, true)}s\` | requested by **${track.requester.username}**-sama`).join('\n\n');
    } // end of if
    else {info = "Currently no track is next in queue~~~";} // else next in queue is empty
    
    // construct the embed(s)
    const embed = new MessageEmbed()
      .setColor(0x1DE2FE)
      .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
      .setDescription(`⬇️ Currently playing ⬇️\n [${queue[0].title}](${queue[0].uri}) | length \`${Utils.formatTime(queue[0].duration, true)}s\` 
                      | requested by **${queue[0].requester.username}**-sama\n\n⬇️ Next in queue ⬇️\n${info}`)
      //.setImage("https://media1.tenor.com/images/db59d6409b27b749fe7226246e73f1b2/tenor.gif?itemid=16625248")
      .setImage("https://media1.tenor.com/images/b8295db81d621037cc67797b6692279e/tenor.gif?itemid=16802911")
      .setFooter("Vive La Résistance le Hololive~");
    embeds.push(embed); // pushing embeds (for transition between pages)
  } // end of for loop
  return embeds;
} // end of gerenateQueueEmbed(queue) function