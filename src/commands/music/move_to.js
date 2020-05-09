/* This module allows the author to move into a specified timestamp in current track of Aqukin's audio stream  */
const { Utils } = require("erela.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class MoveToCommand extends BaseCommand{
    constructor() {super("move", ["to", "time", "m"], "Move into a specified timestamp in the current track", "CONNECT", "music", true, "<ex: 1m12s>")}
    
    async run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const player = para.player;
        const timestamp = await Utils.parseTime(para.args[0])
        
        // checks if the author has provided the correct format for the timestamp
        if(!timestamp) return msg.channel.send(`**${author}**-sama, please specify the timestamp in the correct format, ex \`>move <1m12s>\``);
        // try to move to the given timestamp, inform the author if fail
        try{ 
            await player.seek(timestamp);
            // inform the author if success
            msg.channel.send(`**${author}**-sama, Aqukin has moved the current track to position **${Utils.formatTime(player.position, true)}**`);
        } catch{msg.channel.send(`**${author}**-sama, please provide a valid timestamp~`, para.ridingAqua);} 
        
    } // end of run
}; // end of module.exports



    
