/* this module represents the "trackStart" event for erela.js */
const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {
    super("trackStart");
  }

  async run (music, player, track) {
    const sentMessage = await player.textChannel.send(`Aqukin is now playing -> **${track.title}**`); // send a message to inform about the now playing track
    try{  
      // resets the skip count and the skippers collection everytime a new track is played
      music.skipCount = 0;
      music.skippers.clear();
      console.log(music.skipCount, music.skippers); 
      await sentMessage.delete({ timeout: 60000 }); // delete the message
  } catch (err) {console.log("The message has already been manually deleted\n",err);} // try catch in case the message got deleted manually
  } // end of run
} // end of module.exports