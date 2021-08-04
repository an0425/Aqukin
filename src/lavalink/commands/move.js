/* This module allows the author to move into a specified timestamp in current track of the bot audio stream  */
const BaseCommand = require("../../utilities/structures/BaseCommand");
const { convertInput, formatLength } = require("../../utilities/functions");

module.exports = class MoveCommand extends BaseCommand{
    constructor() {
        super("move", ["m", "mv", "to", "time"], "Move the audio player to a specified timestamp in the current track by its requester/admin", "CONNECT", "music", true, "<hh:mm:ss>", "02:32 -- will move the current track to the position of **2 minutes and 32 seconds**");
    }
    
    async run(para){
        // shortcut variables
        const { message, player, bot } = para;
        const author = message.author;

        // checks if the author has administrative permission or have requested the track, if so continue, if not return a message to inform them
        const { duration, requester } = player.queue.current;
        if(message.author.id !== requester.id && !message.member.hasPermission("ADMINISTRATOR")) { 
            return message.channel.send(`**${author.username}**-sama, this track is requested by **${requester.username}**-sama, you can only move your own requested tracks (-ω- 、)`); 
        }

        const timestamp = convertInput(para.args[0], bot.music.lavalink);

        // checks if the author has requested to move to a valid timestamp, if so continue, if not return a message to inform them
        if(timestamp >= duration) { return message.channel.send(`**${author.username}**-sama, the timestamp should be less than the track length \`${formatLength(duration, false)}\` ლ (¯ ロ ¯ "ლ)`); }
        //console.log(timestamp, player.queue[0].duration);
        
        // try to move to the given timestamp, inform the author if fail
        try{
            await player.seek(timestamp);
            // inform the author if success
            await message.channel.send(`**${author.username}**-sama, ${para.bot.user.username} will now move the current track to position \`${formatLength(timestamp, false)}\``);
        } catch(err) {
            console.log(err);
            message.channel.send(`**${author.username}**-sama, an error has occured while trying to move the track ☆ ｏ (＞ ＜ ；) ○, ${bot.user.username} has informed **${bot.author.username}**-sama`);
        } 
    } // end of run
}; // end of module.exports 



    
