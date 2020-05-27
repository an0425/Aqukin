/* This module allows the author to resume Aqukin current audio streaming */
const {musicEmbed} = require("../../utilities/music_embed");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ResumeCommand extends BaseCommand{
    constructor() {super("resume", ["continue"], "Resume the audio player", "CONNECT", "music", false, true, "")}

    async run(para){
        // shortcut variables
        const {message, player, voteReached} = para;
        if(!voteReached) return;
        const author = message.author.username;
        
        // checks if the player is already paused, if so return a message to inform the author
        if (!player.paused) return message.channel.send(`**${author}**-sama, Aqukin audio stream is not paused.`);
        player.paused = false;
        await player.pause(false); // pauses streaming audio
        message.channel.send(`**${author}**-sama, Aqukin has resumed audio streaming~`);

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



    
