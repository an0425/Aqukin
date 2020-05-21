/* this module represents the "queueEnd" event for erela.js, emitted when the queue ends */
const {MessageAttachment} = require("discord.js");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class QueueEnd extends BaseEvent {
  constructor () {super("queueEnd");}

  async run (music, player) {
     // interaction
     try {
      await music.players.destroy(player.guild.id);
      const sentMessage = await player.textChannel.send(`The queue has ended, arigatou gozamatshita~`, new MessageAttachment("src/pictures/bye.gif"));
      await sentMessage.delete({ timeout: 5200 });
     } catch (err) {console.log(err);}
  } // end of run
} // end of module.exports