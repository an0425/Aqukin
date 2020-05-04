/* This module allows the author to pause Aqukin current audio streaming */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class PauseCommand extends BaseCommand{
    constructor() {super("pause", ["wait"], "Pause Aqukin current audio streaming", "CONNECT", "music", false, "")}

    run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const player = para.player;
        
        // checks if the player is already paused, if so return a message to inform the author
        if (player.paused) return msg.channel.send(`**${author}**-sama, Aqukin is already paused.`);
        player.paused = true;
        player.pause(true); // pauses streaming audio
        msg.channel.send(`**${author}**-sama, Aqukin has paused streaming audio.`); // informs the author
    } // end of run
}; // end of module.exports



    
