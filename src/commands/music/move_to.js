/* This module allows the author to move into a specified timestamp in current track of Aqukin's audio stream  */
const { Utils } = require("erela.js");
const {musicEmbed} = require("../../utilities/music_embed");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class MoveToCommand extends BaseCommand{
    constructor() {super("moveto", ["m", "to", "time", "move"], "Move into a specified timestamp in the current track", "CONNECT", "music", true, false, "<ex: 1m12s>")}
    
    async run(para){
        // shortcut variables
        const {message, player} = para;
        const author = message.author.username;
        const timestamp = await Utils.parseTime(para.args[0]);
        
        // checks if the author has provided the correct format for the timestamp
        if(!timestamp) return message.channel.send(`**${author}**-sama, please specify the timestamp in the correct format, ex \`>move <1m12s>\``);
        // try to move to the given timestamp, inform the author if fail
        try{ 
            await player.seek(timestamp);
            // inform the author if success
            message.channel.send(`**${author}**-sama, Aqukin has moved the current track to position \`${Utils.formatTime(player.position, true)}s\``);

            // Update the currently playing embed
            if(!player.paused) return;
            const embed = await musicEmbed(para.bot.music, player, player.queue[0])
            if(!player.sentMessage) {
                player.sentMessage = await player.textChannel.send(embed);
            }
            else{
                await player.sentMessage.edit(embed); // send the embed to inform about the now playing track
            }
        } catch(err) {
            console.log(err);
            message.channel.send(`**${author}**-sama, please provide a valid timestamp~`, para.ridingAqua);
        } 
    } // end of run
}; // end of module.exports



    
