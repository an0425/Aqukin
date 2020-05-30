/* This module allows the author to loop the current track/queue in Aqukin audio stream */
const {musicEmbed} = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopCommand extends BaseCommand{
    constructor() {super("loop", ["repeat"], "Loop the current track/queue", "CONNECT", "music", true, true, "<song/track> or <queue>")}

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
                if (player.trackRepeat) return message.channel.send(`**${author}**-sama, Aqukin has already set this audio track to loop.`);
                await player.setTrackRepeat(true); // loop the current audio track
                message.channel.send(`**${author}**-sama, Aqukin has set the current track to loop~`);
                break;
            
            // a case for queue
            case "queue":
                // checks if the queue is empty, if so return a message to inform the author
                if (player.queue.empty) return message.channel.send(`**${author}**-sama, the queue is currently empty~`, para.ridingAqua);
                // checks if the queue is already set to loop, if so return a message to inform the author
                if (player.queueRepeat) return message.channel.send(`**${author}**-sama, Aqukin has already set this queue to loop.`);
                await player.setQueueRepeat(true); // loop the current queue
                message.channel.send(`**${author}**-sama, Aqukin has set the current queue to loop~`);
                break;
            
            // a default case for wrong input
            default:
                return message.channel.send(`**${author}**-sama, please use this format \`>loop <song> or <track> or <queue>\``);
        } // end of switch case
        
        // Update the currently playing embed
        const embed = await musicEmbed(para.bot.music, player, player.queue[0])
        try{
            await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
        } catch(err) {
            console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        }
    } // end of run
}; // end of module.exports



    
