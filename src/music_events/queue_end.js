/* this module represents the "queueEnd" event for erela.js */
const BaseEvent = require('../utils/structures/BaseEvent');

module.exports = class TrackStartEvent extends BaseEvent {
  constructor () {
    super("queueEnd");
  }

  async run (bot, player) {
    player.textChannel.send("The queue has ended, arigatou gozamatshita~.")
    //bot.music.players.destroy(player.guild.id); // destroy the music player
  }
}