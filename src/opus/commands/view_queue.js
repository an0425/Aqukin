/* This module allows the author to view the current music queue */
const { MessageEmbed } = require('discord.js');
const { formatLength } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ViewQueueCommand extends BaseCommand {
    constructor () {
        super("viewqueue", ["vq", "queue"], "View the audio player's queue", "CONNECT", "music", false, "", "-- will display the queue");
    }
    
    async run (para) {
        // shortcut variables
        const { message, player } = para;
        const step = 7;

        let currentPage = 0; // default current page to the first page
        const queueEmbed = await message.channel.send(`Current Page -> ${currentPage+1}/${Math.ceil(player.queue.length/step)}`, await generateQueueEmbed(currentPage, step, player.queue, para.bot.media));
        await queueEmbed.react("⏮️");
        await queueEmbed.react("⏪");
        await queueEmbed.react("⬅️");
        await queueEmbed.react("➡️");
        await queueEmbed.react("⏩");
        await queueEmbed.react("⏭️");
        await queueEmbed.react('❌');

        const filter = (reaction, user) => ["⏮️","⏪","⬅️", "➡️", "⏩", "⏭️", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id); // author's reactions filter
        const collector = queueEmbed.createReactionCollector(filter); // a collector for collecting the author's reactions

        collector.on("collect", async (reaction) => {
            const queueLength = Math.ceil(player.queue.length/step);

            if(queueLength == 0){
                collector.stop();
                return await queueEmbed.delete();
            }

            const { name } = reaction.emoji;
            switch(name){
                case "➡️":
                case "⏩":
                case "⏭️":
                    if (currentPage < queueLength-1) { // checks if the current page is not the last page
                        if(name == "➡️") { currentPage++; }
                        else if(name == "⏩") { currentPage = currentPage+5 < queueLength-1 ? currentPage+5 : queueLength-1; }
                        else { currentPage = queueLength-1; }
                    }
                    else
                        currentPage = 0;

                    queueEmbed.edit(`Current Page -> ${currentPage+1}/${queueLength}`, await generateQueueEmbed(currentPage, step, player.queue, para.bot.media));
                    break;
        
                case "⬅️":
                case "⏪":
                case "⏮️":
                    if(currentPage > queueLength-1)
                        currentPage = queueLength-1;

                    else if (currentPage !== 0) { // checks if the current page is not the first page
                        if(name == "⬅️") { currentPage--; }
                        else if(name == "⏪") { currentPage = currentPage-5 > 0 ? currentPage-5 : 0; }
                        else { currentPage = 0; }
                        
                    }

                    queueEmbed.edit(`Current Page ${currentPage+1}/${queueLength}`, await generateQueueEmbed(currentPage, step, player.queue, para.bot.media));
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
async function generateQueueEmbed(i, step, queue, media) {
    const { embedColour } = media;
    let info;
    let start = step*i+1;
    let end = start+step;
    end = end > queue.length ? queue.length : end;

    const next = queue.slice(start, end);
    // checks if there's anything next in queue
    if (next.length !== 0){
        let j = start;
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
        return embed;
    }
    
} // end of gerenateQueueEmbed(queue) helper function