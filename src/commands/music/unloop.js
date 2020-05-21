/* This module allows the author to unloop the current track/queue in Aqukin audio stream */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class UnLoopCommand extends BaseCommand{
    constructor() {super("unloop", ["unrepeat"], "Unloop the current track/queue in Aqukin audio stream", "CONNECT", "music", true, true, "<song/track> or <queue>")}

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
                if (!player.trackRepeat) return message.channel.send(`**${author}**-sama, this track is not currently set to loop.`);
                player.setTrackRepeat(false); // loop the current queue
                reply = `**${author}**-sama, Aqukin will now unloop the current track`;
                break;
            
            // a case for queue
            case "queue":
                // checks if the queue is empty, if so return a message to inform the author
                if (player.queue.empty) return message.channel.send(`**${author}**-sama, the queue is currently empty~`, para.ridingAqua);
                // checks if the track is already set to loop, if so return a message to inform the author
                if (!player.queueRepeat) return message.channel.send(`**${author}**-sama, this queue is not currently set to loop.`);
                player.setQueueRepeat(false); // unloop the current queue
                reply = `**${author}**-sama, Aqukin will now unloop the current queue`;
                break;
            
            // a default case for wrong input
            default:
                reply = `**${author}**-sama, please use this format \`>unloop <song> or <track> or <queue>\``;
                break;
        } // end of switch
        message.channel.send(reply);
    } // end of run
}; // end of modulde.exports



    
