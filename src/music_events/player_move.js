/* this module represents the "playerMove" event for erela.js */
const BaseEvent = require("../utils/structures/BaseEvent");

module.exports = class PlayerMoveEvent extends BaseEvent {
    constructor () {
      super("playerMove");
    }
  
    async run (music, player, oldChannel, newChannel) {
        try{  player.voiceChannel = newChannel; } catch (err) {console.log(err);} // try catch in case something went wrong
    } // end of run
} // end of module.exports