/* This module allows the author to shuffle the music queue */
const BaseCommand = require('../../utilities/structures/BaseCommand');

module.exports = class ShuffleQueueCommand extends BaseCommand {
  constructor () {super("shufflequeue", ["sq", "shuffle"], "Shuffle the audio player's queue", "ADMINISTRATOR", "music", false, false, "", "-- will shuffle the queue");}

  async run (para) {
    // shortcut variables
    const { message, player } = para;

    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.size <= 1) { return message.channel.send(`**${author}**-sama, there is only one track in the queue _(´ㅅ\`)⌒)\\_`); }
    await shuffle(player.queue);
    message.channel.send(`**${message.author.username}**-sama, Aqukin has shuffled the queue (\`･ω･´)`); // informs the author
  } // end of run
} // end of module.exports

async function shuffle(queue){
  for(let i = queue.length-1; i>0; i--){
    let j = Math.floor(Math.random() * (i + 1));
    while(j===0){
      j = Math.floor(Math.random() * (i + 1));
    }
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
}