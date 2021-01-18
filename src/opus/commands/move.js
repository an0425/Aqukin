/* This module allows the author to move into a specified timestamp in current track of the bot audio stream  */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertInput, formatLength } = require("../../utilities/functions");

module.exports = class MoveCommand extends BaseCommand{
    constructor() {
        super("move", ["mv", "to", "time"], "Move the audio player to a specified timestamp in the current track by its requester/admin.\n\nMoving \`requires\` the track to be \`1080p or higher\`\n\nIn case of \`not working\` or moving \`older/lower res\` videos, try \`forced move\`, which is \`slower\` but \`guaranteed success\`. Please note that \`music commands\` will be \`disabled\` during the forced moving process.\n\nForced move can be toggle by adding \`-f\` to the end of the command.", "CONNECT", "music", true, "<hh:mm:ss> [-f]", "02:32 -- will move the current track to the position of **2 minutes and 32 seconds**");
    }
    
    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author;

        // checks if the author has administrative permission or have requested the track, if so continue, if not return a message to inform them
        if(message.author.id !== player.queue[0].requester.id && !message.member.hasPermission("ADMINISTRATOR")) { 
            return message.channel.send(`**${author.username}**-sama, this track is requested by **${player.queue[0].requester.username}**-sama, you can only move your own requested tracks (-ω- 、)`); 
        }

        const timestamp = convertInput(para.args[0]);

        // checks if the author has requested to move to a valid timestamp, if so continue, if not return a message to inform them
        if(timestamp >= player.queue[0].duration) { return message.channel.send(`**${author.username}**-sama, the timestamp should be less than the track length \`${formatLength(player.queue[0].duration)}\` ლ (¯ ロ ¯ "ლ)`); }
        //console.log(timestamp, player.queue[0].duration);
        
        // try to move to the given timestamp, inform the author if fail
        try{
            // inform the author if success
            await player.queue.splice(1, 0, player.queue[0]);
            player.queue[1].force = para.args[1] == "-f";
            player.queue[1].seek = timestamp;
            await player.connection.dispatcher.end();
            message.channel.send(`**${author.username}**-sama, ${para.bot.user.username} will now ${player.queue[1].force ? "\`force move\`" : "move"} the current track to position \`${formatLength(timestamp, true)}\``);
        } catch(err) {
            console.log(err);
            message.channel.send(`**${author.username}**-sama, an error has occured while trying to move the track ☆ ｏ (＞ ＜ ；) ○, ${para.bot.user.username} has informed **${para.bot.author.username}**-sama`);
        } 
    } // end of run
}; // end of module.exports 


    