/* This module allows the author to stop Aqukin current audio streaming and disconnect her from the voice channel */
const { voteConstruct } = require("../../utilities/voting_system");
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DisconnectCommand extends BaseCommand{
    constructor() {super("disconnect", ["dc", "leave"], "Disconnect Aqukin from the voice channel", "CONNECT", "music", false, "", "-- will disconnect Aqukin from the voice channel")}

    async run (para) {
      // shortcut variables
      const { player } = para;

      const voteReached = await voteConstruct(para.bot, para.message, player, para.command);
      if(!voteReached) { return; }

      try {
        player.queue.splice(0);
        await player.connection.disconnect();  
      } catch(err) { console.log(err); }
    } // end of run
}; // end of module.exports


    
