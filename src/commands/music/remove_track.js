/* This module allows the author to remove the specified track from the queue */
const { checkNum } = require("../../utilities/functions");
const { voteConstruct } = require("../../utilities/voting_system");
const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class RemoveTrackCommand extends BaseCommand {
    constructor () { super("removetrack", ["rt", "rs", "removesong"], "Remove the specified track from the queue, default to the latest enqueued track if leave blank", "CONNECT", "music", false, "[index]", "11 -- will remove track indexed 11 from the queue provided the queue size is larger than 11"); }

    async run (para) {
        // shortcut variables
        const { message, player, bot } = para;
        const author = message.author.username;

        // checks if the current queue is empty, if so return a message to inform the author
        if(player.queue.length <= 1) { return message.channel.send(`**${author}**-sama, ${bot.user.username} there is no track/song next in queue ╮ (︶︿︶) ╭`); }

        const num = await checkNum(para.args[0]-1, player.queue.length-1, 1, true);

        // checks if the current queue is empty, if so return a message to inform the author
        if(player.queue.length-1 < num) { return message.channel.send(`**${author}**-sama, ${bot.user.username} can not find track indexed \`${num}\`, please try \`${para.prefix}queue\` for info about the queue \\_ :( ´ ཀ \`」 ∠): \\_ `); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try {
            const trackName = await player.queue.remove(num).title;
            message.channel.send(`**${author}**-sama, ${bot.user.username} has removed track \`${trackName}\` from the queue (っ ˘ω˘ς)`); 
            
            // Update the currently playing embed
            const embed = await musicEmbed(para.bot, player, player.queue.current)
            await player.sentMessage.edit(embed) // send the embed to inform about the now playing track
                .catch(async err => { player.sentMessage = await player.textChannel.send(embed); });
        } catch(err) { console.log(err); }
    } // end of run
} // end of module.exports