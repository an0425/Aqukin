/* This module allows the author to clear the music queue */
const BaseCommand = require("../../utilities/structures/BaseCommand");

module.exports = class ClearQueueCommand extends BaseCommand {
  constructor () {super("clear", [], "Clear the music queue", "CONNECT", "music", false, true, "");}

  async run (para) {
    // shortcut variables
    const {message, player, voteReached} = para;
    if(!voteReached) return;
    const author = message.author.username;

    // checks if the current queue is empty, if so return a message to inform the author
    if(player.queue.empty) return message.channel.send(`**${author}**-sama, the audio queue is currently empty~`, para.ridingAqua);
    player.queue.clear();
    message.channel.send(`**${author}**-sama, Aqukin has cleared the queue`);
  }
}