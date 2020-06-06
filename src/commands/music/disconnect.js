/* This module allows the author to stop Aqukin current audio streaming and disconnect her from the voice channel */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class DisconnectCommand extends BaseCommand{
    constructor() {super("disconnect", ["dc", "leave"], "Disconnect Aqukin from the voice channel", "CONNECT", "music", false, true, "", "-- will disconnect Aqukin from the voice channel")}

    async run (para) {
      // shortcut variables
      const { player, voteReached } = para;
      if(!voteReached) { return; }
      player.queue.splice(0);
      await player.connection.disconnect();
    } // end of run
}; // end of module.exports


    
