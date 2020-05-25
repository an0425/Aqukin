/* this module represents the "trackStart" event for erela.js, emitted when a track starts */
const {musicEmbed} = require("../utilities/music_embed");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {super("trackStart");}

  async run (music, player, track) {
    player.paused = false;
    // construct the embed
    const embed = await musicEmbed(music, player, track);
    try{player.sentMessage = await player.textChannel.send(embed);} // send the embed to inform about the now playing track
    catch(err) {console.log("The message is terminated abnormally", err);}
  } // end of run
} // end of module.exports