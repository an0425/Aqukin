/* This module allows the author to resume Aqukin current audio streaming */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ResumeCommand extends BaseCommand{
    constructor() {super("resume", ["continue"], "Resume Aqukin current audio streaming", "CONNECT", "music", false, true, "")}

    run(para){
        // shortcut variables
        const {message, player, voteReached} = para;
        if(!voteReached) return;
        const author = para.message.author.username;
        
        // checks if the player is already paused, if so return a message to inform the author
        if (!player.paused) return message.channel.send(`**${author}**-sama, Aqukin audio stream is not paused.`);
        player.paused = false;
        player.pause(false); // pauses streaming audio
        message.channel.send(`**${author}**-sama, Aqukin will now resume streaming audio.`); // informs the author
    } // end of run
}; // end of module.exports



    
