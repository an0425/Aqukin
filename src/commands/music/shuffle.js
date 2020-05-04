/* This module allows the author to shuffle the music queue */
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class ShuffleQueueCommand extends BaseCommand {
  constructor () {super("shuffle", ["random"], "Shuffle the music queue", "CONNECT", "music", false, "");}

  async run (para) {
    // shortcut variables
    const msg = para.message
    const player = para.player;
    
    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) return msg.channel.send(`**${author}**-sama, the audio queue is currently empty :(`);
    player.queue.shuffle();// shuffles the queue
    msg.channel.send(`**${msg.author.username}**-sama, Aqukin has shuffled the queue`); // informs the author
  } // end of run
} // end of module.exports