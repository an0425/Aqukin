/* This module allows the author to stop Aqukin current audio streaming and disconnect her from the voice channel */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DisconnectCommand extends BaseCommand{
    constructor() {super("disconnect", ["dc", "leave"], "Stop/Disconnect Aqukin audio stream", "CONNECT", "music", false, true, "")}

    async run (para) {
      // shortcut variables
      const {bot, message, voteReached} = para;
      if(!voteReached) return;
      
      bot.music.players.destroy(message.guild.id);
    } // end of run
}; // end of module.exports


    
