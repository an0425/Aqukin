/* This module allows the author to toggle looping/unlooping the current track */ 
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopTrackCommand extends BaseCommand{
    constructor() {super("looptrack", ["lt", "ls", "loopsong"], "Toggle looping/unlooping the current track", "CONNECT", "music", false, true, "")}

    async run(para){
        // shortcut variables
        const { message, player, voteReached } = para;
        if(!voteReached) { return; }
        const author = message.author.username;
        
        if(player.queueRepeat) { return message.channel.send(`**${author}**-sama, please cancel the queue loop first before looping the track~`); }

        player.trackRepeat = !player.trackRepeat; // toggle track loop
        if (!player.trackRepeat) { message.channel.send(`**${author}**-sama, Aqukin will now \`stop looping the current track\`~`); }
        else { message.channel.send(`**${author}**-sama, Aqukin will now \`loop the current track\`~`); }
                    
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



    
