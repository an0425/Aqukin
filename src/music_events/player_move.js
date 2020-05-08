/* this module represents the "playerMove" event for erela.js, emitted when a music player being moved between voice channels */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class PlayerMoveEvent extends BaseEvent {
    constructor () {super("playerMove");}
  
    async run (music, player, oldChannel, newChannel) {
      player.voiceChannel = newChannel; // try catch in case something went wrong
    } // end of run
} // end of module.exports