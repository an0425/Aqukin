/* This module allows the author to clear the music queue */
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor () {super("clear", [], "Clear the music queue", "CONNECT", "music", false, "");}

  async run (para) {
    // shortcut variables
    const msg = para.message
    const player = para.player;
    
    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) return msg.channel.send(`**${author}**-sama, the audio queue is currently empty~`, para.ridingAqua);
    player.queue.clear();
    msg.channel.send(`**${msg.author.username}**-sama, Aqukin has cleared the queue`);
  }
}