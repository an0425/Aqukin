/* this module represents the "trackStart" event for erela.js */
const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {
    super("trackStart");
  }

  async run (client, player, track) {
    const sentMessage = await player.textChannel.send(`Aqukin is now playing -> **${track.title}**`);
        await sentMessage.delete({ timeout: 60000 });
  }
}