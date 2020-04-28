/* This module allows the author to loop the current track Aqukin current audio streaming */
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class LoopCommand extends BaseCommand{
    constructor() {super("loop",[], "CONNECT", "music", false, true, "<song> or <track> or <queue>")}

    run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const { id } = msg.guild;
        const player = para.bot.music.players.get(id);
        
        switch(para.args[0].toLowerCase()){
            // cases for song and track
            case "song":
            case "track":
                // checks if the track is already set to loop, if so return a message to inform the author
                if (player.trackRepeat) return msg.channel.send(`**${author}**-sama, Aqukin has already set this audio track to loop.`);
                player.setTrackRepeat(true); // loop the current audio track
                msg.channel.send(`**${author}**-sama, Aqukin will now loop the current track`);
                break;
            
            // a case for queue
            case "queue":
                // checks if the queue is empty, if so return a message to inform the author
                if (player.queue.empty) return msg.channel.send(`**${author}**-sama, Aqukin the queue is currently empty.`);
                // checks if the track is already set to loop, if so return a message to inform the author
                if (player.queueRepeat) return msg.channel.send(`**${author}**-sama, Aqukin has already set this queue to loop.`);
                player.setTrackRepeat(false); // unloop the current audio track
                player.setQueueRepeat(true); // loop the current queue
                msg.channel.send(`**${author}**-sama, Aqukin will now loop the current queue`);
                break;
            
            // a default case for wrong input
            default:
                msg.channel.send(`**${author}**-sama, please use this format !loop **<song>** or **<track>** or **<queue>**`);
                break;
        }
        
    }
};



    
