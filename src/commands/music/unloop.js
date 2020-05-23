/* This module allows the author to unloop the current track/queue in Aqukin audio stream */
const {musicEmbed} = require("../../utilities/music_embed");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class UnLoopCommand extends BaseCommand{
    constructor() {super("unloop", ["unrepeat"], "Unloop the current track/queue in Aqukin audio stream", "CONNECT", "music", true, true, "<song/track> or <queue>")}

    async run(para){
        // shortcut variables
        const {message, player, voteReached} = para;
        if(!voteReached) return;
        const author = message.author.username;

        switch(para.args[0].toLowerCase()){
            // cases for song and track
            case "song":
            case "track":
                // checks if the track is already set to loop, if so return a message to inform the author
                if (!player.trackRepeat) return message.channel.send(`**${author}**-sama, this track is not currently set to loop.`);
                await player.setTrackRepeat(false); // unloop the current track
                message.channel.send(`**${author}**-sama, Aqukin has cancelled the current track loop~`);
                break;
            
            // a case for queue
            case "queue":
                // checks if the queue is empty, if so return a message to inform the author
                if (player.queue.empty) return message.channel.send(`**${author}**-sama, the queue is currently empty~`, para.ridingAqua);
                // checks if the track is already set to loop, if so return a message to inform the author
                if (!player.queueRepeat) return message.channel.send(`**${author}**-sama, this queue is not currently set to loop.`);
                await player.setQueueRepeat(false); // unloop the current queue
                message.channel.send(`**${author}**-sama, Aqukin has cancelled the current queue loop~`);
                break;
            
            // a default case for wrong input
            default:
                message.channel.send(`**${author}**-sama, please use this format \`>unloop <song> or <track> or <queue>\``);
        } // end of switch

        // Update the currently playing embed
        const embed = await musicEmbed(para.bot.music, player, player.queue[0])
        await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
    } // end of run
}; // end of modulde.exports



    
