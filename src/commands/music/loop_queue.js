/* This module allows the author to toggle looping/unlooping the current queue */ 
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopQueueCommand extends BaseCommand{
    constructor() {super("loopqueue", ["lq"], "Toggle looping/unlooping the current queue", "CONNECT", "music", false, true, "")}

    async run(para){
        // shortcut variables
        const { message, player, voteReached } = para;
        if(!voteReached) { return; }
        const author = message.author.username;
        
        player.trackRepeat = false; // reset track loop
        player.queueRepeat = !player.queueRepeat; // toggle queue loop
        if (!player.queueRepeat) { 
            await player.loopqueue.splice(0);
            message.channel.send(`**${author}**-sama, Aqukin will now \`stop looping the current queue\`~`); 
        }
        else { message.channel.send(`**${author}**-sama, Aqukin will now \`loop the current queue\`~`); }
                    
        // Update the currently playing embed
        const embed = await musicEmbed(para.bot, player, player.queue[0])
        try{
            await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
        } catch(err) {
            console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        }
    } // end of run
}; // end of module.exports 



    
