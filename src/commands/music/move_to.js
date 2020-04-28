/* This module allows the author to move into a specified timestamp in Aqukin's current audio streaming track */
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class MoveToCommand extends BaseCommand{
    constructor() {super("move",["to", "time"], "CONNECT", "music", false, true, "<mm:ss>")}
    
    run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const { id } = msg.guild;
        const player = para.bot.music.players.get(id);

        // convert split the argument by the colon and convert it into the correct format
        const time = para.args[0].toString().trim().split(":");
        // check if the author has entered the correct format of the timestamp, if no return a message to inform them
        if(isNaN(time[0])) return msg.channel.send(`**${author}**-sama, that's not a valid timestamp, please use this timestamp format **<mm:ss>**`);
        const timestamp = parseInt(time[0])*60000 + parseInt(time[1])*1000;
        
        player.seek(timestamp);
        msg.channel.send(`${author}-sama, Aqukin has moved the current track to **${para.args[0]}**`);
    }
};



    
