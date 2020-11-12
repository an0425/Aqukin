/* this module represents the "playerMove" event for erela.js, emitted when a music player being moved between voice channels */
const BaseEvent = require("../../utilities/structures/BaseEvent");

module.exports = class PlayerMoveEvent extends BaseEvent {
    constructor () {super("playerMove");}
  
    async run (bot, player, oldChannel, newChannel) {
        player.voiceChannel = newChannel;
    } // end of run
} // end of module.exports