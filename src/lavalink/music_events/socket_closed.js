/* this module represents the "socketClosed" event for erela.js, emitted when the music player voice channel connection is closed */
const BaseEvent = require("../../utilities/structures/BaseEvent");

module.exports = class socketClosedEvent extends BaseEvent {
    constructor () {super("socketClosed");}
  
    async run (bot, player, payload) {
        if(payload.code === 4006)
            await player.destroy();
    } // end of run
} // end of module.exports 