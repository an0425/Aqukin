/* this module represents the "queueEnd" event for erela.js */
const {MessageAttachment} = require("discord.js");
const BaseEvent = require('../utilities/structures/BaseEvent');

module.exports = class QueueEnd extends BaseEvent {
  constructor () {
    super("queueEnd");
  }

  async run (music, player) {
     // interaction
     try {
      // delete the currently playing message if there's any and inform the users
      if (player.sentMessage) await player.sentMessage.delete().catch((err) => console.log("The message has already been manually deleted\n",err)); // try catch in case the message got deleted manually
      player.textChannel.send(`The queue has ended, arigatou gozamatshita~`);
      const sentMessage = await player.textChannel.send(new MessageAttachment("./src/pictures/bye.gif"));
      await sentMessage.delete({ timeout: 5200 });
     } catch (err) {console.log(err);}
  } // end of run
} // end of module.exports