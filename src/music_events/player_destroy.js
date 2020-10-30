/* this module represents the "playerDestroy" event for erela.js, emitted when a music player is destroyed */
const BaseEvent = require("../utilities/structures/BaseEvent");

module.exports = class PlayerDestroyEvent extends BaseEvent {
  constructor () {super("playerDestroy");}
  
  async run (bot, player) {
    // deletes the now playing message and reset all variables
    try{ await player.sentMessage.delete(); }
    catch(err) { console.log("The message has already been manually deleted\n", err) }; // try catch in case the message got deleted manually
    bot.votingSystem.clear();
  } // end of run
} // end of module.exports