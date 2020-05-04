/* this module represents the "trackStart" event for erela.js */
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {
    super("trackStart");
  }

  async run (music, player, track) {
    music.skipCount = 0;
    music.skippers.clear();
    player.setEQ([
      { band: 0, gain: 0.15 },
      { band: 1, gain: 0.15 },
      { band: 2, gain: 0.15 }
    ]);
    const sentMessage = await player.textChannel.send(`Aqukin is now playing -> **${track.title}**`); // send a message to inform about the now playing track
    await sentMessage.delete({ timeout: 60000 }).catch((err) => console.log("The message has already been manually deleted\n",err)); // try catch in case the message got deleted manually
  } // end of run
} // end of module.exports