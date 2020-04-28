/* This module allows the author to resume Aqukin current audio streaming */
const BaseCommand = require("../../utils/structures/BaseCommand");

module.exports = class ResumeCommand extends BaseCommand{
    constructor() {super("resume",[], "CONNECT", "music", false, false, "")}

    run(para){
        // shortcut variables
        const msg = para.message;
        const author = para.message.author.username;
        const { id } = msg.guild;
        const player = para.bot.music.players.get(id);
        
        // checks if the player is already playing, if so return a message to inform the author
        if (player.playing) return msg.channel.send(`**${author}**-sama, Aqukin is already streaming audio.`);
        player.pause(false); // resume streaming audio
    }
};



    
