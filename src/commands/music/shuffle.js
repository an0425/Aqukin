/* This module allows the author to shuffle the music queue */
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class ShuffleQueueCommand extends BaseCommand {
  constructor () {super("shufflequeue", ["shuffle"], "Shuffle the music queue", "CONNECT", "music", false, false, "");}

  async run (para) {
    // shortcut variables
    const {message, player} = para;

    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) return message.channel.send(`**${author}**-sama, the audio queue is currently empty :(`);
    player.queue.shuffle();// shuffles the queue
    message.channel.send(`**${message.author.username}**-sama, Aqukin has shuffled the queue`); // informs the author
  } // end of run
} // end of module.exports