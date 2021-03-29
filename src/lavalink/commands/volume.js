/* This module allows the author to configure the volume of the bot's audio stream  */
const { checkNum } = require("../../utilities/functions");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class VolumeCommand extends BaseCommand{
    constructor() {
        super("setvolume", ["sv", "volume"], "Set the audio player's volume by percentage (maximum 400)", "ADMINISTRATOR", "music", true, "[percentage]", "150 -- will set the volume to 150% of the default volume");
    }
    
    async run(para){
        // shortcut variables
        const { message, player, bot } = para;
        const { author, channel } = message;
        const maxNum = await bot.settings.get(message.guild.id).patreon ? 700 : 400;

        try{
            let num = await checkNum(para.args[0], 100, 0, true);
            // checks if the author is trying to raise the volume above the maxNum
            if (num > maxNum) { return channel.send(`**${author.username}**-sama, please keep the volume at \`${maxNum}\` or below as ${bot.user.username} is concerning about your health _(´ㅅ\`)⌒)\\_`); }
        
            await player.setVolume(num);
            channel.send(`**${author.username}**-sama, ${bot.user.username} has set the volume to \`${player.volume}\``); // inform the author
        
            // Update the currently playing embed 
            const embed = await musicEmbed(bot, player, player.queue.current);
            await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
                .catch(async err => { player.sentMessage = await bot.channels.cache.get(player.textChannel).send(embed); });
        } catch(err) { console.log(err); }
    } // end of run
}; // end of module.exports



    




    
