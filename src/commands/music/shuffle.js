/* This module allows the author to shuffle the music queue */
const BaseCommand = require('../../utils/structures/BaseCommand');

module.exports = class ShuffleQueueCommand extends BaseCommand {
  constructor () {super('shuffle', [], "CONNECT", "music", false, false, "");}

  async run (para) {
    // shortcut variables
    const msg = para.message
    const { id } = msg.guild;
    const player = para.bot.music.players.get(id);
    
    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) return msg.channel.send(`**${author}**-sama, the audio queue is currently empty :(`);
    player.queue.shuffle();
    msg.channel.send(`**${msg.author.username}**-sama, Aqukin has shuffled the queue`);
  }
}