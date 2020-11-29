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
        const embeds = await generateQueueEmbed(player.queue, para.bot.media, para.bot.music.lavalink);
        const queueEmbed = await message.channel.send(`Current Page -> ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
        await queueEmbed.react("⬅️");
        await queueEmbed.react("➡️");
        await queueEmbed.react('❌');

        const filter = (reaction, user) => ["⬅️", "➡️", "❌"].includes(reaction.emoji.name) && (message.author.id === user.id); // author's reactions filter
        const collector = queueEmbed.createReactionCollector(filter); // a collector for collecting the author's reactions

        collector.on("collect", async (reaction) => {
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
                    //console.log('Stopped collector..');
                    await queueEmbed.delete();
                    break;
            } // end of switch case
        }); // end of collector
    } // end of run
} // end of module.exports 

/* This function is for generating an embed with the queue information */
async function generateQueueEmbed(queue, media, lavalink) {
    const { thumbnails, gifs, embedColour } = media;
    const embeds = [];

    if(queue.length > 0){
        let k = 7;

        // for loop going through all the tracks in the queue
        for(let i = 0; i < queue.length; i += 7) { 
            const next = queue.slice(i, k);
            // checks if there's anything next in queue
            let j = i;
            k += 7;
            let info = next.map(track => `${++j}) [${track.title}](${track.uri}) | \`${formatLength(track.duration, false, lavalink)}\` | requested by **${track.requester.username}**-sama`).join("\n\n");
        
            // construct the embed(s)
            const embed = new MessageEmbed()
                .setColor(embedColour[Math.floor(Math.random() * Math.floor(embedColour.length))])
                .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
                .setDescription(`⚓ **Currently playing** ▶️\n [${queue.current.title}](${queue.current.uri}) | \`${formatLength(queue.current.duration, false, lavalink)}\` | requested by **${queue.current.requester.username}**-sama\n\n⚓ **Next in queue** ⏭️\n${info}`)
                .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
                .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
            embeds.push(embed); // pushing embeds (for transition between pages)
        } // end of for loop
    }

    else{
        const embed = new MessageEmbed()
            .setColor(embedColour[Math.floor(Math.random() * Math.floor(embedColour.length))])
            .setThumbnail(thumbnails[Math.floor(Math.random() * Math.floor(thumbnails.length))])
            .setDescription(`⚓ **Currently playing** ▶️\n [${queue.current.title}](${queue.current.uri}) | \`${formatLength(queue.current.duration, false, lavalink)}\` | requested by **${queue.current.requester.username}**-sama\n\n⚓ **Next in queue** ⏭️\n${"Currently no track is next in queueヾ (= `ω´ =) ノ”"}`)
            .setImage(gifs[Math.floor(Math.random() * Math.floor(gifs.length))])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        embeds.push(embed);
    }
    
    return embeds;
} // end of gerenateQueueEmbed(queue) helper function