/* this module represents the "trackStuck" event for erela.js, emitted when there's an error with the track not being able to play */
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class MusicErrorrEvent extends BaseEvent {
  constructor () {super("trackStuck");}

  async run (music, player, track, message) {
    const creator = await para.bot.users.fetch("422435290054000640");
    await player.textChannel.send(`**${track.requester.username}**-sama, there was an error occured when playing track **${track.tittle}**, Aqukin has informed **${creator.username}**-sama and will now skip to the next track`);
    await player.stop();
  } // end of run
} // end of module.exports