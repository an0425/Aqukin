/* This module allows the author to toggle looping/unlooping the current track */
const { voteConstruct } = require("../../utilities/voting_system");
//const { musicEmbed } = require("../../utilities/embed_constructor");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class LoopTrackCommand extends BaseCommand{
    constructor() { 
        super("looptrack", ["lt", "ls", "loopsong"], "Toggle looping/unlooping the current track", "CONNECT", "music", false, "", "-- will toggle looping/unlooping the track");
    }

    async run(para){
        // shortcut variables
        const { message, player } = para;
        const author = message.author.username;
        
        if(player.queueRepeat) { return message.channel.send(`**${author}**-sama, please cancel the queue loop first before looping the track (￣ω￣;)`); }

        // voting system
        const voteReached = await voteConstruct(para.bot, message, player, para.command);
        if(!voteReached) { return; }

        try {
            player.trackRepeat = !player.trackRepeat; // toggle track loop

            let reply = player.trackRepeat ? `will now \`loop the current track\` (ﾉ ≧ ∀ ≦) ﾉ` : `\`stop looping the current track\` (* ￣ ▽ ￣) b`;
            message.channel.send(`**${author}**-sama, ${para.bot.user.username} will now ${reply}`);   

            // Update the currently playing embed
            player.updateEmbed(para.bot);
        } catch(err) { console.log(err); }
    } // end of run
}; // end of module.exports 



    
