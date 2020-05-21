/* This module allows the author to loop the current track/queue in Aqukin audio stream */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopCommand extends BaseCommand{
    constructor() {super("loop", ["repeat"], "Loop the current track/queue", "CONNECT", "music", true, true, "<song/track> or <queue>")}

    run(para){
        // shortcut variables
        const {message, player, voteReached} = para;
        if(!voteReached) return;
        const author = message.author.username;
        
        let reply;
        switch(para.args[0].toLowerCase()){
            // cases for song and track
            case "song":
            case "track":
                // checks if the track is already set to loop, if so return a message to inform the author
                if (player.trackRepeat) return message.channel.send(`**${author}**-sama, Aqukin has already set this audio track to loop.`);
                player.setTrackRepeat(true); // loop the current audio track
                reply = `**${author}**-sama, Aqukin will now loop the current track`;
                break;
            
            // a case for queue
            case "queue":
                // checks if the queue is empty, if so return a message to inform the author
                if (player.queue.empty) return message.channel.send(`**${author}**-sama, the queue is currently empty~`, para.ridingAqua);
                // checks if the queue is already set to loop, if so return a message to inform the author
                if (player.queueRepeat) return message.channel.send(`**${author}**-sama, Aqukin has already set this queue to loop.`);
                // checks if the queue has already been set to loop
                if (player.trackRepeat) reply = `**${author}**-sama, Aqukin will now loop the whole queue, be aware that the current track loop will be cancelled`;
                else reply = `**${author}**-sama, Aqukin will now loop the whole queue`;
                player.setQueueRepeat(true); // loop the current queue
                break;
            
            // a default case for wrong input
            default:
                reply = `**${author}**-sama, please use this format \`>loop <song> or <track> or <queue>\``;
                break;
        } // end of switch
        message.channel.send(reply);
    } // end of run
}; // end of module.exports



    
