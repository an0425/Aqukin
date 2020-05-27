/* This module allows the author to configure the volume of Aqukin's audio stream  */
const {musicEmbed} = require("../../utilities/music_embed");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class VolumeCommand extends BaseCommand{
    constructor() {super("setvolume", ["v", "volume"], "Set the audio player's volume", "ADMINISTRATOR", "music", true, false, "<a positive integer less than or equals to 200>")}
    
    async run(para){
        // shortcut variables
        const {message, player} = para;
        const {author, channel} = message;
        const num = Math.floor(para.args[0]);

        // checks if the input is a valid number or not
        if (isNaN(num)) return channel.send(`**${author.username}**-sama, that's not a valid number~`, para.ridingAqua);
        // checks if the author is trying to raise the volume above 400
        if (num > 400) return channel.send(`**${author.username}**-sama, please keep the volume at 400 or below as Aqukin is concerning about your health~`);
        // else checks if the author is trying to input a negative number
        else if (num < 0) return channel.send(`**${author.username}**-sama, Aqukin can't set the volume with a negative value`);           
        // set the volume
        await player.setVolume(num);
        channel.send(`**${author.username}**-sama, Aqukin has set the volume to \`${player.volume}\``); // inform the author
        
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



    
