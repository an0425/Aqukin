/* This module allows the author to move into a specified timestamp in current track of Aqukin's audio stream  */
const { Utils } = require("erela.js");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class MoveToCommand extends BaseCommand{
    constructor() {super("move", ["to", "time", "m"], "Move into a specified timestamp in the current track", "CONNECT", "music", true, "<ex: 1m12s>")}
    
    run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const player = para.player;
        const timestamp = Utils.parseTime(para.args[0]);
        
        // checks if the author has provided the correct format for the timestamp
        if(!timestamp) return msg.channel.send(`**${author}**-sama, please specify the timestamp in the correct format, ex \`>move <1m12s>\``);
        player.seek(timestamp); // move to the timestamp
        msg.channel.send(`**${author}**-sama, Aqukin has moved the current track to **${para.args[0]}**`);
    } // end of run
}; // end of module.exports



    
