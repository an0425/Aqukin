/* this module represents the "trackStuck" event for erela.js, emitted when there's an error with the track not being able to play */
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class MusicErrorEvent extends BaseEvent {
  constructor () {super("trackStuck");}

  async run (music, player, track, message) {
    console.log(message);
    let reply = `**${track.requester.username}**-sama, there was an error occured trying to play track **${track.title}**, Aqukin has informed the creator and will now`;
    if(player.queue.empty) {
      reply += " disconnect~";
      await music.players.destroy(message.guildId);
    }
    else{
      reply += " skip to the next track~";
      await player.queue.add(player.queue[0],1);
      await player.stop(); 
    }
    await player.textChannel.send(reply);
  } // end of run
} // end of module.exports