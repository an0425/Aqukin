/* This module allows the author to view the current music queue */
const { MessageEmbed } = require('discord.js');
const { formatLength } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ViewQueueCommand extends BaseCommand {
    constructor () {
        super("viewqueue", ["q", "vq", "queue"], "View the audio player's queue", "CONNECT", "music", false, "", "-- will display the queue");
    }
    
    async run (para) {
        // shortcut variables
        const { message, player } = para;
    
        let currentPage = 0; // default current page to the first page
        const embeds = await generateQueueEmbed(player.queue, para.bot.media);
        const queueEmbed = await message.channel.send(`Current Page -> ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
        if(embeds.length > 1){
            await queueEmbed.react("⏮️");
            await queueEmbed.react("⏪");
            await queueEmbed.react("⬅️");
            await queueEmbed.react("➡️");
            await queueEmbed.react("⏩");
            await queueEmbed.react("⏭️");
        }
        await queueEmbed.react('❌');

        const filter = (reaction, user) => ["⏮️","⏪","⬅️", "➡️", "⏩", "⏭️", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id); // author's reactions filter
        const collector = queueEmbed.createReactionCollector(filter); // a collector for collecting the author's reactions

        collector.on("collect", async (reaction) => {
            const { name } = reaction.emoji;
            switch(name){
                case "➡️":
                case "⏩":
                case "⏭️":
                    if (currentPage < embeds.length-1) { // checks if the current page is not the last page
                        if(name == "➡️") { currentPage++; }
                        else if(name == "⏩") { currentPage = currentPage+5 < embeds.length-1 ? currentPage+5 : embeds.length-1; }
                        else { currentPage = embeds.length-1; }
                        queueEmbed.edit(`Current Page -> ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    }
                    break;
        
                case "⬅️":
                case "⏪":
                case "⏮️":
                    if (currentPage !== 0) { // checks if the current page is not the first page
                        if(name == "⬅️") { currentPage--; }
                        else if(name == "⏪") { currentPage = currentPage-5 > 0 ? currentPage-5 : 0; }
                        else { currentPage = 0; }
                        queueEmbed.edit(`Current Page ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    }
                    break;
        
                // a default case for X reaction, which will stop the collector and end the method
                default:
                    collector.stop();
                    await queueEmbed.delete();
                    break;
            } // end of switch case
        }); // end of collector
    } // end of run
} // end of module.exports 

/* This function is for generating an embed with the queue information */
async function generateQueueEmbed(queue, media) {
    const { embedColour } = media;
    const embeds = [];
    let k = 8;
    let info;
    
    for(let i = 0; i < queue.length; i += 7) { // for loop going through all the tracks in the queue
        const next = queue.slice(i+1, k);
        // checks if there's anything next in queue
        if (next.length !== 0){
            let j = i;
            k += 7;
            info = next.map(track => `${++j}) [${track.title}](${track.url}) | \`${formatLength(track.duration)}\` | requested by **${track.requester.username}**-sama`).join("\n\n");
        } // end of if
        else { info = "Currently no track is next in queueヾ (= `ω´ =) ノ”"; } // else next in queue is empty
    
        // construct the embed(s)
        if(i==0 || !info.startsWith("Currently")){
            const embed = new MessageEmbed()
                .setColor(embedColour.random())
                .setThumbnail(await media.getMedia("thumbnails"))
                .setDescription(`⚓ Currently playing ▶️\n [${queue[0].title}](${queue[0].url}) | \`${formatLength(queue[0].duration)}\` | requested by **${queue[0].requester.username}**-sama\n\n⚓ Next in queue ⏭️\n${info}`)
                .setImage(await media.getMedia("gifs"))
                .setFooter("FREEDOM SMILE (^)o(^)b");
            
            embeds.push(embed); // pushing embeds (for transition between pages)
        }
    } // end of for loop
    return embeds;
} // end of gerenateQueueEmbed(queue) helper function