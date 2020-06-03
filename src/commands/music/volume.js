/* This module allows the author to configure the volume of Aqukin's audio stream  */
const { musicEmbed } = require("../../utilities/embed_constructor");
const { checkNum } = require("../../utilities/functions");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class VolumeCommand extends BaseCommand{
    constructor() {super("setvolume", ["v", "volume"], "Set the audio player's volume (maximum 4 times)", "ADMINISTRATOR", "music", true, false, "[times] ex: 2.5 means 2.5 times the default volume")}
    
    async run(para){
        // shortcut variables
        const { message, player } = para;
        const { author, channel } = message;

        let num = await checkNum(para.args[0], 1, 0, false);
        // checks if the author is trying to raise the volume above 4
        if (num > 4) { return channel.send(`**${author.username}**-sama, please keep the volume at \`4\` or below as Aqukin is concerning about your health~`); }
        
        // set the volume
        await player.connection.dispatcher.setVolume(num);
        channel.send(`**${author.username}**-sama, Aqukin has set the volume to \`${player.connection.dispatcher.volume}\``); // inform the author
        
        /* Update the currently playing embed */
        const embed = await musicEmbed(para.bot, player, player.queue[0])
        try{
            await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
        } catch(err) {
            console.log("Recreating the deleted music embed", err);
            player.sentMessage = await player.textChannel.send(embed);
        }
    } // end of run
}; // end of module.exports



    
