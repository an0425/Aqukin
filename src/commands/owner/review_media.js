/* This module allow the OWNER to view all the media files 
const { MessageEmbed } = require("discord.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ReviewMediaCommand extends BaseCommand{
    constructor() {super("reviewmedia", ["rm", "media"], "View all the media files", "SEND_MESSAGES", "owner", false, "", "-- Let you chose a media to review")}
    
    async run(para){
        // shortcut variables
        const { message, bot } = para;

        const embed = new MessageEmbed()
            .setColor(0x1DE2FE)
            .setTitle("Automatically times out in 24 seconds")
            .setDescription("1. baqua\n2. baquafina\n3. gifs\n4.thumbnails")
            .setImage("https://media1.tenor.com/images/85e6b8577e925a9037d03a796588e7ed/tenor.gif?itemid=15925240")
            .setFooter("FREEDOM SMILE (^)o(^)b");
        
            await message.channel.send(`**${message.author.username}**-sama, please choose a media array you want to review`, embed)
                .then(async (msg) => {
                    // allow the author to select a track fron the search results within the allowed time of 24s
                    const filter = m => (message.author.id === m.author.id) && (m.content >= 1 && m.content <= 4);

                    // await the user respond within 24s
                    await message.channel.awaitMessages(filter, { max: 1, time: 24000, errors: ["time"] })
                        .then(async (response) => {
                            switch(await response.first().content){
                                case "1" : await view(bot.media.baqua, message);
                                case "2" : await view(bot.media.baquafina, message);
                                case "3" : await view(bot.media.gifs, message);
                                case "4" : await view(bot.media.thumbnails, message);
                            }
                            response.first().delete().catch(err => console.log(err)); // delete the user respond
                    }).catch(console.error);

                    // delete the search results embed 
                    msg.delete(); 
                }).catch(console.error);
    } // end of run
}; // end of module.exports

async function view(media, message) {
    let currentPage = 0; // default current page to the first page
    const embeds = await generateMediaEmbed(media);
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
                await queueEmbed.delete();
                break;
        } // end of switch case
    }); // end of collector
} // end of view() function

async function generateMediaEmbed(media) {
    const embeds = [];
    
    for(let i = 0; i < media.length; i++) { // for loop going through all the tracks in the queue
        // construct the embed(s)
        const embed = new MessageEmbed()
            .setDescription(`${i+1}`)
            .setImage(media[i])
            .setFooter("Vive La Résistance le Hololive ٩(｡•ω•｡*)و");
        embeds.push(embed); // pushing embeds (for transition between pages)
    } // end of for loop

    return embeds;
} // end of gerenateQueueEmbed(queue) helper function */