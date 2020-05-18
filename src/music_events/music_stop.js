/* this module represents the "trackEnd" event for erela.js, emitted when a track stops */
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackEndEvent extends BaseEvent {
  constructor () {super("trackEnd");}

  async run (music, player, track) {
    // reset the variables
    if (player.sentMessage) await player.sentMessage.delete().catch((err) => console.log("The message has already been manually deleted\n",err)); // try catch in case the message got deleted manually
    music.votingSystem.clear();
  } // end of run
} // end of module.exports