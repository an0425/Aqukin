/* This module allows the author to shuffle the music queue */
const { voteConstruct } = require("../../utilities/voting_system");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ShuffleQueueCommand extends BaseCommand {
    constructor () { super("shufflequeue", ["sq", "shuffle"], "Shuffle the audio player's queue", "CONNECT", "music", false, "", "-- will shuffle the queue"); }

    async run (para) {
        // shortcut variables
        const { message, player } = para;

        // checks if the current queue is empty, if so return a message to inform the author
        if(player.queue.size <= 1) { return message.channel.send(`**${message.author.username}**-sama, there is no point in shuffling the queue ヽ (￣д￣) ノ`); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }
        
        try { 
            await player.queue.shuffle();
            message.channel.send(`**${message.author.username}**-sama, ${para.bot.user.username} has shuffled the queue 乁 (• ω • 乁)`); // informs the author  
        } catch(err) { console.log(err); }
    } // end of run
} // end of module.exports