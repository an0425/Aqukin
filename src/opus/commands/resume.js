/* This module allows the author to resume the bot current audio streaming */
const { voteConstruct } = require("../../utilities/voting_system");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ResumeCommand extends BaseCommand{
    constructor() { super("resume", ["rs", "continue"], "Resume the audio player", "CONNECT", "music", false, "", "-- will resume the audio player if paused"); }

    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;
        
        // checks if the player is already paused, if so return a message to inform the author
        if (!player.connection.dispatcher.paused) { return message.channel.send(`**${author}**-sama, the player is not paused (つ ω\`｡)`); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try{
            //console.log(player.connection.dispatcher);
            await player.connection.dispatcher.resume();
            await para.bot.player.resume(message);
            message.channel.send(`**${author}**-sama, ${para.bot.user.username} has resumed audio streaming \\ (★ ω ★) /`);
            
            // Update the currently playing embed
            player.updateEmbed(para.bot);
        } catch(err) { console.log(err); }
    } // end of run
}; // end of module.exports



    
