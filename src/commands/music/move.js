/* This module allows the author to move into a specified timestamp in current track of Aqukin's audio stream  */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertInput, formatLength } = require("../../utilities/functions");

module.exports = class MoveCommand extends BaseCommand{
    constructor() {super("move", ["m", "to", "time"], "Move the audio player to a specified timestamp in the current track", "CONNECT", "music", true, false, "<hh:mm:ss>, example <1:32>")}
    
    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;
        const timestamp = await convertInput(para.args[0]);
        const duration = await convertInput(player.queue[0].duration);

        if(timestamp >= duration) { return message.channel.send(`**${author}**-sama, the timestamp should be less than the track length \`${player.queue[0].duration}\``); }
        
        // try to move to the given timestamp, inform the author if fail
        try{
            player.seeking = true;
            await player.queue.splice(1, 0, player.queue[0]);
            player.queue[1].seek = timestamp;
            await player.connection.dispatcher.end();
            //player.seeking = false;
            // inform the author if success
            const time = await formatLength(timestamp);
            message.channel.send(`**${author}**-sama, Aqukin has moved the current track to position \`${time}\``);
        } catch(err) {
            console.log(err);
            player.connection.moving = false;
            message.channel.send(`**${author}**-sama, please provide a valid timestamp~`, para.ridingAqua);
        } 
    } // end of run
}; // end of module.exports 



    
